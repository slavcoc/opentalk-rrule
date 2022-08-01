import { combine, fromOrdinal, sort } from '../dateutil'
import Iterinfo from '../iterinfo/index'
import { pymod, isPresent, includes } from '../helpers'
import { Time } from '../datetime'

export function buildPoslist(
  bysetpos: number[],
  timeset: Time[],
  start: number,
  end: number,
  ii: Iterinfo,
  dayset: (number | null)[]
) {
  const poslist: Date[] = []

  for (let j = 0; j < bysetpos.length; j++) {
    let daypos: number
    let timepos: number
    const pos = bysetpos[j]

    if (pos < 0) {
      daypos = Math.floor(pos / timeset.length)
      timepos = pymod(pos, timeset.length)
    } else {
      daypos = Math.floor((pos - 1) / timeset.length)
      timepos = pymod(pos - 1, timeset.length)
    }

    const tmp = []
    for (let k = start; k < end; k++) {
      const val = dayset[k]
      if (!isPresent(val)) continue
      tmp.push(val)
    }
    let i: number
    if (daypos < 0) {
      i = tmp.slice(daypos)[0]
    } else {
      i = tmp[daypos]
    }

    const time = timeset[timepos]
    const date = fromOrdinal(ii.yearordinal + i)
    const res = combine(date, time)
    // XXX: can this ever be in the array?
    // - compare the actual date instead?
    if (!includes(poslist, res)) poslist.push(res)
  }

  sort(poslist)

  return poslist
}
