export default function HighlightCard({ title, value, suffix='', hint='', className='' }){
  return (
    <div className={`tile ${className}`}>
      <div className="small">{title}</div>
      <div className="big">{value}{suffix}</div>
      {hint && <div className="small" style={{marginTop:4}}>{hint}</div>}
    </div>
  )
}