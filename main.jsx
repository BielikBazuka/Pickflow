import { useState, useMemo } from 'react'
import {
  DEFAULT_MACHINE_TYPES, DEFAULT_STORAGE_TYPES,
  DEFAULT_PICKS_PER_BUILD, DEFAULT_WORK_DIST,
  DEFAULT_CAPACITY, DEFAULT_BASELINE,
  MACHINE_PALETTE, STORAGE_PALETTE, MACHINE_ICONS,
} from '../constants.js'
import { buildDemand, simulate } from '../simulation.js'

const machineColor = (i) => MACHINE_PALETTE[i % MACHINE_PALETTE.length]
const storageColor = (i) => STORAGE_PALETTE[i % STORAGE_PALETTE.length]
const machineIcon  = (i) => MACHINE_ICONS[i % MACHINE_ICONS.length]

export function useAppState() {
  const [machineTypes, setMachineTypes] = useState([...DEFAULT_MACHINE_TYPES])
  const [storageTypes, setStorageTypes] = useState([...DEFAULT_STORAGE_TYPES])

  const [machineStarts, setMachineStarts] = useState(() =>
    Object.fromEntries(DEFAULT_MACHINE_TYPES.map((t) => [t, Array(12).fill(0)]))
  )
  const [workDist, setWorkDist] = useState(() =>
    JSON.parse(JSON.stringify(DEFAULT_WORK_DIST))
  )
  const [picksPerBuild, setPicksPerBuild] = useState(() =>
    JSON.parse(JSON.stringify(DEFAULT_PICKS_PER_BUILD))
  )
  const [capacity, setCapacityState] = useState(() =>
    JSON.parse(JSON.stringify(DEFAULT_CAPACITY))
  )
  const [baseline, setBaselineState] = useState(() =>
    JSON.parse(JSON.stringify(DEFAULT_BASELINE))
  )

  // ── Color maps ────────────────────────────────────────────────────────────
  const machineColorMap = useMemo(
    () => Object.fromEntries(machineTypes.map((t, i) => [t, machineColor(i)])),
    [machineTypes]
  )
  const storageColorMap = useMemo(
    () => Object.fromEntries(storageTypes.map((s, i) => [s, storageColor(i)])),
    [storageTypes]
  )

  // ── Machine CRUD ──────────────────────────────────────────────────────────
  const renameMachine = (oldName, newName) => {
    if (!newName || newName === oldName) return
    setMachineTypes((p) => p.map((t) => (t === oldName ? newName : t)))
    setMachineStarts((p) => { const x = { ...p }; x[newName] = x[oldName] || Array(12).fill(0); delete x[oldName]; return x })
    setWorkDist((p)     => { const x = { ...p }; x[newName] = x[oldName] || [1]; delete x[oldName]; return x })
    setPicksPerBuild((p)=> { const x = { ...p }; x[newName] = x[oldName] || {}; delete x[oldName]; return x })
  }

  const addMachine = () => {
    const name = `MACH${machineTypes.length + 1}`
    setMachineTypes((p) => [...p, name])
    setMachineStarts((p) => ({ ...p, [name]: Array(12).fill(0) }))
    setWorkDist((p) => ({ ...p, [name]: [0.4, 0.35, 0.25] }))
    setPicksPerBuild((p) => ({ ...p, [name]: Object.fromEntries(storageTypes.map((s) => [s, 0])) }))
  }

  const removeMachine = (name) => {
    if (machineTypes.length <= 1) return
    setMachineTypes((p) => p.filter((t) => t !== name))
    setMachineStarts((p) => { const x = { ...p }; delete x[name]; return x })
    setWorkDist((p)      => { const x = { ...p }; delete x[name]; return x })
    setPicksPerBuild((p) => { const x = { ...p }; delete x[name]; return x })
  }

  const updateStart = (type, mi, val) =>
    setMachineStarts((p) => ({
      ...p,
      [type]: p[type].map((x, i) => (i === mi ? Math.max(0, parseInt(val) || 0) : x)),
    }))

  const updateDist = (type, idx, val) =>
    setWorkDist((p) => ({
      ...p,
      [type]: p[type].map((x, i) => (i === idx ? Math.min(1, Math.max(0, parseFloat(val) || 0)) : x)),
    }))

  const addDistMonth   = (type) => setWorkDist((p) => ({ ...p, [type]: [...p[type], 0] }))
  const remDistMonth   = (type) => setWorkDist((p) => ({ ...p, [type]: p[type].slice(0, -1) }))

  const updatePicks = (m, s, val) =>
    setPicksPerBuild((p) => ({ ...p, [m]: { ...p[m], [s]: Math.max(0, parseInt(val) || 0) } }))

  // ── Storage CRUD ──────────────────────────────────────────────────────────
  const renameStorage = (oldName, newName) => {
    if (!newName || newName === oldName) return
    setStorageTypes((p) => p.map((s) => (s === oldName ? newName : s)))
    setCapacityState((p) => { const x = { ...p }; x[newName] = x[oldName] || 500; delete x[oldName]; return x })
    setBaselineState((p) => { const x = { ...p }; x[newName] = x[oldName] || 0; delete x[oldName]; return x })
    setPicksPerBuild((p) => {
      const x = {}
      for (const m in p) { x[m] = { ...p[m] }; x[m][newName] = x[m][oldName] || 0; delete x[m][oldName] }
      return x
    })
  }

  const addStorage = () => {
    const name = `ST${storageTypes.length + 1}`
    setStorageTypes((p) => [...p, name])
    setCapacityState((p) => ({ ...p, [name]: 500 }))
    setBaselineState((p) => ({ ...p, [name]: 0 }))
    setPicksPerBuild((p) => {
      const x = {}
      for (const m in p) x[m] = { ...p[m], [name]: 0 }
      return x
    })
  }

  const removeStorage = (name) => {
    if (storageTypes.length <= 1) return
    setStorageTypes((p) => p.filter((s) => s !== name))
    setCapacityState((p) => { const x = { ...p }; delete x[name]; return x })
    setBaselineState((p) => { const x = { ...p }; delete x[name]; return x })
    setPicksPerBuild((p) => {
      const x = {}
      for (const m in p) { x[m] = { ...p[m] }; delete x[m][name] }
      return x
    })
  }

  const setCap      = (s, val) => setCapacityState((p) => ({ ...p, [s]: Math.max(0, parseInt(val) || 0) }))
  const setBaseline = (s, val) => setBaselineState((p) => ({ ...p, [s]: Math.max(0, parseInt(val) || 0) }))

  // ── Run simulation ────────────────────────────────────────────────────────
  const runSimulation = () => {
    const demand = buildDemand(machineTypes, machineStarts, picksPerBuild, workDist, storageTypes)
    return simulate(demand, capacity, baseline, storageTypes)
  }

  return {
    // Data
    machineTypes, storageTypes,
    machineStarts, workDist, picksPerBuild,
    capacity, baseline,
    // Derived
    machineColorMap, storageColorMap,
    machineIcon, storageIcon: storageColor,
    // Machine actions
    renameMachine, addMachine, removeMachine,
    updateStart, updateDist, addDistMonth, remDistMonth, updatePicks,
    // Storage actions
    renameStorage, addStorage, removeStorage, setCap, setBaseline,
    // Sim
    runSimulation,
  }
}
