// // 

// import { useState } from 'react'
// import SpaceIntro      from './components/SpaceIntro.jsx'    // ← ADD THIS
// import Landing         from './components/Landing.jsx'
// import Dashboard       from './components/Dashboard.jsx'
// import SpaceBackground from './components/SpaceBackground.jsx'

// export default function App() {
//   const [page,     setPage]     = useState('intro')          // ← CHANGE 'idle' to 'intro'
//   const [repoData, setRepoData] = useState(null)

//   const handleAnalyze = (data) => {
//     setPage('dashboard')
//     setRepoData(data)
//   }

//   const handleReset = () => {
//     setPage('landing')                                        // ← go back to landing not intro
//     setRepoData(null)
//   }

//   // ── NEW: Space intro page ──────────────────────────────────────────────────
//   if (page === 'intro') {
//     return <SpaceIntro onEnter={() => setPage('landing')} />
//   }

//   // ── Existing pages (unchanged) ─────────────────────────────────────────────
//   return (
//     <div style={{ minHeight: '100vh', background: '#020617', position: 'relative' }}>
//       <SpaceBackground phase={page} />
//       {page !== 'dashboard'
//         ? <Landing
//             onAnalyze={handleAnalyze}
//             onLoadingChange={loading => setPage(loading ? 'loading' : 'landing')}
//           />
//         : <Dashboard data={repoData} onReset={handleReset} />
//       }
//     </div>
//   )
// }


import { useState } from 'react'
import SpaceIntro      from './components/SpaceIntro.jsx'    // ADD
import Landing         from './components/Landing.jsx'
import Dashboard       from './components/Dashboard.jsx'
import SpaceBackground from './components/SpaceBackground.jsx'

export default function App() {
  const [page,     setPage]     = useState('intro')          // CHANGE idle → intro
  const [repoData, setRepoData] = useState(null)

  if (page === 'intro') {                                    // ADD
    return <SpaceIntro onEnter={() => setPage('landing')} /> // ADD
  }                                                          // ADD

  return (
    <div style={{ minHeight: '100vh', background: '#020617', position: 'relative' }}>
      <SpaceBackground phase={page} />
      {!repoData
        ? <Landing
            onAnalyze={(data) => { setRepoData(data); setPage('dashboard') }}
            onLoadingChange={(loading) => setPage(loading ? 'loading' : 'landing')}
          />
        : <Dashboard data={repoData} onReset={() => { setRepoData(null); setPage('landing') }} />
      }
    </div>
  )
}