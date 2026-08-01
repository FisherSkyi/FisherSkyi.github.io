import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PAGES } from './data.js'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import { About, Projects, Writing, Publications, Talks, Experience, Gallery } from './sections.jsx'

const IDS = PAGES.map((p) => p.id)
const validPage = (id) => (IDS.includes(id) ? id : 'about')
const pageFromHash = () => validPage(window.location.hash.replace(/^#\/?/, ''))

export default function App() {
  const [page, setPageState] = useState(pageFromHash)
  const [theme, setTheme] = useState('dark')
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef(null)

  // Restore saved theme.
  useEffect(() => {
    const saved = localStorage.getItem('letian.theme')
    if (saved === 'light' || saved === 'dark') setTheme(saved)
  }, [])

  // Reflect theme on <html> for tokens + native form controls.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setPage = useCallback((id) => {
    const next = validPage(id)
    setPageState(next)
    setQ('')
    setMenuOpen(false)
    if (window.location.hash.replace(/^#\/?/, '') !== next) {
      window.location.hash = '/' + next
    }
  }, [])

  // Sync when the user navigates via back/forward or edits the hash.
  useEffect(() => {
    const onHash = () => {
      setPageState(pageFromHash())
      setQ('')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('letian.theme', next)
      return next
    })
  }, [])

  // Keyboard shortcuts: j/k move sections, / focuses filter, t toggles theme.
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target
      const typing = el && /^(INPUT|TEXTAREA)$/.test(el.tagName)
      if (e.key === 'Escape' && typing) {
        setQ('')
        el.blur()
        return
      }
      if (typing) return
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
        return
      }
      if (e.key === 't') {
        toggleTheme()
        return
      }
      if (e.key === 'j' || e.key === 'k') {
        const i = IDS.indexOf(page)
        const n = (i + (e.key === 'j' ? 1 : IDS.length - 1)) % IDS.length
        setPage(IDS[n])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page, setPage, toggleTheme])

  const match = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (...parts) => !needle || parts.join(' ').toLowerCase().includes(needle)
  }, [q])

  const crumb = (PAGES.find((p) => p.id === page) || PAGES[0]).label

  return (
    <div className={'app' + (menuOpen ? ' app--menu' : '')} data-theme={theme}>
      <div className="scrim" onClick={() => setMenuOpen(false)} />
      <Sidebar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />
      <main className="main">
        <Topbar q={q} setQ={setQ} crumb={crumb} inputRef={inputRef} onToggleMenu={() => setMenuOpen((v) => !v)} />
        <div className="content">
          {page === 'about' && <About />}
          {page === 'projects' && <Projects match={match} />}
          {page === 'writing' && <Writing match={match} />}
          {page === 'pubs' && <Publications match={match} />}
          {page === 'talks' && <Talks match={match} />}
          {page === 'work' && <Experience match={match} />}
          {page === 'gallery' && <Gallery />}
        </div>
      </main>
    </div>
  )
}
