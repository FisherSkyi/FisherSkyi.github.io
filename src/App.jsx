import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PAGES } from './data.js'
import posts from 'virtual:posts'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Article from './components/Article.jsx'
import { About, Projects, Writing, Publications, Talks, Experience, Gallery, Miscellaneous } from './sections.jsx'

const IDS = PAGES.map((p) => p.id)
const validPage = (id) => (IDS.includes(id) ? id : 'about')

// The hash is the single source of truth for routing:
//   #/post/<slug> → Writing section with that post open
//   #/<page-id>   → one of the eight pages
const parseHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '')
  if (h.startsWith('post/')) {
    return { page: 'writing', postSlug: h.slice(5) || null }
  }
  return { page: validPage(h), postSlug: null }
}

export default function App() {
  const [route, setRoute] = useState(parseHash)
  const [theme, setTheme] = useState('dark')
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef(null)

  const page = route.page

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
    setRoute({ page: next, postSlug: null })
    setQ('')
    setMenuOpen(false)
    if (window.location.hash.replace(/^#\/?/, '') !== next) {
      window.location.hash = '/' + next
    }
  }, [])

  // Sync when the user navigates via back/forward or edits the hash
  // (including #/post/<slug> links from the Writing list).
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash())
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
  // While an article is open, `page` is 'writing', so j/k move sections.
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

  const post = route.postSlug ? posts.find((p) => p.slug === route.postSlug) : null
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
          {page === 'writing' &&
            (post ? (
              <Article post={post} />
            ) : (
              <Writing match={match} posts={posts} />
            ))}
          {page === 'pubs' && <Publications match={match} />}
          {page === 'talks' && <Talks match={match} />}
          {page === 'work' && <Experience match={match} />}
          {page === 'gallery' && <Gallery />}
          {page === 'misc' && <Miscellaneous match={match} />}
        </div>
      </main>
    </div>
  )
}
