export default function UnitToggle({ unit, setUnit }){
  return (
    <div className="unit-toggle">
      <button
        className={unit==='metric' ? 'active' : ''}
        onClick={()=>setUnit('metric')}
        type="button"
        aria-label="Celsius"
      >°C</button>
      <button
        className={unit==='imperial' ? 'active' : ''}
        onClick={()=>setUnit('imperial')}
        type="button"
        aria-label="Fahrenheit"
      >°F</button>
    </div>
  )
}