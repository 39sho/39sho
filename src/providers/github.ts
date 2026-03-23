import { config } from "../config"
import type { CardData, HeatmapDay, HourlyBucket, LanguageStat, ProfileData } from "./types"

type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

type ProfileQueryData = {
  user: {
    login: string
    name: string | null
    bio: string | null
    avatarUrl: string
    url: string
    followers: { totalCount: number }
  } | null
}

type RepositoriesQueryData = {
  user: {
    repositories: {
      nodes: Array<{
        name: string
        stargazerCount: number
        languages: {
          edges: Array<{
            size: number
            node: { name: string; color: string | null }
          }>
        }
      }>
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
    }
  } | null
}

type RepositoryNode = {
  name: string
  stargazerCount: number
  languages: {
    edges: Array<{
      size: number
      node: { name: string; color: string | null }
    }>
  }
}

type ContributionsQueryData = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: Array<{
          contributionDays: Array<{
            date: string
            contributionCount: number
            contributionLevel:
              | "NONE"
              | "FIRST_QUARTILE"
              | "SECOND_QUARTILE"
              | "THIRD_QUARTILE"
              | "FOURTH_QUARTILE"
          }>
        }>
      }
      commitContributionsByRepository: Array<{
        repository: {
          isPrivate: boolean
          owner: { login: string }
        }
        contributions: {
          nodes: Array<{ occurredAt: string }>
        }
      }>
    }
  } | null
}

type ContributionLevel = "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE"

const PROFILE_QUERY = `
query ProfileQuery($username: String!) {
  user(login: $username) {
    login
    name
    bio
    avatarUrl(size: 128)
    url
    followers {
      totalCount
    }
  }
}
`

const REPOS_QUERY = `
query RepositoriesQuery($username: String!, $first: Int!, $after: String) {
  user(login: $username) {
    repositories(
      first: $first
      after: $after
      ownerAffiliations: OWNER
      privacy: PUBLIC
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      nodes {
        name
        stargazerCount
        languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`

const CONTRIBUTIONS_QUERY = `
query ContributionsQuery($username: String!, $from: DateTime!, $to: DateTime!, $maxRepositories: Int!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
      commitContributionsByRepository(maxRepositories: $maxRepositories) {
        repository {
          isPrivate
          owner {
            login
          }
        }
        contributions(first: 100) {
          nodes {
            occurredAt
          }
        }
      }
    }
  }
}
`

async function githubGraphQL<T>(token: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "profile-card-worker"
    },
    body: JSON.stringify({ query, variables })
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed: ${response.status}`)
  }

  const payload = (await response.json()) as GraphQLResponse<T>
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((entry) => entry.message).join("; "))
  }
  if (!payload.data) {
    throw new Error("GitHub GraphQL returned empty data")
  }
  return payload.data
}

function mapContributionLevel(level: ContributionLevel): 0 | 1 | 2 | 3 | 4 {
  switch (level) {
    case "FIRST_QUARTILE":
      return 1
    case "SECOND_QUARTILE":
      return 2
    case "THIRD_QUARTILE":
      return 3
    case "FOURTH_QUARTILE":
      return 4
    default:
      return 0
  }
}

function hourInTimezone(iso: string, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    hour12: false,
    hourCycle: "h23"
  }).formatToParts(new Date(iso))

  const hourPart = parts.find((part) => part.type === "hour")
  const hour = Number(hourPart?.value ?? "0")
  return Number.isFinite(hour) && hour >= 0 && hour <= 23 ? hour : 0
}

function normalizeProfile(data: ProfileQueryData): ProfileData {
  const user = data.user
  if (!user) {
    throw new Error("GitHub user not found")
  }

  return {
    login: user.login,
    name: user.name ?? user.login,
    bio: user.bio ?? "No bio yet.",
    avatarUrl: user.avatarUrl,
    url: user.url
  }
}

function aggregateLanguages(repositories: RepositoryNode[]): LanguageStat[] {
  const languageMap = new Map<string, { size: number; color: string }>()
  for (const repository of repositories) {
    for (const edge of repository.languages.edges) {
      const existing = languageMap.get(edge.node.name)
      const color = edge.node.color ?? "#9aa4b2"
      if (!existing) {
        languageMap.set(edge.node.name, { size: edge.size, color })
      } else {
        languageMap.set(edge.node.name, { size: existing.size + edge.size, color: existing.color })
      }
    }
  }

  return Array.from(languageMap.entries())
    .map(([name, value]) => ({ name, size: value.size, color: value.color }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5)
}

function normalizeHeatmap(data: ContributionsQueryData): HeatmapDay[] {
  const weeks = data.user?.contributionsCollection.contributionCalendar.weeks ?? []
  const days = weeks.flatMap((week) => week.contributionDays)
  return days.slice(-config.limits.contributionsDays).map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level: mapContributionLevel(day.contributionLevel)
  }))
}

function normalizeHourlyCommits(data: ContributionsQueryData, username: string, timeZone: string): HourlyBucket[] {
  const buckets = new Array<number>(24).fill(0)
  const repositories = data.user?.contributionsCollection.commitContributionsByRepository ?? []

  for (const repositoryContribution of repositories) {
    if (repositoryContribution.repository.isPrivate) {
      continue
    }
    if (repositoryContribution.repository.owner.login.toLowerCase() !== username.toLowerCase()) {
      continue
    }

    for (const node of repositoryContribution.contributions.nodes) {
      const hour = hourInTimezone(node.occurredAt, timeZone)
      buckets[hour] += 1
    }
  }

  return buckets.map((count, hour) => ({ hour, count }))
}

export async function fetchGitHubCardData(token: string): Promise<CardData> {
  const username = config.github.username
  const now = new Date()
  const from = new Date(now)
  from.setUTCDate(from.getUTCDate() - 90)

  const profileData = await githubGraphQL<ProfileQueryData>(token, PROFILE_QUERY, {
    username
  })
  const profile = normalizeProfile(profileData)

  const repositories: RepositoryNode[] = []
  let cursor: string | null = null

  while (repositories.length < config.limits.maxReposForStars) {
    const pageData: RepositoriesQueryData = await githubGraphQL<RepositoriesQueryData>(token, REPOS_QUERY, {
      username,
      first: 40,
      after: cursor
    })

    const pageRepositories: RepositoryNode[] = pageData.user?.repositories.nodes ?? []
    repositories.push(...pageRepositories)
    const pageInfo: { hasNextPage: boolean; endCursor: string | null } | undefined = pageData.user?.repositories.pageInfo
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      break
    }
    cursor = pageInfo.endCursor
  }

  const contributionsData = await githubGraphQL<ContributionsQueryData>(token, CONTRIBUTIONS_QUERY, {
    username,
    from: from.toISOString(),
    to: now.toISOString(),
    maxRepositories: config.limits.maxReposForCommitHistogram
  })

  const totalStars = repositories.reduce((sum: number, repository: RepositoryNode) => sum + repository.stargazerCount, 0)
  const languages = aggregateLanguages(repositories)

  return {
    profile,
    stats: {
      publicRepos: repositories.length,
      followers: profileData.user?.followers.totalCount ?? 0,
      totalStars
    },
    languages,
    contributionHeatmap: normalizeHeatmap(contributionsData),
    hourlyCommits: normalizeHourlyCommits(contributionsData, username, config.card.timezone),
    windowLabel: `Last 90 days (${config.card.timezone})`
  }
}
