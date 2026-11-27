import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { DATA } from './data.js'

const ext = (href) => (href && href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

function Empty() {
  return (
    <div className="empty">
      nothing matches that filter.
      <br />
      你来到了荒原。
    </div>);
}

export function About() {
  return (
    <div className="section section--about">
      <div className="about__lede">
        <h1 className="about__h1">{DATA.about.lede}</h1>
        {DATA.about.paras.map((p, i) => (
          <p className="about__p" key={i}>
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}

const GITHUB_ICON = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

function ProjectLink({ href }) {
  const isGitHub = /^https?:\/\/(www\.)?github\.com\//.test(href)
  return (
    <a className="proj-link" href={href} {...ext(href)}>
      {isGitHub ? GITHUB_ICON : <span aria-hidden="true">↗</span>}
      {isGitHub ? 'GitHub' : 'Visit'}
    </a>
  )
}

export function Projects({ match }) {
  const items = DATA.projects.filter((p) => match(p.name, p.blurb, p.stack.join(' ')))
  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Things I've shipped</h1>
      </div>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="cards">
          {items.map((p) => (
            <div className="card" key={p.name}>
              <div className="card__top">
                <div className="card__name">{p.name}</div>
                <div className="card__year">{p.year}</div>
              </div>
              <div className="card__blurb">{p.blurb}</div>
              <div className="card__foot">
                <div className="tags">
                  {p.stack.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                {p.href && <ProjectLink href={p.href} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const monthOf = (d) => (/^\d{4}-\d{2}$/.test(d) ? d + '-01' : d)

export function Writing({ match, posts }) {
  const items = [
    ...posts.map((p) => ({
      dateKey: p.dateKey,
      title: p.title,
      sub: p.summary,
      href: '#/post/' + p.slug,
      search: [p.title, p.summary, p.tags.join(' ')].join(' '),
      ext: false,
    })),
    ...DATA.posts.map((p) => ({
      dateKey: monthOf(p.date),
      title: p.title,
      sub: p.sub,
      href: p.href,
      search: [p.title, p.sub, p.date].join(' '),
      ext: true,
    })),
  ]
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    .filter((p) => match(p.search))

  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Notes as I figure things out</h1>
      </div>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="rows">
          {items.map((p, i) => {
            return (
              <a className={'row' + (p.href ? ' row--link' : '')} key={i} href={p.href} {...(p.ext ? ext(p.href) : {})}>
                <div className="row__date">{p.dateKey.slice(0, 7)}</div>
                <div className="row__body">
                  <div className="row__title">{p.title}</div>
                  <div className="row__sub">{p.sub}</div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Publications({ match }) {
  const items = DATA.pubs.filter((p) => match(p.title, p.authors, p.venue))
  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Papers and preprints</h1>
      </div>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="pubs">
          {items.map((p, i) => (
            <div className="pub" key={i}>
              <div className="pub__title">{p.title}</div>
              <div className="pub__authors">{p.authors}</div>
              <div className="pub__venue">{p.venue}</div>
              {p.links && p.links.length > 0 && (
                <div className="pub__links">
                  {p.links.map((l) => (
                    <a key={l.label} href={l.href} {...ext(l.href)}>
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Talks({ match }) {
  const items = DATA.talks.filter((t) => match(t.title, t.where, t.date))
  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Where I've spoken</h1>
      </div>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="rows">
          {items.map((t, i) => (
            <div className="row" key={i}>
              <div className="row__date">{t.date}</div>
              <div className="row__body">
                <div className="row__title">{t.title}</div>
                <div className="row__sub">{t.where}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Experience({ match }) {
  const items = DATA.roles.filter((r) => match(r.role, r.org, r.what, r.when))
  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Résumé</h1>
      </div>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="roles">
          {items.map((r, i) => (
            <div className="role" key={i}>
              <div className="role__when">{r.when}</div>
              <div className="role__body">
                <div className="role__title">{r.role}</div>
                <div className="role__org">{r.org}</div>
                <div className="role__what">{r.what}</div>
                {r.links && r.links.length > 0 && (
                  <div className="pub__links">
                    {r.links.map((l) => (
                      <a key={l.label} href={l.href} {...ext(l.href)}>
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Gallery() {
  const [active, setActive] = useState(null)
  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Shot on walks</h1>
      </div>
      <div className="gallery">
        {DATA.photos.map((photo) => (
          <button className="photo" key={photo.src} onClick={() => setActive(photo)} aria-label={`Open ${photo.caption}`}>
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <figcaption className="photo__caption">{photo.caption}</figcaption>
          </button>
        ))}
      </div>
      {active && <Lightbox photo={active} onClose={() => setActive(null)} />}
    </div>
  )
}

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.caption} onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img className="lightbox__img" src={photo.src} alt={photo.caption} />
        <figcaption className="lightbox__caption">{photo.caption}</figcaption>
      </figure>
    </div>
  )
}

export function Miscellaneous({ match }) {
  const links = DATA.misc.filter((link) => match(link.title, link.description, link.hostname))

  return (
    <div className="section">
      <div className="section__head">
        <h1 className="section__title">Things worth keeping</h1>
        <p className="section__intro">A small collection of links I return to.</p>
      </div>
      {links.length === 0 ? (
        <Empty />
      ) : (
        <div className="misc-links">
          {links.map((link) => (
            <a className="misc-link" key={link.href} href={link.href} {...ext(link.href)}>
              <span className="misc-link__body">
                <span className="misc-link__title">{link.title}</span>
                <span className="misc-link__description">{link.description}</span>
              </span>
              <span className="misc-link__meta">
                <span>{link.hostname}</span>
                <ExternalLink size={15} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
