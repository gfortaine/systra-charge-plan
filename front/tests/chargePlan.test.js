import { describe, expect, test, vi } from 'vitest'
import {
  buildSavePayload,
  createDraftLine,
  isPersonOrProjectSort,
  normalizeChargePlanLine,
} from '@page/chargePlanUtils'

describe('charge plan helpers', () => {
  test('creates a draft row from backend-provided references', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('row-id')
    const draft = createDraftLine([{ id: '1' }], [{ id: '2' }])

    expect(draft).toEqual({
      id: 'draft-row-id',
      personId: '1',
      projectId: '2',
      plannedHours: '0',
      amount: null,
      isDraft: true,
    })
  })

  test('normalizes backend rows without exposing tjm', () => {
    const row = normalizeChargePlanLine({
      id: '10',
      plannedHours: '4.00',
      amount: '400.00',
      person: { id: '1', fullName: 'Alice Martin' },
      project: { id: '2', name: 'Grand Paris Express' },
    })

    expect(row).toEqual({
      id: '10',
      personId: '1',
      personName: 'Alice Martin',
      projectId: '2',
      projectName: 'Grand Paris Express',
      plannedHours: '4.00',
      amount: '400.00',
      isDraft: false,
    })
    expect(row).not.toHaveProperty('tjm')
  })

  test('builds save payload without tjm or amount', () => {
    const payload = buildSavePayload([{
      id: '10',
      personId: '1',
      projectId: '2',
      plannedHours: '4.00',
      amount: '400.00',
      tjm: '800.00',
    }])

    expect(payload).toEqual([{
      personId: '1',
      projectId: '2',
      plannedHours: '4.00',
    }])
  })

  test('normalizes blank planned hours before save', () => {
    const payload = buildSavePayload([{
      personId: '1',
      projectId: '2',
      plannedHours: ' ',
    }])

    expect(payload).toEqual([{
      personId: '1',
      projectId: '2',
      plannedHours: '0',
    }])
  })

  test('limits sorting contract to person and project display columns', () => {
    expect(isPersonOrProjectSort('personName')).toBe(true)
    expect(isPersonOrProjectSort('projectName')).toBe(true)
    expect(isPersonOrProjectSort('plannedHours')).toBe(false)
    expect(isPersonOrProjectSort('amount')).toBe(false)
  })
})
