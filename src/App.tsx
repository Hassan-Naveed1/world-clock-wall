import { useEffect, useMemo, useState } from 'react'
import { worldClocks } from './utils/timezones'

import type { WorldClock } from './types/clock'

import Header from './components/Header'
import ClockGrid from './components/ClockGrid'
import SearchBar from './components/SearchBar'
import RegionNavigation from './components/RegionNavigation'
import 'leaflet/dist/leaflet.css'
import WorldMap from './components/WorldMap'
import './App.css'

const popularTimezones = [
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

function App() {
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null)

  const [favouriteTimezones, setFavouriteTimezones] = useState<string[]>(() => {
  try {
    const saved = localStorage.getItem('world-clock-favourites')
    return saved ? JSON.parse(saved) as string[] : []
  } catch {
    return []
  }
})


  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'world-clock-favourites',
      JSON.stringify(favouriteTimezones)
    )
  }, [favouriteTimezones])


  function toggleFavorite(timezone: string) {
    setFavouriteTimezones(previous =>
      previous.includes(timezone)
        ? previous.filter(item => item !== timezone)
        : [...previous, timezone]
    )
  }
  const regions = useMemo(() => {
    return [...new Set(worldClocks.map(clock => clock.region))]
      .filter(region => region !== 'Other')
      .sort()
  }, [])



  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) return []

    return worldClocks
      .filter(clock =>
        clock.city.toLowerCase().includes(query) ||
        clock.region.toLowerCase().includes(query) ||
        clock.timezone.toLowerCase().includes(query)
      )
      .slice(0, 7)
  }, [searchQuery])


  const displayedClocks = useMemo(() => {
    let results: WorldClock[] = worldClocks

    // If a specific clock has been selected, display only that clock.
    if (selectedTimezone) {
      return results.filter(
        clock => clock.timezone === selectedTimezone
      )
    }

    // Filter by search query.
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()

      results = results.filter(clock =>
        clock.city.toLowerCase().includes(query) ||
        clock.region.toLowerCase().includes(query) ||
        clock.timezone.toLowerCase().includes(query)
      )
    }

    // Filter by selected region.
    if (selectedRegion !== 'All') {
      results = results.filter(
        clock => clock.region === selectedRegion
      )
    }

    // Display all matching results when searching, filtering or browsing.
    if (searchQuery.trim() || selectedRegion !== 'All' || showAll) {
      return results
    }

    // Otherwise, display popular clocks on the homepage.
    return popularTimezones
      .map(timezone =>
        results.find(clock => clock.timezone === timezone)
      )
      .filter((clock): clock is WorldClock => clock !== undefined)

  }, [searchQuery, selectedRegion, showAll, selectedTimezone])

  const favouriteClocks = useMemo(() => {
    return worldClocks.filter(clock =>
      favouriteTimezones.includes(clock.timezone)
    )
  }, [favouriteTimezones])

  const isBrowsingAll =
    searchQuery.trim() !== '' ||
    selectedRegion !== 'All' ||
    showAll

  const sectionTitle = searchQuery.trim()
    ? 'Search results'
    : selectedRegion !== 'All'
      ? `${selectedRegion} time zones`
      : showAll
        ? 'All world time zones'
        : 'Popular world clocks'

  return (
    <main className="app">
      <Header />

      <section className="hero compact-hero">
        <div>
          <span className="eyebrow">
            ONE WORLD. DIFFERENT TIMES.
          </span>

          <h1>
            World Clock <span>Wall.</span>
          </h1>

          <p>
            Explore the current time across the world.
          </p>
        </div>

        <div className="hero-time">
          <span>YOUR LOCAL TIME</span>

          <strong>
            {new Intl.DateTimeFormat('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(currentTime)}
          </strong>
        </div>
      </section>

      <section className="clock-explorer">
        <div className="explorer-heading">
          <div>
            <span className="eyebrow">EXPLORE THE WORLD</span>
            <h2>Find your time zone</h2>
          </div>

          <span className="total-timezones">
            {worldClocks.length} TIME ZONES AVAILABLE
          </span>
        </div>

      <SearchBar
        value={searchQuery}
        suggestions={searchSuggestions}
        onChange={value => {
          setSearchQuery(value)
          setSelectedTimezone(null)
        }}
        onSelect={clock => {
          setSearchQuery(clock.city)
          setSelectedTimezone(clock.timezone)
          setSelectedRegion('All')
          setShowAll(false)
        }}
      />

      <RegionNavigation
        regions={regions}
        selectedRegion={selectedRegion}
        onSelect={setSelectedRegion}
      />
    </section>

    <section className="world-map-section">
      <h2>World Map</h2>
      <div className="world-map-container">
        <WorldMap currentTime={currentTime} />
      </div>
      <p className="map-caption">
        Explore local times across major cities around the world.
      </p>
    </section>

    {!isBrowsingAll && favouriteClocks.length > 0 && (
      <section className="favourites-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              YOUR PERSONAL COLLECTION
            </span>

            <h2>
              Your favourite clocks
              <span className="favourites-star"> ★</span>
            </h2>
          </div>

          <span className="clock-count">
            {favouriteClocks.length} SAVED
          </span>
        </div>

      <ClockGrid
        clocks={favouriteClocks}
        currentTime={currentTime}
        favouriteTimezones={favouriteTimezones}
        onToggleFavorite={toggleFavorite}
      />
      </section>
    )}

      <section className="world-clocks">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {isBrowsingAll ? 'TIME ZONE DIRECTORY' : 'YOUR GLOBAL OVERVIEW'}
            </span>

            <h2>{sectionTitle}</h2>
          </div>

          <span className="clock-count">
            {displayedClocks.length} LOCATIONS
          </span>
        </div>

        {/* MAIN CLOCK GRID */}
        <ClockGrid
          clocks={displayedClocks}
          currentTime={currentTime}
          favouriteTimezones={favouriteTimezones}
          onToggleFavorite={toggleFavorite}
        />

        {!searchQuery.trim() && selectedRegion === 'All' && (
          <div className="directory-action">
            <button
              type="button"
              onClick={() => setShowAll(previous => !previous)}
            >
              {showAll ? 'Show popular clocks' : 'Browse all time zones'}
              <span>{showAll ? '↑' : '→'}</span>
            </button>
          </div>
        )}

        {(searchQuery.trim() || selectedRegion !== 'All') && (
          <div className="directory-action">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedRegion('All')
                setShowAll(false)
              }}
            >
              Clear filters
              <span>×</span>
            </button>
          </div>
        )}
      </section>

    <footer className="site-footer">
      <span>WORLD CLOCK WALL</span>
      <span>TIME CONNECTS US ALL.</span>
      <span>© 2026 Hassan Naveed. All rights reserved.</span>
    </footer>
    </main>
  )
}

export default App