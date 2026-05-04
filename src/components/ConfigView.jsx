import { MONTHS } from '../constants.js'

export default function ConfigView({
  machineTypes, storageTypes,
  machineStarts, workDist, picksPerBuild, capacity, baseline,
  machineColorMap, storageColorMap, machineIcon,
  updateStart, updateDist, addDistMonth, remDistMonth, updatePicks,
  setCap, setBaseline,
  renameMachine, addMachine, removeMachine,
  renameStorage, addStorage, removeStorage,
  onRun,
}) {
  const totalPPB = (m) =>
    storageTypes.reduce((s, st) => s + ((picksPerBuild[m] || {})[st] || 0), 0)
  const maxPPB = Math.max(...machineTypes.map(totalPPB), 1)

  return (
    <div>
      {/* ── 1. Storage types & capacity ── */}
      <div className="section">
        <div className="section-header">
          <div className="section-label">Storage Types &amp; Daily Capacity</div>
          <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={addStorage}>
            + Add Storage
          </button>
        </div>
        <div className="card card-accent">
          <div className="card-body">
            <div className="storage-grid">
              {storageTypes.map((s) => {
                const color = storageColorMap[s]
                return (
                  <div key={s} className="storage-row">
                    <div className="s-color" style={{ background: color }} />
                    <input
                      className="s-name-input"
                      defaultValue={s}
                      onBlur={(e) => renameStorage(s, e.target.value.trim())}
                      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                    />
                    <input
                      className="s-cap-input"
                      type="number" min="0"
                      value={capacity[s] || 0}
                      onChange={(e) => setCap(s, e.target.value)}
                    />
                    <span className="s-unit">picks/day</span>
                    {storageTypes.length > 1 && (
                      <button className="btn-del" onClick={() => removeStorage(s)}>✕</button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Picks per build matrix ── */}
      <div className="section">
        <div className="section-header">
          <div className="section-label">Picks per Machine Build — by Storage</div>
          <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={addMachine}>
            + Add Machine
          </button>
        </div>
        <div className="card card-accent">
          <div style={{ overflowX: 'auto' }}>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 160, paddingLeft: 20 }}>Machine Type</th>
                  {storageTypes.map((s) => (
                    <th key={s} className="storage-th" style={{ color: storageColorMap[s] }}>
                      {s}
                      <div style={{ fontWeight: 400, fontSize: 9, color: 'var(--text-dim)', marginTop: 1, letterSpacing: 0, textTransform: 'none' }}>
                        picks/build
                      </div>
                    </th>
                  ))}
                  <th style={{ textAlign: 'right', minWidth: 110, paddingRight: 20 }}>Total / Build</th>
                  <th style={{ width: 30 }} />
                </tr>
              </thead>
              <tbody>
                {machineTypes.map((m, mi) => {
                  const color = machineColorMap[m]
                  const total = totalPPB(m)
                  const pct = total / maxPPB
                  return (
                    <tr key={m}>
                      <td style={{ paddingLeft: 20 }}>
                        <div className="machine-cell">
                          <span className="m-icon" style={{ color }}>{machineIcon(mi)}</span>
                          <input
                            className="m-name-input"
                            style={{ color }}
                            defaultValue={m}
                            onBlur={(e) => renameMachine(m, e.target.value.trim())}
                            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                          />
                        </div>
                      </td>
                      {storageTypes.map((s) => {
                        const val = (picksPerBuild[m] || {})[s] || 0
                        return (
                          <td key={s} style={{ textAlign: 'right' }}>
                            <input
                              className={`picks-input ${val > 0 ? 'has-val' : ''}`}
                              type="number" min="0"
                              value={val}
                              style={{ borderColor: val > 0 ? storageColorMap[s] + '70' : undefined }}
                              onChange={(e) => updatePicks(m, s, e.target.value)}
                            />
                          </td>
                        )
                      })}
                      <td style={{ textAlign: 'right', paddingRight: 20 }}>
                        <div className="total-num">{total.toLocaleString()}</div>
                        <div className="mini-bar" style={{ width: `${pct * 100}%`, background: color, marginLeft: 'auto' }} />
                      </td>
                      <td>
                        {machineTypes.length > 1 && (
                          <button className="btn-del" onClick={() => removeMachine(m)}>✕</button>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {/* Baseline row */}
                <tr style={{ background: 'var(--warn-mid-bg)' }}>
                  <td style={{ paddingLeft: 20 }}>
                    <div className="machine-cell">
                      <span className="m-icon" style={{ color: 'var(--warn-mid)' }}>⊕</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--warn-mid)' }}>
                        Non-Machine Tasks
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', paddingLeft: 32, marginTop: 2 }}>
                      Fixed daily picks (baseline)
                    </div>
                  </td>
                  {storageTypes.map((s) => (
                    <td key={s} style={{ textAlign: 'right' }}>
                      <input
                        className="baseline-input"
                        type="number" min="0"
                        value={baseline[s] || 0}
                        style={{ borderColor: 'var(--warn-mid)' }}
                        onChange={(e) => setBaseline(s, e.target.value)}
                      />
                    </td>
                  ))}
                  <td style={{ textAlign: 'right', paddingRight: 20 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--warn-mid)' }}>
                      {storageTypes.reduce((a, s) => a + (baseline[s] || 0), 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>picks/day total</div>
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 3. Production starts ── */}
      <div className="section">
        <div className="section-header">
          <div className="section-label">Production Starts per Month</div>
        </div>
        <div className="starts-grid">
          {machineTypes.map((type, mi) => {
            const color = machineColorMap[type]
            const total = (machineStarts[type] || []).reduce((a, b) => a + b, 0)
            return (
              <div key={type} className="start-card">
                <div className="start-card-header" style={{ borderLeftColor: color }}>
                  <span style={{ color, fontSize: 15 }}>{machineIcon(mi)}</span>
                  <span className="start-card-label" style={{ color }}>{type}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>
                    {total} starts
                  </span>
                </div>
                <div className="month-row">
                  {MONTHS.map((m, i) => {
                    const v = (machineStarts[type] || [])[i] || 0
                    return (
                      <div key={m} className="m-cell">
                        <div className="m-label">{m}</div>
                        <input
                          className={`m-input ${v > 0 ? 'has-val' : ''}`}
                          type="number" min="0"
                          value={v}
                          style={{ borderColor: v > 0 ? color + '80' : undefined }}
                          onChange={(e) => updateStart(type, i, e.target.value)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 4. Work distribution ── */}
      <div className="section">
        <div className="section-header">
          <div className="section-label">Work Distribution per Machine Type</div>
        </div>
        <div className="dist-grid">
          {machineTypes.map((type, mi) => {
            const color = machineColorMap[type]
            const dist = workDist[type] || []
            const sum = dist.reduce((a, b) => a + b, 0)
            const ok = Math.abs(sum - 1) < 0.01
            return (
              <div key={type} className="dist-card">
                <div className="dist-card-header" style={{ borderLeftColor: color }}>
                  <span style={{ color, fontSize: 14 }}>{machineIcon(mi)}</span>
                  <span style={{ fontWeight: 600, fontSize: 12, color }}>{type}</span>
                  <span
                    className="dist-sum"
                    style={{ color: ok ? 'var(--ok)' : 'var(--warn)', marginLeft: 'auto' }}
                  >
                    Σ={(sum * 100).toFixed(0)}% {ok ? '✓' : '⚠'}
                  </span>
                </div>
                {dist.map((v, idx) => (
                  <div key={idx} className="dist-row">
                    <div className="dist-label">M+{idx + 1}</div>
                    <div className="dist-track">
                      <div className="dist-fill" style={{ width: `${v * 100}%`, background: color }} />
                    </div>
                    <input
                      className="dist-input"
                      type="number" step="0.05" min="0" max="1"
                      value={v}
                      onChange={(e) => updateDist(type, idx, e.target.value)}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 6, padding: '6px 14px 10px' }}>
                  {dist.length < 8 && (
                    <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => addDistMonth(type)}>
                      + Month
                    </button>
                  )}
                  {dist.length > 1 && (
                    <button className="btn btn-danger" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => remDistMonth(type)}>
                      − Month
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button className="run-btn" onClick={onRun}>
        <span>▶</span> Run Simulation
      </button>
    </div>
  )
}
