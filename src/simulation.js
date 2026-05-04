import { MONTHS } from './constants.js'

/** Days in a given month (0-indexed) for year 2025 */
export const daysInMonth = (m) => new Date(2025, m + 1, 0).getDate()

/**
 * Build raw machine picking demand timeline.
 * Returns an array of 365 objects: { [storageName]: picksPerDay }
 */
export function buildDemand(machineTypes, machineStarts, picksPerBuild, workDist, storageTypes) {
  const DAYS = 365
  const demand = Array.from({ length: DAYS }, () => ({}))

  machineTypes.forEach((type) => {
    const dist   = workDist[type]       || []
    const starts = machineStarts[type]  || Array(12).fill(0)
    const ppb    = picksPerBuild[type]  || {}

    MONTHS.forEach((_, mi) => {
      const count = starts[mi] || 0
      if (!count) return

      dist.forEach((frac, offset) => {
        const tm = mi + offset
        if (tm >= 12) return

        const dc = daysInMonth(tm)
        let dayStart = 0
        for (let m = 0; m < tm; m++) dayStart += daysInMonth(m)

        storageTypes.forEach((s) => {
          const perDay = (count * (ppb[s] || 0) * frac) / dc
          for (let d = 0; d < dc; d++) {
            const di = dayStart + d
            if (di >= DAYS) break
            demand[di][s] = (demand[di][s] || 0) + perDay
          }
        })
      })
    })
  })

  return demand
}

/**
 * Simulate day-by-day picking with carry-over queue per storage.
 *
 * Priority order each day:
 *   1. Baseline (non-machine) picks
 *   2. Carried-over backlog from previous days
 *   3. New machine picks
 *
 * Anything that cannot be processed rolls into the next day's backlog.
 *
 * Returns an array of 365 day objects:
 * {
 *   machinePicks:  { [storage]: number },  // new demand this day
 *   baselinePicks: { [storage]: number },  // fixed daily baseline
 *   carriedIn:     { [storage]: number },  // backlog arriving from yesterday
 *   actual:        { [storage]: number },  // total actually processed
 *   carried:       { [storage]: number },  // backlog pushed to tomorrow
 *   overflow:      { [storage]: boolean }, // true if storage was over capacity
 * }
 */
export function simulate(demand, capacity, baseline, storageTypes) {
  const DAYS = demand.length
  const result = Array.from({ length: DAYS }, () => ({
    machinePicks:  {},
    baselinePicks: {},
    carriedIn:     {},
    actual:        {},
    carried:       {},
    overflow:      {},
  }))

  // Persistent backlog per storage
  const backlog = Object.fromEntries(storageTypes.map((s) => [s, 0]))

  for (let d = 0; d < DAYS; d++) {
    const r = result[d]

    storageTypes.forEach((s) => {
      const cap      = capacity[s] || 0
      const base     = baseline[s] || 0
      const machDem  = demand[d][s] || 0
      const carryIn  = backlog[s]

      r.machinePicks[s]  = machDem
      r.baselinePicks[s] = base
      r.carriedIn[s]     = carryIn

      // Allocate capacity: baseline first, then carry-over, then new machine picks
      const actualBase  = Math.min(base, cap)
      const capAfterBase = Math.max(0, cap - actualBase)

      const actualCarry = Math.min(carryIn, capAfterBase)
      const capAfterCarry = Math.max(0, capAfterBase - actualCarry)

      const actualMach = Math.min(machDem, capAfterCarry)

      r.actual[s]   = actualBase + actualCarry + actualMach
      r.carried[s]  = (machDem - actualMach) + (carryIn - actualCarry)
      r.overflow[s] = r.carried[s] > 0

      backlog[s] = r.carried[s]
    })
  }

  return result
}
