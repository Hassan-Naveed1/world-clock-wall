
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import type { WorldClock } from '../types/clock'
import { worldClocks } from '../utils/timezones'

interface WorldMapProps {
  currentTime: Date
}

interface MapLocation {
  timezone: string
  latitude: number
  longitude: number
  city?: string
  region?: string
}

interface MapClock {
  timezone: string
  city: string
  latitude: number
  longitude: number
}

const mapLocations: MapLocation[] = [
  { timezone: 'Europe/London', latitude: 51.5072, longitude: -0.1276 },
  { timezone: 'America/New_York', latitude: 40.7128, longitude: -74.0060 },
  { timezone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437 },
  { timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832 },
  { timezone: 'America/Sao_Paulo', latitude: -23.5505, longitude: -46.6333 },
  { timezone: 'Asia/Dubai', latitude: 25.2048, longitude: 55.2708 },
  { timezone: 'Asia/Karachi', latitude: 24.8607, longitude: 67.0011 },
  { timezone: 'Asia/Kolkata', latitude: 19.0760, longitude: 72.8777 },
  { timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198 },
  { timezone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093 },
  { timezone: 'Pacific/Auckland', latitude: -36.8509, longitude: 174.7645 },
]

function WorldMap({ currentTime }: WorldMapProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<MapLocation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [customLocations, setCustomLocations] = useState<MapLocation[]>(() => {
    try {
      const saved = localStorage.getItem('world-clock-map-cities')
      return saved ? JSON.parse(saved) as MapLocation[] : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(
      'world-clock-map-cities',
      JSON.stringify(customLocations)
    )
  }, [customLocations])


  async function searchCities(queryText = searchQuery) {
    const query = queryText.trim()

    if (!query) return

    setIsSearching(true)
    setSearchError('')
    setSuccessMessage('')
    setSearchResults([])

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`
      )

      if (!response.ok) {
        throw new Error('City search failed.')
      }

      const results = await response.json()

      const cities: MapLocation[] = results.map((item: {
        lat: string
        lon: string
        name: string
        display_name: string
      }) => ({
        latitude: Number(item.lat),
        longitude: Number(item.lon),
        timezone: '',
        city: item.name,
        region: item.display_name,
      }))

      setSearchResults(cities)

      if (cities.length === 0) {
        setSearchError('No cities found. Try another search.')
      }
    } catch (error) {
      console.error('City search error:', error)
      setSearchError('Unable to search for cities. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const query = searchQuery.trim()

    if (query.length < 2) {
      setSearchResults([])
      setSearchError('')
      return
    }

    const timeout = setTimeout(() => {
      searchCities(query)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [searchQuery])


  async function addCity(city: MapLocation) {
    setSearchError('')

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m`
      )

      if (!response.ok) {
        throw new Error('Unable to retrieve timezone.')
      }

      const data = await response.json()
      const timezone = data.timezone as string

      if (!timezone) {
        throw new Error('Timezone not found.')
      }

      const alreadyExists = mapLocations.some(
        location => location.timezone === timezone
      ) || customLocations.some(
        location =>
          location.timezone === timezone &&
          location.city === city.city
      )

      if (alreadyExists) {
        setSearchError('This city is already on the map.')
        return
      }

        setCustomLocations(previous => [
        ...previous,
        { ...city, timezone },
        ])

        setSuccessMessage(`${city.city} added successfully!`)
        setSearchError('')
        setSearchResults([])
        setSearchQuery('')
    } catch {
      setSearchError('Unable to add this city. Please try again.')
    }
  }

  function removeCity(timezone: string, city: string) {
    setCustomLocations(previous =>
      previous.filter(
        location =>
          !(location.timezone === timezone && location.city === city)
      )
    )
  }

  function getLocalTime(timezone: string) {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).format(currentTime)
  }

  function getUtcOffset(timezone: string) {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(currentTime)
      .find(part => part.type === 'timeZoneName')?.value ?? 'UTC'
  }

  const defaultLocations: MapClock[] = mapLocations.flatMap(location => {
    const clock: WorldClock | undefined = worldClocks.find(
      item => item.timezone === location.timezone
    )

    return clock
      ? [{
          timezone: clock.timezone,
          city: clock.city,
          latitude: location.latitude,
          longitude: location.longitude,
        }]
      : []
  })

  const locations: MapClock[] = [
    ...defaultLocations,
    ...customLocations.map(location => ({
      timezone: location.timezone,
      city: location.city ?? location.timezone,
      latitude: location.latitude,
      longitude: location.longitude,
    })),
  ]

  return (
    <section className="world-map-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">GLOBAL OVERVIEW</span>
          <h2>Explore the world</h2>
        </div>

        <span className="clock-count">
          {locations.length} KEY CITIES
        </span>
      </div>

      <div className="map-search">
        <div className="map-search-input">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') searchCities()
            }}
          />

          <button
            onClick={() => searchCities()}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchError && (
          <p className="map-search-error">{searchError}</p>
        )}
        {successMessage && (
        <p className="map-search-success">
            ✓ {successMessage}
        </p>
        )}

        {searchResults.length > 0 && (
          <div className="map-search-results">
            {searchResults.map((city, index) => (
              <button
                key={`${city.latitude}-${city.longitude}-${index}`}
                className="map-search-result"
                onClick={() => addCity(city)}
              >
                <strong>{city.city}</strong>
                <span>{city.region}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="world-map-container">
        <MapContainer
          center={[20, 10]}
          zoom={2}
          minZoom={2}
          maxZoom={8}
          scrollWheelZoom={false}
          className="world-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map(location => (
            <CircleMarker
              key={`${location.timezone}-${location.city}`}
              center={[location.latitude, location.longitude]}
              radius={7}
              pathOptions={{
                color: '#b49cff',
                fillColor: '#a68aff',
                fillOpacity: 0.95,
                weight: 2,
              }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{location.city}</strong>
                  <span>{location.timezone}</span>
                  <strong className="map-popup-time">
                    {getLocalTime(location.timezone)}
                  </strong>
                  <span>{getUtcOffset(location.timezone)}</span>

                  {customLocations.some(
                    item =>
                      item.timezone === location.timezone &&
                      item.city === location.city
                  ) && (
                    <button
                      onClick={() =>
                        removeCity(location.timezone, location.city)
                      }
                    >
                      Remove city
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <p className="map-caption">
        Select a city marker to view its current local time. Added cities are
        saved in this browser.
      </p>
    </section>
  )
}

export default WorldMap
