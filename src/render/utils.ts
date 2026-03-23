export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  if (maxLength <= 1) {
    return text.slice(0, maxLength)
  }
  return `${text.slice(0, maxLength - 1)}...`
}

export function maxOrOne(values: number[]): number {
  const max = Math.max(...values)
  return max > 0 ? max : 1
}
