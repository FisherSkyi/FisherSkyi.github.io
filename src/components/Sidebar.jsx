import { PAGES, PROFILE } from '../data.js'

export default function Sidebar({ page, setPage, theme, toggleTheme }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__prompt">
          <span>{PROFILE.prompt}</span>
        </div>
        <div className="brand__name">
          {PROFILE.name} <span style={{ color: 'var(--dim)' }}>{PROFILE.nameZh}</span>
        </div>
        <div className="brand__sub">{PROFILE.tagline}</div>
      </div>

      <nav className="nav">
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            className={'nav__item' + (p.id === page ? ' nav__item--active' : '')}
            onClick={() => setPage(p.id)}
            aria-current={p.id === page ? 'page' : undefined}
          >
            <span>{p.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__foot">
        <div className="socials">
          {PROFILE.socials.map((s) => (
            <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="theme-toggle__label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          <span className="theme-toggle__key">T</span>
        </button>
      </div>
    </aside>
  )
}
