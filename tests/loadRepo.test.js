// US-2 / US-3: contributor stats and bus-factor risk are computed correctly from commit history.
// The GitHub API is mocked, so these tests run offline and give the same result every time.
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { loadRepo } from '../src/utils/github.js'

const commit = (sha, login, date) => ({
  sha,
  author: { login },
  commit: { author: { name: login, date } },
})

const COMMITS = [
  commit('a1', 'piya', '2026-10-01T10:00:00Z'),
  commit('a2', 'piya', '2026-10-02T11:00:00Z'),
  commit('a3', 'piya', '2026-10-03T12:00:00Z'),
  commit('b1', 'partner', '2026-10-04T13:00:00Z'),
]

let realFetch
beforeEach(() => {
  realFetch = globalThis.fetch
  globalThis.fetch = async (url) => {
    const u = String(url)
    let body
    if (/\/commits\/[a-z0-9]+$/.test(u)) body = { files: [{ filename: 'src/App.jsx', additions: 5, deletions: 2 }] }
    else if (u.includes('/commits')) body = u.includes('page=1') ? COMMITS : []
    else body = { full_name: 'demo/repo', stargazers_count: 3 }
    return { ok: true, status: 200, statusText: 'OK', json: async () => body }
  }
})
afterEach(() => { globalThis.fetch = realFetch })

test('counts every commit', async () => {
  const data = await loadRepo('demo', 'repo', '', () => {})
  assert.equal(data.totalCommits, 4)
})

test('ranks contributors by number of commits', async () => {
  const data = await loadRepo('demo', 'repo', '', () => {})
  assert.deepEqual(data.contributors.map(c => [c.login, c.commits]), [['piya', 3], ['partner', 1]])
  assert.ok(data.contributors.every(c => c.color.startsWith('#')), 'each contributor gets a colour')
})

test('calculates bus factor as the top contributor share', async () => {
  const data = await loadRepo('demo', 'repo', '', () => {})
  assert.equal(data.busFactorPct, 75)
})

test('reports progress up to 100%', async () => {
  const steps = []
  await loadRepo('demo', 'repo', '', (_msg, pct) => steps.push(pct))
  assert.equal(steps.at(-1), 100)
  assert.deepEqual([...steps].sort((a, b) => a - b), steps, 'progress never goes backwards')
})

test('shows a clear error when GitHub returns 404', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 404, statusText: 'Not Found' })
  await assert.rejects(loadRepo('nobody', 'missing', '', () => {}), /GitHub 404/)
})
