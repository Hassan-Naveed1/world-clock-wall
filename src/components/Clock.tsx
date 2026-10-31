import type { WorldClock } from '../types/clock'

interface ClockProps {
  clock: WorldClock
  currentTime: Date
  isFavorite: boolean
  onToggleFavorite: (timezone: string) => void
}

function Clock({
  clock,
  currentTime,
  isFavorite,
  onToggleFavorite,
}: ClockProps) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: clock.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  const parts = formatter.formatToParts(currentTime)

  const hours = Number(parts.find(part => part.type === 'hour')?.value ?? 0)
  const minutes = Number(parts.find(part => part.type === 'minute')?.value ?? 0)
  const seconds = Number(parts.find(part => part.type === 'second')?.value ?? 0)

  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6 + seconds * 0.1
  const secondAngle = seconds * 6

  const digitalTime = formatter.format(currentTime)

  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: clock.timezone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(currentTime)

  const offset = new Intl.DateTimeFormat('en-GB', {
    timeZone: clock.timezone,
    timeZoneName: 'shortOffset',
  }).formatToParts(currentTime)
    .find(part => part.type === 'timeZoneName')?.value ?? 'UTC'

  return (
    <article className="clock-card">
      <div className="clock-card-header">
        <div>
          <h2>{clock.city}</h2>
          <p>{clock.region}</p>
        </div>

        <div className="clock-card-actions">
        <button
            type="button"
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(clock.timezone)}
            aria-label={
            isFavorite
                ? `Remove ${clock.city} from favourites`
                : `Add ${clock.city} to favourites`
            }
            aria-pressed={isFavorite}
            title={isFavorite ? 'Remove favourite' : 'Add to favourites'}
        >
            {isFavorite ? '★' : '☆'}
        </button>

        <span className="utc-offset">{offset}</span>
        </div>
      </div>

      <div className="analog-clock">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className="clock-marker"
            style={{ transform: `rotate(${index * 30}deg)` }}
          />
        ))}

        <div
          className="clock-hand hour-hand"
          style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
        />

        <div
          className="clock-hand minute-hand"
          style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
        />

        <div
          className="clock-hand second-hand"
          style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }}
        />

        <div className="clock-centre" />
      </div>

      <div className="clock-information">
        <span className="digital-time">{digitalTime}</span>
        <span className="clock-date">{date}</span>
      </div>
    </article>
  )
}

export default Clock