import { useState, useMemo } from 'react'
import { MONTHS } from '../constants.js'
import { daysInMonth } from '../simulation.js'

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color }) {
  return (
    <div className="kpi" style={{ borderTopColor: color || 'var(--asml-blue)' }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: color || 'var(--text)' }}>{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  )
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function BarView({ viewResult, dayOffset, selectedDay, setSelectedDay, storageTypes, storageColorMap, capacity, totalCap, maxViewStack, setTooltip }) {
  const H = 200
  return (
    <div className="chart-wrap">
      <div style={{ position: 'relative', height: H + 4 }}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <div key={f} className="grid-line" style={{ top: H * (1 - f) }}>
            <span className="grid-label">{Math.round(maxViewStack * f).toLocaleString()}</span>
          </div>
        ))}
        <div className="cap-line" style={{ top: H * (1 - totalCap / maxViewStack) }}>
          <span className="cap-label">Capacity {totalCap.toLocaleString()}</span>
        </div>
        <div className="bar-area" style={{ position: 'absolute', inset: 0 }}>
          {viewResult.map((d, i) => {
            const absDay = dayOffset + i
            const isSel = absDay === selectedDay
            const machTotal  = storageTypes.reduce((a, s) => a + (d.machinePicks[s]  || 0), 0)
            const baseTotal  = storageTypes.reduce((a, s) => a + (d.baselinePicks[s] || 0), 0)
            const carryTotal = storageTypes.reduce((a, s) => a + (d.carriedIn[s]     || 0), 0)
            const carriedOut = storageTypes.reduce((a, s) => a + (d.carried[s]       || 0), 0)
            const machH  = (machTotal  / maxViewStack) * H
            const baseH  = (baseTotal  / maxViewStack) * H
            const carryH = (carryTotal / maxViewStack) * H

            return (
              <div
                key={i}
                className={`b-wrap ${isSel ? 'sel' : ''}`}
                onClick={() => setSelectedDay(absDay)}
                onMouseMove={(e) => setTooltip({
                  x: e.clientX, y: e.clientY,
                  title: `Day ${absDay + 1}`,
                  rows: [
                    ['Machine picks', Math.round(machTotal).toLocaleString(), ''],
                    ['Baseline picks', Math.round(baseTotal).toLocaleString(), ''],
                    ['Carried in', Math.round(carryTotal).toLocaleString(), carryTotal > 0 ? 'warn' : ''],
                    ['Capacity', totalCap.toLocaleString(), ''],
                    ['Carried out', Math.round(carriedOut).toLocaleString(), carriedOut > 0 ? 'warn' : 'ok'],
                  ],
                })}
                onMouseLeave={() => setTooltip(null)}
              >
                {storageTypes.map((s) => {
                  const v = d.machinePicks[s] || 0
                  if (!v) return null
                  const h = (v / maxViewStack) * H
                  return (
                    <div key={s} className="b-segment" style={{ height: h, background: storageColorMap[s], opacity: isSel ? 1 : 0.75 }} />
                  )
                })}
                {baseH > 0 && <div className="b-segment b-baseline" style={{ height: baseH, background: 'var(--warn-mid)' }} />}
                {carryH > 0 && <div className="b-segment b-carry" style={{ height: carryH, background: 'var(--warn)' }} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Heat map ─────────────────────────────────────────────────────────────────

function HeatView({ result, totalCap, selectedDay, setSelectedDay, setTooltip, storageTypes, dailyCarried }) {
  const weeks = []
  for (let w = 0; w < 53; w++) {
    weeks.push([])
    for (let d = 0; d < 7; d++) { const idx = w * 7 + d; weeks[w].push(idx < 365 ? idx : null) }
  }
  const maxAct = Math.max(...result.map((d) => storageTypes.reduce((a, s) => a + (d.actual[s] || 0), 0)), 1)
  const maxBl  = Math.max(...dailyCarried, 1)
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="heatmap-wrap">
      <div className="hm-grid">
        <div />
        {weeks.map((_, w) => (
          <div key={w} className="hm-week-label">{w % 4 === 0 ? `W${w + 1}` : ''}</div>
        ))}
        {dayNames.map((dn, di) => (
          <>
            <div key={`l${di}`} className="hm-row-label">{dn}</div>
            {weeks.map((week, wi) => {
              const idx = week[di]
              if (idx === null || idx >= 365) return <div key={`e${wi}`} style={{ width: 13, height: 13 }} />
              const actual = storageTypes.reduce((a, s) => a + (result[idx].actual[s] || 0), 0)
              const bl     = dailyCarried[idx] || 0
              const pct    = actual / maxAct
              const isSel  = idx === selectedDay
              const bg     = bl > 0
                ? `rgba(239,68,68,${0.2 + Math.min(bl / maxBl, 0.8) * 0.8})`
                : `rgba(0,128,201,${0.08 + pct * 0.85})`
              return (
                <div
                  key={`d${wi}${di}`}
                  className="hm-cell"
                  style={{ background: bg, border: isSel ? '2px solid var(--asml-blue)' : '1px solid transparent' }}
                  onClick={() => setSelectedDay(idx)}
                  onMouseMove={(e) => setTooltip({
                    x: e.clientX, y: e.clientY,
                    title: `Day ${idx + 1}`,
                    rows: [
                      ['Processed', Math.round(actual).toLocaleString(), ''],
                      ['Backlog out', Math.round(bl).toLocaleString(), bl > 0 ? 'warn' : 'ok'],
                    ],
                  })}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}

// ─── Backlog chart ────────────────────────────────────────────────────────────

function BacklogChart({ dailyCarried, selectedDay, setSelectedDay, setTooltip }) {
  const maxBl = Math.max(...dailyCarried, 1)
  const H = 80
  return (
    <div className="backlog-area">
      <div className="backlog-bars" style={{ height: H }}>
        {dailyCarried.map((v, i) => {
          const h = Math.max((v / maxBl) * H, v > 0 ? 1 : 0)
          const isSel = i === selectedDay
          return (
            <div
              key={i}
              className="bl-bar"
              style={{
                height: h,
                background: v > 0 ? 'var(--warn-mid)' : 'var(--border)',
                opacity: isSel ? 1 : v > 0 ? 0.7 : 0.4,
                outline: isSel ? '1.5px solid var(--asml-blue)' : undefined,
              }}
              onClick={() => setSelectedDay(i)}
              onMouseMove={(e) => setTooltip({
                x: e.clientX, y: e.clientY,
                title: `Day ${i + 1} Backlog`,
                rows: [['Carried out', Math.round(v).toLocaleString(), v > 0 ? 'warn' : 'ok']],
              })}
              onMouseLeave={() => setTooltip(null)}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Monthly table ────────────────────────────────────────────────────────────

function MonthlyTable({ result, storageTypes, totalCap, machineTypes, machineStarts, dailyCarried }) {
  const data = useMemo(() =>
    MONTHS.map((m, mi) => {
      let s = 0
      for (let i = 0; i < mi; i++) s += daysInMonth(i)
      const slice   = result.slice(s, s + daysInMonth(mi))
      const blSlice = dailyCarried.slice(s, s + daysInMonth(mi))
      const demand     = slice.reduce((a, d) => a + storageTypes.reduce((x, st) => x + (d.machinePicks[st] || 0) + (d.baselinePicks[st] || 0), 0), 0)
      const totalPicks = slice.reduce((a, d) => a + storageTypes.reduce((x, st) => x + (d.actual[st] || 0), 0), 0)
      const peakBl  = Math.max(...blSlice, 0)
      const blDays  = blSlice.filter((v) => v > 0).length
      const starts  = machineTypes.reduce((a, t) => a + ((machineStarts[t] || [])[mi] || 0), 0)
      return { m, totalPicks, demand, peakBl, blDays, starts }
    }),
  [result, storageTypes, totalCap, dailyCarried, machineTypes, machineStarts])

  const maxPicks = Math.max(...data.map((d) => d.demand), 1)

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="m-table">
        <thead>
          <tr>
            {['Month', 'Starts', 'Demand', 'Processed', 'Peak Backlog', 'Backlog Days', 'Workload'].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, color: 'var(--asml-blue)' }}>{row.m}</td>
              <td style={{ fontFamily: 'var(--font-mono)', color: row.starts > 0 ? 'var(--text)' : 'var(--text-dim)' }}>{row.starts}</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(row.demand).toLocaleString()}</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(row.totalPicks).toLocaleString()}</td>
              <td>
                <span className={`badge ${row.peakBl > 0 ? 'badge-mid' : 'badge-ok'}`}>
                  {row.peakBl > 0 ? Math.round(row.peakBl).toLocaleString() : '—'}
                </span>
              </td>
              <td>
                <span className={`badge ${row.blDays > 0 ? 'badge-warn' : 'badge-ok'}`}>
                  {row.blDays > 0 ? `${row.blDays}d` : 'None'}
                </span>
              </td>
              <td style={{ minWidth: 120 }}>
                <div className="workload-bar-track">
                  <div
                    className="workload-bar-fill"
                    style={{
                      width: `${(row.demand / maxPicks) * 100}%`,
                      background: row.blDays > 0 ? 'var(--warn)' : 'var(--asml-blue)',
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main SimView ─────────────────────────────────────────────────────────────

export default function SimView({
  result, storageTypes, capacity, baseline, storageColorMap,
  machineTypes, machineColorMap, machineStarts,
  selectedDay, setSelectedDay, viewMode, setViewMode,
  selMonth, setSelMonth, setTooltip,
}) {
  const totalCap      = storageTypes.reduce((a, s) => a + (capacity[s] || 0), 0)
  const dailyActual   = useMemo(() => result.map((d) => storageTypes.reduce((a, s) => a + (d.actual[s]  || 0), 0)), [result, storageTypes])
  const dailyCarried  = useMemo(() => result.map((d) => storageTypes.reduce((a, s) => a + (d.carried[s] || 0), 0)), [result, storageTypes])

  const peakActual  = useMemo(() => { let mx = 0, idx = 0; dailyActual.forEach((v, i) => { if (v > mx) { mx = v; idx = i } }); return { val: Math.round(mx), day: idx } }, [dailyActual])
  const maxBacklog  = useMemo(() => Math.max(...dailyCarried, 0), [dailyCarried])
  const backlogDays = useMemo(() => dailyCarried.filter((v) => v > 0).length, [dailyCarried])
  const avgActual   = useMemo(() => Math.round(dailyActual.reduce((a, b) => a + b, 0) / 365), [dailyActual])
  const totalStarts = machineTypes.reduce((a, t) => a + (machineStarts[t] || []).reduce((x, y) => x + y, 0), 0)

  const viewResult = useMemo(() => {
    if (selMonth === null) return result
    let s = 0; for (let m = 0; m < selMonth; m++) s += daysInMonth(m)
    return result.slice(s, s + daysInMonth(selMonth))
  }, [result, selMonth])

  const dayOffset = useMemo(() => {
    if (selMonth === null) return 0
    let s = 0; for (let m = 0; m < selMonth; m++) s += daysInMonth(m); return s
  }, [selMonth])

  const maxViewStack = useMemo(() =>
    Math.max(...viewResult.map((d) =>
      storageTypes.reduce((a, s) => a + (d.machinePicks[s] || 0) + (d.baselinePicks[s] || 0) + (d.carriedIn[s] || 0), 0)
    ), totalCap, 1),
  [viewResult, storageTypes, totalCap])

  const dayDateStr = useMemo(() => {
    let rem = selectedDay
    for (let m = 0; m < 12; m++) { const dm = daysInMonth(m); if (rem < dm) return `${MONTHS[m]} ${rem + 1}`; rem -= dm }
    return 'Dec 31'
  }, [selectedDay])

  const dayData       = result[selectedDay] || { actual: {}, machinePicks: {}, baselinePicks: {}, carriedIn: {}, carried: {}, overflow: {} }
  const dayActualTotal = storageTypes.reduce((a, s) => a + (dayData.actual[s]   || 0), 0)
  const dayCarriedOut  = storageTypes.reduce((a, s) => a + (dayData.carried[s]  || 0), 0)
  const dayCarriedIn   = storageTypes.reduce((a, s) => a + (dayData.carriedIn[s]|| 0), 0)
  const hasOverflow    = storageTypes.some((s) => dayData.overflow[s])

  return (
    <div>
      {/* KPIs */}
      <div className="kpi-strip">
        <KpiCard label="Machine Starts" value={totalStarts} sub="across all types" />
        <KpiCard label="Peak Daily (Actual)" value={peakActual.val.toLocaleString()}
          sub={`Day ${peakActual.day + 1} · cap ${totalCap.toLocaleString()}`}
          color={peakActual.val > totalCap ? 'var(--warn)' : 'var(--ok)'} />
        <KpiCard label="Avg Daily Picks" value={avgActual.toLocaleString()} sub="actual processed / day" />
        <KpiCard label="Days with Backlog" value={backlogDays}
          sub={`of 365 (${Math.round(backlogDays / 3.65)}%)`}
          color={backlogDays > 0 ? 'var(--warn)' : 'var(--ok)'} />
        <KpiCard label="Peak Backlog" value={Math.round(maxBacklog).toLocaleString()}
          sub="picks carried at once"
          color={maxBacklog > 0 ? 'var(--warn-mid)' : 'var(--ok)'} />
      </div>

      {/* Timeline */}
      <div className="timeline-card">
        <div className="tl-controls">
          <div className="ctrl-group">
            <span className="ctrl-label">View</span>
            <div className="view-btns">
              <button className={`vbtn ${viewMode === 'bar' ? 'active' : ''}`} onClick={() => setViewMode('bar')}>Bar</button>
              <button className={`vbtn ${viewMode === 'heat' ? 'active' : ''}`} onClick={() => setViewMode('heat')}>Heat</button>
            </div>
          </div>
          <div className="ctrl-group" style={{ flexWrap: 'wrap' }}>
            <span className="ctrl-label">Month</span>
            <div className="month-pills">
              <button className={`mpill ${selMonth === null ? 'active' : ''}`} onClick={() => setSelMonth(null)}>All</button>
              {MONTHS.map((m, i) => (
                <button key={m} className={`mpill ${selMonth === i ? 'active' : ''}`} onClick={() => setSelMonth(i)}>{m}</button>
              ))}
            </div>
          </div>
          <div className="ctrl-group" style={{ marginLeft: 'auto' }}>
            <span className="ctrl-label">Day</span>
            <input className="day-slider" type="range" min="0" max="364" value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))} />
            <span className="day-display">{dayDateStr}</span>
          </div>
        </div>

        {viewMode === 'bar'
          ? <BarView viewResult={viewResult} dayOffset={dayOffset} selectedDay={selectedDay} setSelectedDay={setSelectedDay}
              storageTypes={storageTypes} storageColorMap={storageColorMap} capacity={capacity}
              totalCap={totalCap} maxViewStack={maxViewStack} setTooltip={setTooltip} />
          : <HeatView result={result} totalCap={totalCap} selectedDay={selectedDay} setSelectedDay={setSelectedDay}
              setTooltip={setTooltip} storageTypes={storageTypes} dailyCarried={dailyCarried} />
        }

        {/* Legend */}
        <div className="legend">
          {storageTypes.map((s) => (
            <div key={s} className="leg-item">
              <div className="leg-dot" style={{ background: storageColorMap[s] }} />
              {s}
            </div>
          ))}
          <div className="leg-item">
            <div className="leg-hat" />
            Baseline tasks
          </div>
          <div className="leg-item">
            <div className="leg-hat" style={{ background: 'repeating-linear-gradient(-45deg,#aaa,#aaa 2px,rgba(0,0,0,.1) 2px,rgba(0,0,0,.1) 4px)' }} />
            Carried-over backlog
          </div>
          <div className="leg-item">
            <div className="leg-line" style={{ background: 'var(--warn)' }} />
            Capacity limit
          </div>
        </div>

        {/* Day detail */}
        <div className="day-detail">
          <div className="detail-col">
            <div className="detail-title">Storage Utilisation — {dayDateStr}</div>
            {storageTypes.map((s) => {
              const actual   = dayData.actual[s]   || 0
              const cap      = capacity[s]          || 1
              const carried  = dayData.carried[s]  || 0
              const pct      = Math.min(actual / cap, 1)
              const isOver   = dayData.overflow[s]
              const color    = isOver ? 'var(--warn)' : storageColorMap[s]
              return (
                <div key={s} className="util-row">
                  <div className="util-label">{s}</div>
                  <div className="util-track">
                    <div className="util-fill" style={{ width: `${pct * 100}%`, background: isOver ? 'var(--warn)' : storageColorMap[s] }} />
                  </div>
                  <div className="util-pct" style={{ color: isOver ? 'var(--warn)' : 'var(--ok)' }}>{Math.round(pct * 100)}%</div>
                  <div className="util-abs">
                    {Math.round(actual).toLocaleString()} / {cap.toLocaleString()}
                    {carried > 0 && <span style={{ color: 'var(--warn-mid)', marginLeft: 4 }}>+{Math.round(carried).toLocaleString()}→</span>}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="detail-col">
            <div className="detail-title">Daily Summary</div>
            {[
              ['Machine Picks Demanded', Math.round(storageTypes.reduce((a, s) => a + (dayData.machinePicks[s] || 0), 0)).toLocaleString(), ''],
              ['Baseline Picks',         Math.round(storageTypes.reduce((a, s) => a + (dayData.baselinePicks[s]|| 0), 0)).toLocaleString(), ''],
              ['Carried In from Yesterday', Math.round(dayCarriedIn).toLocaleString(), dayCarriedIn > 0 ? 'warn' : ''],
              ['Actually Processed',       Math.round(dayActualTotal).toLocaleString(), ''],
              ['Carried to Tomorrow',      Math.round(dayCarriedOut).toLocaleString(), dayCarriedOut > 0 ? 'warn' : 'ok'],
              ['Total Capacity',           totalCap.toLocaleString(), ''],
              ['Status', hasOverflow ? '⚠ Capacity Exceeded' : '✓ Within Capacity', hasOverflow ? 'warn' : 'ok'],
            ].map(([k, v, c]) => (
              <div key={k} className="summary-row">
                <span className="summary-key">{k}</span>
                <span className="summary-val" style={{ color: c === 'warn' ? 'var(--warn)' : c === 'ok' ? 'var(--ok)' : undefined }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backlog timeline */}
      <div className="card card-accent" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Carry-over Backlog Over Time</div>
            <div className="card-title-sub">Picks carried to the next day — total across all storages</div>
          </div>
          <span className={`badge ${maxBacklog > 0 ? 'badge-warn' : 'badge-ok'}`}>
            {maxBacklog > 0 ? `Peak: ${Math.round(maxBacklog).toLocaleString()} picks` : 'No backlog'}
          </span>
        </div>
        <BacklogChart dailyCarried={dailyCarried} selectedDay={selectedDay} setSelectedDay={setSelectedDay} setTooltip={setTooltip} />
      </div>

      {/* Monthly overview */}
      <div className="monthly-card">
        <div className="card-header">
          <div className="card-title">Monthly Overview</div>
        </div>
        <MonthlyTable result={result} storageTypes={storageTypes} totalCap={totalCap}
          machineTypes={machineTypes} machineStarts={machineStarts} dailyCarried={dailyCarried} />
      </div>
    </div>
  )
}
