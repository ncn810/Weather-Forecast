import axios from 'axios'

const BASE = import.meta.env.VITE_OWM_BASE || 'https://api.openweathermap.org'
const KEY = import.meta.env.VITE_OWM_API_KEY

if (!KEY) {
  console.warn(' Chưa có API key. Tạo file .env và đặt VITE_OWM_API_KEY=...')
}

export async function geocodeCity(q){
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${KEY}`
  const { data } = await axios.get(url)
  if (!data || data.length === 0) throw new Error('Không tìm thấy địa điểm')
  const { lat, lon, name, country, state } = data[0]
  return { lat, lon, name, country, state }
}

export async function getCurrent(lat, lon, units='metric'){
  const url = `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

export async function getForecast(lat, lon, units='metric'){
  const url = `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

export async function getAir(lat, lon){
  const url = `${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${KEY}`
  const { data } = await axios.get(url)
  return data
}

export async function searchCities(q, limit = 6){
  if (!q || q.trim().length < 2) return []
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${KEY}`
  const { data } = await axios.get(url)
  return (data || []).map(({ name, state, country, lat, lon }) => ({ name, state, country, lat, lon }))
}

// Optional: One Call (nếu plan của bạn hỗ trợ)
export async function getOneCall(){
  return null;
  
}