import type { WorldClock } from '../types/clock'
import Clock from './Clock'

interface ClockGridProps {
  clocks: WorldClock[]
  currentTime: Date
  favouriteTimezones: string[]
  onToggleFavorite: (timezone: string) => void
}

function ClockGrid({
  clocks,
  currentTime,
  favouriteTimezones,
  onToggleFavorite,
}: ClockGridProps) {
  if (clocks.length === 0) {
    return (
      <div className="empty-results">
        <h3>No locations found</h3>
        <p>Try another city or time-zone name.</p>
      </div>
    )
  }

  return (
    <div className="clock-grid">
      {clocks.map(clock => (
        <Clock
          key={clock.timezone}
          clock={clock}
          currentTime={currentTime}
          isFavorite={favouriteTimezones.includes(clock.timezone)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}

export default ClockGrid