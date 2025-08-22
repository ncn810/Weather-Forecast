import { useEffect, useState } from 'react'
import { geocodeCity, getCurrent, getForecast, getAir } from './api'
import { buildDailyFromForecast, makeHighlights } from './map'


export default function useWeather(query, units){
  const [state, setState] = useState({ loading: false, error: null, data: null, loc: null })

  useEffect(() => {
    let cancelled = false
    async function run(){
      setState(s => ({ ...s, loading: true, error: null }))
      try{
        const q = query?.trim() || 'New York'
        const loc = await geocodeCity(q)
        const [current, forecast, air] = await Promise.all([
          getCurrent(loc.lat, loc.lon, units),
          getForecast(loc.lat, loc.lon, units),
          getAir(loc.lat, loc.lon),
        ])
        const daily = buildDailyFromForecast(forecast.list)
        const highlights = makeHighlights(current, air, null)
        const pop = forecast?.list?.[0]?.pop ?? 0
        const data = { current, daily, highlights, pop, loc }
        if (!cancelled) setState({ loading:false, error:null, data, loc })
      }catch(e){
        if (!cancelled) setState({ loading:false, error: e.message || 'Lỗi tải dữ liệu', data:null, loc:null })
      }
    }
    run()
    return () => { cancelled = true }
  }, [query, units])

  return state
}