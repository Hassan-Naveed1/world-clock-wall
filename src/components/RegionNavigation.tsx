interface RegionNavigationProps {
  regions: string[]
  selectedRegion: string
  onSelect: (region: string) => void
}

function RegionNavigation({
  regions,
  selectedRegion,
  onSelect,
}: RegionNavigationProps) {
  return (
    <nav className="region-navigation" aria-label="Browse by region">
      <button
        type="button"
        className={selectedRegion === 'All' ? 'active' : ''}
        onClick={() => onSelect('All')}
      >
        All regions
      </button>

      {regions.map(region => (
        <button
          key={region}
          type="button"
          className={selectedRegion === region ? 'active' : ''}
          onClick={() => onSelect(region)}
        >
          {region}
        </button>
      ))}
    </nav>
  )
}

export default RegionNavigation