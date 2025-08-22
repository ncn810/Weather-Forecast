export default function Icon({ code, size=120, alt='' }){
  if(!code) return null
  const src = `https://openweathermap.org/img/wn/${code}@4x.png`
  const style = { width:size, height:size, objectFit:'contain' }
  return <img src={src} alt={alt} style={style} />
}