import type { WorldClock } from '../types/clock'

const regionNames: Record<string, string> = {
  Africa: 'Africa',
  America: 'Americas',
  Antarctica: 'Antarctica',
  Arctic: 'Arctic',
  Asia: 'Asia',
  Atlantic: 'Atlantic',
  Australia: 'Australia & Pacific',
  Europe: 'Europe',
  Indian: 'Indian Ocean',
  Pacific: 'Pacific',
}

function getCityName(timezone: string): string {
  if (timezone === 'UTC') {
    return 'UTC'
  }

  const parts = timezone.split('/')
  const city = parts[parts.length - 1]

  return city.replace(/_/g, ' ')
}

function getRegionName(timezone: string): string {
  if (timezone === 'UTC') {
    return 'Other'
  }

  const region = timezone.split('/')[0]

  return regionNames[region] ?? 'Other'
}

function generateWorldClocks(): WorldClock[] {
  const supportedTimezones = Intl.supportedValuesOf('timeZone')

  // Exclude Etc aliases such as Etc/GMT and Etc/UTC.
  const filteredTimezones = supportedTimezones.filter(
    timezone => !timezone.startsWith('Etc/')
  )

  // Add UTC exactly once.
  const uniqueTimezones = [
    ...new Set(['UTC', ...filteredTimezones]),
  ]

  const worldClocks: WorldClock[] = uniqueTimezones.map(timezone => ({
    city: getCityName(timezone),
    region: getRegionName(timezone),
    timezone,
  }))

  return worldClocks.sort((a, b) => {
    if (a.timezone === 'UTC') return -1
    if (b.timezone === 'UTC') return 1

    if (a.timezone === 'Europe/London') return -1
    if (b.timezone === 'Europe/London') return 1

    return a.city.localeCompare(b.city)
  })
}

export const worldClocks = generateWorldClocks()