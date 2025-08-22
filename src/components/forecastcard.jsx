import dayjs from 'dayjs'
import Icon from './icon'

export default function ForecastCard({ item }){
  const d = dayjs(item.date).format('ddd')
  return (
    <div className="tile">
      <div className="small">{d}</div>
      <Icon code={item.icon} size={64} alt={item.desc} />
      <div className="big">{item.temp}°</div>
      <div className="small">{item.min}° / {item.max}°</div>
    </div>
  )
}