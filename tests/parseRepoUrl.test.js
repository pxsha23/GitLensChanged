// US-1: "As a developer, I want to paste a GitHub repo link so GitLens knows which repo to analyse."
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseRepoUrl } from '../src/utils/github.js'

test('accepts a full GitHub URL', () => {
  assert.deepEqual(parseRepoUrl('https://github.com/facebook/react'), { owner: 'facebook', repo: 'react' })
})

test('ignores a trailing slash and surrounding spaces', () => {
  assert.deepEqual(parseRepoUrl('  https://github.com/pxsha23/GitLens-app/  '), { owner: 'pxsha23', repo: 'GitLens-app' })
})

test('strips the .git suffix from a clone URL', () => {
  assert.deepEqual(parseRepoUrl('https://github.com/vitejs/vite.git'), { owner: 'vitejs', repo: 'vite' })
})

test('accepts owner/repo shorthand', () => {
  assert.deepEqual(parseRepoUrl('torvalds/linux'), { owner: 'torvalds', repo: 'linux' })
})

test('rejects input that is not a repository', () => {
  assert.equal(parseRepoUrl('hello'), null)
  assert.equal(parseRepoUrl(''), null)
  assert.equal(parseRepoUrl('a/b/c'), null)
})
