function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function Article({ post }) {
  return (
    <div className="section">
      <div className="section__head">
        <a className="post__back" href="#/writing">
          ← back to writing
        </a>
        <h1 className="post__title">{post.title}</h1>
        <div className="post__meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="post" dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  )
}
