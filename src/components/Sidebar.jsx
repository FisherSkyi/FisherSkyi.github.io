import {
  User,
  FolderGit2,
  PenLine,
  FileText,
  Mic,
  Briefcase,
  Camera,
  Sun,
  Moon,
  GraduationCap,
  Mail,
  SquareCode,
  BriefcaseBusiness,
} from 'lucide-react'
import { PAGES, PROFILE } from '../data.js'

// Map each section id to a Lucide icon.
const NAV_ICONS = {
  about: User,
  projects: FolderGit2,
  writing: PenLine,
  pubs: FileText,
  talks: Mic,
  work: Briefcase,
  gallery: Camera,
}

// Optional icons for social links (brand marks like GitHub/LinkedIn were
// removed from Lucide, so those stay label-only).
const EXTERNAL_LINK_ICONS = {
  'Google Scholar': GraduationCap,
  Email: Mail,
  GitHub: SquareCode,
  LinkedIn: BriefcaseBusiness
}

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
        {PAGES.map((p) => {
          const Icon = NAV_ICONS[p.id]
          return (
            <button
              key={p.id}
              className={'nav__item' + (p.id === page ? ' nav__item--active' : '')}
              onClick={() => setPage(p.id)}
              aria-current={p.id === page ? 'page' : undefined}
            >
              {Icon && <Icon className="nav__icon" size={16} strokeWidth={1.75} aria-hidden="true" />}
              <span>{p.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar__foot">
        <div className="socials">
          {PROFILE.socials.map((s) => {
            const Icon = EXTERNAL_LINK_ICONS[s.label]
            return (
              <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {Icon && <Icon size={13} strokeWidth={1.75} aria-hidden="true" />}
                {s.label}
              </a>
            )
          })}
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="theme-toggle__side">
            {theme === 'dark' ? <Moon size={14} strokeWidth={1.75} /> : <Sun size={14} strokeWidth={1.75} />}
            <span className="theme-toggle__label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </span>
          <span className="theme-toggle__key">T</span>
        </button>
      </div>
    </aside>
  )
}
