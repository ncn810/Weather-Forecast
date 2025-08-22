import dayjs from 'dayjs'

// Tính US AQI từ PM2.5 theo chuẩn EPA (đơn giản hoá)
export function pm25ToAqi(val){
  const bps = [
    { Cl: 0.0,   Ch: 12.0,  Il: 0,   Ih: 50,  cat: 'Good' },
    { Cl: 12.1, Ch: 35.4,  Il: 51,  Ih: 100, cat: 'Moderate' },
    { Cl: 35.5, Ch: 55.4,  Il: 101, Ih: 150, cat: 'Unhealthy for SG' },
    { Cl: 55.5, Ch: 150.4, Il: 151, Ih: 200, cat: 'Unhealthy' },
    { Cl: 150.5,Ch: 250.4, Il: 201, Ih: 300, cat: 'Very Unhealthy' },
    { Cl: 250.5,Ch: 500.4, Il: 301, Ih: 500, cat: 'Hazardous' },
  ]
  for (const bp of bps){
    if (val >= bp.Cl && val <= bp.Ch){
      const aqi = Math.round((bp.Ih - bp.Il)/(bp.Ch - bp.Cl) * (val - bp.Cl) + bp.Il)
      return { aqi, category: bp.cat }
    }
  }
  return { aqi: null, category: '—' }
}

// Nhóm forecast 3h → 1 ngày, ưu tiên khung 12:00
export function buildDailyFromForecast(forecastList){
  const byDay = {}
  forecastList.forEach(item => {
    const d = dayjs(item.dt * 1000).format('YYYY-MM-DD')
    byDay[d] = byDay[d] || []
    byDay[d].push(item)
  })
  const days = Object.keys(byDay).sort()
  return days.slice(0, 6).map(d => {
    const arr = byDay[d]
    const noon = arr.find(x => dayjs(x.dt * 1000).hour() === 12) || arr[Math.floor(arr.length/2)]
    return {
      date: d,
      temp: Math.round(noon.main.temp),
      icon: noon.weather[0].icon,
      desc: noon.weather[0].main,
      min: Math.round(Math.min(...arr.map(x=>x.main.temp_min))),
      max: Math.round(Math.max(...arr.map(x=>x.main.temp_max)))
    }
  })
}

export function makeHighlights(current, air, onecall){
  const wind = {
    speed: current?.wind?.speed ?? 0,
    dir: degToCompass(current?.wind?.deg ?? 0)
  }
  const humidity = current?.main?.humidity ?? 0
  const visibility = (current?.visibility ?? 0) / 1000 // km

  let aqi = null, aqiCat = '—'
  const pm25 = air?.list?.[0]?.components?.pm2_5
  if (pm25 != null){
    const r = pm25ToAqi(pm25)
    aqi = r.aqi; aqiCat = r.category
  }
  const uvi = onecall?.current?.uvi ?? null
  const sunrise = current?.sys?.sunrise
  const sunset = current?.sys?.sunset
  return { wind, humidity, visibility, aqi, aqiCat, uvi, sunrise, sunset }
}

export function degToCompass(num) {
  const val = Math.floor((num / 22.5) + 0.5)
  const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
  return arr[(val % 16)]
}