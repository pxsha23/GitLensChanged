// US-4: file-risk heatmap colours and date labels.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getRiskColor, fmtDate, lerp, getAuthorColor, PALETTE } from '../src/utils/constants.js'

test('maps each risk level to its heatmap colour', () => {
  assert.equal(getRiskColor('critical'), '#ef4444')
  assert.equal(getRiskColor('low'), '#22c55e')
  assert.equal(getRiskColor('unknown'), '#6b7280')
})

test('formats a valid date and returns empty text for an invalid one', () => {
  assert.match(fmtDate('2026-10-14T00:00:00Z'), /2026/)
  assert.equal(fmtDate('not-a-date'), '')
})

test('lerp interpolates between two numbers', () => {
  assert.equal(lerp(0, 10, 0.5), 5)
})

test('falls back to the first palette colour for an unknown author', () => {
  assert.equal(getAuthorColor('ghost', [{ login: 'piya', color: '#123456' }]), PALETTE[0])
})
