import { useEffect, useRef, useState } from 'react'
import { FaSearchLocation } from 'react-icons/fa'
import { searchCities } from '../features/weather/api.js'

export default function SearchBar({ onSearch }){
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [active, setActive] = useState(-1)
  const boxRef = useRef(null)

  // Debounce gọi API khi gõ
  useEffect(() => {
    const q = text.trim()
    if (q.length < 2){ setSuggestions([]); setOpen(false); return }
    const id = setTimeout(async () => {
      try{
        const list = await searchCities(q, 6)
        setSuggestions(list)
        setOpen(true)
        setActive(-1)
      // eslint-disable-next-line no-unused-vars
      }catch(_e){ /* ignore */ }
    }, 250)
    return () => clearTimeout(id)
  }, [text])

  function submit(e){
    e.preventDefault()
    const q = text.trim()
    if(!q) return
    setOpen(false)
    onSearch(q)
  }

  function pick(item){
    const label = `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`
    setText(label)
    setOpen(false)
    onSearch(label)
  }

  function onKeyDown(e){
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown'){
      e.preventDefault()
      setActive(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp'){
      e.preventDefault()
      setActive(i => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter'){
      if (active >= 0) { e.preventDefault(); pick(suggestions[active]) }
    } else if (e.key === 'Escape'){
      setOpen(false)
    }
  }

  return (
    <div className="searchbar" style={{position:'relative'}} ref={boxRef}>
      <form onSubmit={submit} style={{display:'flex', gap:8, flex:1}}>
        <input
          placeholder="Search for places…"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onFocus={()=> suggestions.length && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button title="Search" type="submit"><FaSearchLocation /></button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="suggest">
          {suggestions.map((s, i) => (
            <div
              key={`${s.name}-${s.lat}-${s.lon}-${i}`}
              className={`suggest-item${i===active?' active':''}`}
              onMouseDown={()=>pick(s)}
              title={`${s.lat}, ${s.lon}`}
            >
              {s.name}{s.state ? `, ${s.state}` : ''}, {s.country}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}