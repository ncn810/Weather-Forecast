import { useState } from 'react'
import dayjs from 'dayjs'
import useWeather from './features/weather/useWeather'
import SearchBar from './components/searchbar'
import UnitToggle from './components/unittoggle'
import ForecastCard from './components/forecastcard'
import HighlightCard from './components/highlightcard'
import Icon from './components/icon'

export default function App(){
  const [query, setQuery] = useState('Ho Chi Minh')
  const [unit, setUnit] = useState('metric')
  const { loading, error, data } = useWeather(query, unit)

  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'km/h' : 'mph' // OWM trả m/s → đổi sang km/h hoặc mph

  const current = data?.current
  const dstr = current ? dayjs(current.dt*1000).format('dddd, HH:mm') : ''
  const location = data?.loc ? `${data.loc.name}${data.loc.state ? ', '+data.loc.state:''}, ${data.loc.country}` : ''
  const rainProb = Math.round((data?.pop ?? 0) * 100)

  function windDisplay(ms){
    if (unit === 'metric') return Math.round(ms * 3.6)
    return Math.round(ms * 2.23694)
  }

  const h = data?.highlights

  return (
    <div className="app">
      <div className="left">
        <SearchBar onSearch={setQuery} />
        <div className="kv">
          <div className="location">📍 {location || '—'}</div>
          <UnitToggle unit={unit} setUnit={setUnit} />
        </div>

        <div className="hero">
          <Icon code={current?.weather?.[0]?.icon} alt={current?.weather?.[0]?.description} />
          <div className="temp">{current ? Math.round(current.main.temp) : '—'}{tempUnit}</div>
          <div className="desc">
            <span>{current?.weather?.[0]?.main || '—'}</span>
          </div>
        </div>

        <div className="tile">
          <div className="small">{dstr}</div>
          <div className="small">• {current?.weather?.[0]?.description || '—'}</div>
          <div className="small">• Rain: {rainProb}%</div>
        </div>
      </div>

      <div className="right">
        <div className="header">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div className="tab">Week</div>
          </div>
        </div>

        <div className="grid">
          {loading && Array.from({length:6}).map((_,i)=>(<div key={i} className="tile small">Loading…</div>))}
          {!loading && data?.daily?.map((d,i)=>(<ForecastCard key={i} item={d} />))}
          {!loading && !data?.daily && <div className="small">No forecast</div>}
        </div>

        <div className="header" style={{marginTop:8}}>
          <div className="tab">Today&apos;s Highlights</div>
        </div>

        <div className="highlights">
          <HighlightCard title="Wind Status" value={current ? windDisplay(current.wind.speed) : '—'} suffix={` ${speedUnit}`} hint={h ? h.wind.dir : ''} />
          <HighlightCard title="Humidity" value={current ? current.main.humidity : '—'} suffix=" %" hint={h ? (h.humidity < 30 ? 'Dry' : h.humidity>70 ? 'Humid' : 'Normal') : ''} />
          <HighlightCard title="Visibility" value={h ? (h.visibility?.toFixed(1)) : '—'} suffix=" km" hint="Average" />

          <div className="tile">
            <div className="small">Sunrise & Sunset</div>
            <div className="kv" style={{marginTop:8}}>
              <div>
                <div className="small">Sunrise</div>
                <div className="big">{h?.sunrise ? dayjs(h.sunrise*1000).format('h:mm A') : '—'}</div>
              </div>
              <div>
                <div className="small">Sunset</div>
                <div className="big">{h?.sunset ? dayjs(h.sunset*1000).format('h:mm A') : '—'}</div>
              </div>
            </div>
          </div>
        
          <div className="tile">
            <div className="small">Air Quality</div>
            <div className={`big ${h?.aqi ? (h.aqi<=100?'aqi-good':h.aqi<=150?'aqi-moderate':'aqi-unhealthy') : ''}`}>{h?.aqi ?? '—'}</div>
            <div className="small" style={{marginTop:4}}>{h?.aqiCat ?? ''}</div>
          </div>
        </div>

        {error && <div className="tile" style={{border:'1px solid #fee2e2', background:'#fff1f2', color:'#991b1b'}}>⚠️ {error}</div>}
      </div>
    </div>
  )
}