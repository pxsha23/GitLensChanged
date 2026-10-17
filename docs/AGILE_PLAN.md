# GitLens: Agile Project Plan

**Product:** GitLens, a web app that turns a GitHub repository's commit history into a visual dashboard (timeline, contributor leaderboard, file-risk heatmap, bus-factor alert).
**Team (2):** Piyusha Kate (Developer + DevOps), _Partner name_ (Developer + Tester)
**Method:** Scrum, 2 sprints × 1 week, with a GitHub Actions CI/CD pipeline running on every push and pull request.

---

## 1. User Stories

| ID | User story | Priority | Story points |
|---|---|---|---|
| US-1 | As a **developer**, I want to **paste a GitHub repository link** so that GitLens can analyse its history. | Must | 3 |
| US-2 | As a **team lead**, I want to **see contributors ranked by commits** so that I know who works on what. | Must | 3 |
| US-3 | As a **project manager**, I want a **bus-factor warning** when one person makes most commits so that I can spot knowledge risk early. | Should | 2 |
| US-4 | As a **new team member**, I want a **file-risk heatmap** of frequently changed files so that I know which code to be careful with. | Should | 5 |
| US-5 | As the **development team**, we want **every change to be built, tested, quality-checked and deployed automatically** so that only working code reaches users. | Must | 5 |

**Total:** 18 story points

---

## 2. Sprint Planning

**Velocity assumed:** ~9 points per 1-week sprint

| Sprint | Goal | Stories | Points | Owner |
|---|---|---|---|---|
| Sprint 1 | "A user can analyse any repo and see who contributed" | US-1, US-2, US-3 | 8 | Piyusha: US-1, US-3 · Partner: US-2 |
| Sprint 2 | "Risk insights, delivered automatically" | US-4, US-5 | 10 | Partner: US-4 · Piyusha: US-5 (pipeline) |

**Ceremonies:** sprint planning (Monday), daily 10-minute stand-up (WhatsApp/meet), sprint review with a demo of the live GitHub Pages link, and a retrospective at the end of each sprint.

**Workflow:** each story is built on a `feature/<story>` branch → pull request → the CI pipeline must pass (build, tests, lint) → review by the other member → merge to `main` → automatic deployment.

---

## 3. Definition of Done (applies to every story)

A story is **Done** only when:

1. Code is on a feature branch and merged to `main` through a reviewed pull request
2. The **Build** stage passes (`npm ci` + `vite build` succeed)
3. Unit tests are written for new logic and the **Automated Testing** stage passes (0 failing tests)
4. The **Code Quality** stage passes (ESLint reports 0 errors)
5. The change is **deployed automatically** to GitHub Pages and checked on the live site
6. All acceptance criteria for the story are met
7. README / docs are updated if behaviour changed

---

## 4. Acceptance Criteria

### US-1: Analyse a repository by URL

| # | Given | When | Then |
|---|---|---|---|
| AC1 | the user is on the GitLens home page | they enter `https://github.com/facebook/react` and click Analyse | the dashboard loads the history of `facebook/react` |
| AC2 | the user types the short form `facebook/react` | they click Analyse | it is treated exactly like the full URL |
| AC3 | the link has a trailing `/` or ends in `.git` | they click Analyse | the extra characters are ignored and the repo still loads |
| AC4 | the user enters text that is not a repo (e.g. `hello`) | they click Analyse | no request is made and the input is rejected |
| AC5 | the repo does not exist | GitHub returns 404 | an error message is shown instead of a blank screen |

**Automated tests:** `tests/parseRepoUrl.test.js` (AC1–AC4) and `tests/loadRepo.test.js` (AC5)

### US-3: Bus-factor warning

| # | Given | When | Then |
|---|---|---|---|
| AC1 | a repo where one person made 3 of 4 commits | it is analysed | bus factor is shown as **75%** |
| AC2 | several contributors | the leaderboard is shown | they are sorted from most to fewest commits |

**Automated tests:** `tests/loadRepo.test.js`

---

## 5. CI/CD Pipeline (US-5)

```
GitHub push / PR  →  1. Build  →  2. Automated Testing  →  3. Code Quality Check  →  4. Deployment
                     npm ci        node:test (14 tests)       ESLint                  GitHub Pages
                     vite build    + coverage report          (errors block)          (main branch only)
```

- **Tool:** GitHub Actions (`.github/workflows/ci-cd.yml`)
- **Trigger:** every push and pull request to `main`; pull requests run stages 1–3 only
- **Fail-fast:** each stage starts only if the previous one passed, so a failing test or lint error stops deployment
