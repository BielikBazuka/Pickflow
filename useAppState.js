export default function Tooltip({ tooltip }) {
  if (!tooltip) return null
  return (
    <div className="tooltip" style={{ left: tooltip.x + 14, top: tooltip.y - 8 }}>
      <div className="tt-title">{tooltip.title}</div>
      {tooltip.rows.map((r, i) => (
        <div key={i} className="tt-row">
          <span className="tt-key">{r[0]}</span>
          <span className={`tt-val ${r[2] || ''}`}>{r[1]}</span>
        </div>
      ))}
    </div>
  )
}
