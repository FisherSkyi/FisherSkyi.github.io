import { DATA } from './data.js'

const ext = (href) => (href && href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

function Empty() {
  return <div className="empty">— nothing matches that filter.</div>
}

export function About() {
  return (
    <div className="section section--about">
      <div className="about__lede">
        <div className="eyebrow">About</div>
        <h1 className="about__h1">{DATA.about.lede}</h1>
        {DATA.about.paras.map((p, i) => (
          <p className="about__p" key={i}>
            {p}
          </p>
        ))}
      </div>

      <div className="facts">
        {DATA.facts.map((f) => (
          <div className="fact" key={f.k}>
            <div className="fact__k">{f.k}</div>
            <div className="fact__v">{f.v}</div>
          </div>
        ))}
      </div>

      <div className="now">
        <div className="now__label">Currently</div>
        {DATA.now.map((n, i) => (
          <div className="now__row" key={i}>
            <span className="now__arrow">→</span>
            <span className="now__text">{n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Projects({ match }) {
  const items = DATA.projects.filter((p) => match(p.name, p.blurb, p.stack.join(' ')))
  return (
    <div className="section">
      <div className="section__head">
        <div className="eyebrow">Projects</div>
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
              <div className="card__blurb">
                {p.blurb}
                {p.href && (
                  <>
                    {' '}
                    <a href={p.href} {...ext(p.href)}>
                      ↗
                    </a>
                  </>
                )}
              </div>
              <div className="tags">
                {p.stack.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Writing({ match }) {
  const items = DATA.posts.filter((p) => match(p.title, p.sub, p.date))
  return (
    <div className="section">
      <div className="section__head">
        <div className="eyebrow">Writing</div>
        <h1 className="section__title">Notes as I figure things out</h1>
      </div>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="rows">
          {items.map((p, i) => {
            const Tag = p.href ? 'a' : 'div'
            return (
              <Tag className={'row' + (p.href ? ' row--link' : '')} key={i} href={p.href} {...ext(p.href)}>
                <div className="row__date">{p.date}</div>
                <div className="row__body">
                  <div className="row__title">{p.title}</div>
                  <div className="row__sub">{p.sub}</div>
                </div>
              </Tag>
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
        <div className="eyebrow">Publications</div>
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
        <div className="eyebrow">Talks</div>
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
        <div className="eyebrow">Experience</div>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Gallery() {
  return (
    <div className="section">
      <div className="section__head">
        <div className="eyebrow">Photography</div>
        <h1 className="section__title">Shot on walks</h1>
      </div>
      <div className="gallery">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div className="photo photo--empty" key={n}>
            <span>Drop a photo</span>
          </div>
        ))}
      </div>
      <div className="note">— placeholder tiles, swap in your own photos</div>
    </div>
  )
}
