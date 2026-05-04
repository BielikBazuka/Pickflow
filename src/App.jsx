import { useState, useEffect } from 'react'
import css from './styles.js'
import { useAppState } from './hooks/useAppState.js'
import Tooltip from './components/Tooltip.jsx'
import ConfigView from './components/ConfigView.jsx'
import SimView from './components/SimView.jsx'

export default function App() {
  const [tab, setTab]           = useState('config')
  const [simResult, setSimResult] = useState(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [viewMode, setViewMode]   = useState('bar')
  const [selMonth, setSelMonth]   = useState(null)
  const [tooltip, setTooltip]     = useState(null)
  const [animKey, setAnimKey]     = useState(0)
  const [time, setTime]           = useState(new Date().toTimeString().slice(0, 8))

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000)
    return () => clearInterval(t)
  }, [])

  const state = useAppState()

  const handleRun = () => {
    const result = state.runSimulation()
    setSimResult(result)
    setTab('simulation')
    setSelectedDay(0)
    setSelMonth(null)
    setAnimKey((k) => k + 1)
  }

  const navItems = [
    { id: 'config',     icon: '⚙', label: 'Configuration' },
    { id: 'simulation', icon: '▶', label: 'Simulation'     },
  ]

  return (
    <>
      <style>{css}</style>
      <Tooltip tooltip={tooltip} />

      <div className="layout">
        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-wordmark">ASML</div>
            <div className="sidebar-sub">Picking Simulation</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section">Modules</div>
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${tab === item.id ? 'active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div>PickFlow v1.0</div>
            <div style={{ color: 'rgba(255,255,255,.55)' }}>{time}</div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {tab === 'config' ? 'Configuration' : 'Simulation Results'}
            </div>
            <div className="topbar-right">
              <div className="status-pill">
                <div className="status-dot" />
                System Online
              </div>
              <div className="topbar-time">{time}</div>
            </div>
          </div>

          <div className="content">
            {tab === 'config' && (
              <ConfigView
                machineTypes={state.machineTypes}
                storageTypes={state.storageTypes}
                machineStarts={state.machineStarts}
                workDist={state.workDist}
                picksPerBuild={state.picksPerBuild}
                capacity={state.capacity}
                baseline={state.baseline}
                machineColorMap={state.machineColorMap}
                storageColorMap={state.storageColorMap}
                machineIcon={state.machineIcon}
                updateStart={state.updateStart}
                updateDist={state.updateDist}
                addDistMonth={state.addDistMonth}
                remDistMonth={state.remDistMonth}
                updatePicks={state.updatePicks}
                setCap={state.setCap}
                setBaseline={state.setBaseline}
                renameMachine={state.renameMachine}
                addMachine={state.addMachine}
                removeMachine={state.removeMachine}
                renameStorage={state.renameStorage}
                addStorage={state.addStorage}
                removeStorage={state.removeStorage}
                onRun={handleRun}
              />
            )}

            {tab === 'simulation' && simResult && (
              <SimView
                key={animKey}
                result={simResult}
                storageTypes={state.storageTypes}
                capacity={state.capacity}
                baseline={state.baseline}
                storageColorMap={state.storageColorMap}
                machineTypes={state.machineTypes}
                machineColorMap={state.machineColorMap}
                machineStarts={state.machineStarts}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selMonth={selMonth}
                setSelMonth={setSelMonth}
                setTooltip={setTooltip}
              />
            )}

            {tab === 'simulation' && !simResult && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>▶</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  Configure your parameters and run the simulation
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 16 }}
                  onClick={() => setTab('config')}
                >
                  Go to Configuration
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
