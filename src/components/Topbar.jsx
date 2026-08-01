export default function Topbar({ q, setQ, crumb, inputRef, onToggleMenu }) {
  return (
    <div className="topbar">
      <button className="menu-btn" onClick={onToggleMenu} aria-label="Toggle menu">
        ☰
      </button>
      <span className="topbar__prompt">$</span>
      <input
        className="topbar__input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        ref={inputRef}
        placeholder="filter this section"
        aria-label="Filter section"
      />
      <span className="topbar__crumb">{crumb}</span>
    </div>
  )
}
