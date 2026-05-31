import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONFIG, ZONES, SEASONS } from '../config.js'
import styles from './LandingPage.module.css'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function currentMonthNum() { return new Date().getMonth() + 1 }
function currentSeason() {
  const mn = currentMonthNum()
  for (const [s, months] of Object.entries(SEASONS)) {
    if (months.includes(mn)) return s
  }
  return 'summer'
}

export default function LandingPage() {
  const mn        = currentMonthNum()
  const monthName = MONTHS[mn - 1]
  const season    = currentSeason()

  const [banner, setBanner]     = useState(`${monthName} · ${season}`)
  const [taskCount, setTaskCount] = useState(null)

  useEffect(() => {
    const url = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/main/${CONFIG.paths.program}?t=${Date.now()}`
    fetch(url)
      .then(r => r.json())
      .then(program => {
        const monthData = program.months.find(m => m.monthNum === mn)
        if (!monthData) return
        let total = 0
        monthData.weeks.forEach(w => { total += (w.tasks || []).length })
        setTaskCount(total)

        // Try to read completions for the progress message
        const token   = sessionStorage.getItem('gh_token')
        const headers = { Accept: 'application/vnd.github.v3+json' }
        if (token) headers['Authorization'] = 'token ' + token
        const apiUrl = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.paths.completions}`
        fetch(apiUrl, { headers })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (!data) {
              setBanner(`${monthName} — ${total} tasks scheduled · ${season}`)
              return
            }
            const completions = JSON.parse(atob(data.content.replace(/\n/g, '')))
            let done = 0
            monthData.weeks.forEach(w => {
              ;(w.tasks || []).forEach(t => { if (completions[t.id]) done++ })
            })
            const pct = total > 0 ? Math.round(done / total * 100) : 0
            setBanner(`${monthName} — ${done} of ${total} tasks done (${pct}%) · ${season}`)
          })
          .catch(() => { setBanner(`${monthName} — ${total} tasks scheduled · ${season}`) })
      })
      .catch(() => { setBanner(`${monthName} · ${season}`) })
  }, [mn, monthName, season])

  return (
    <div className={styles.page}>
      {/* Season strip */}
      <div className={styles.seasonStrip}>
        {['summer','summer','summer','autumn','autumn','autumn',
          'winter','winter','winter','spring','spring','spring'].map((s, i) => (
          <div key={i} className={`${styles.seasonSeg} ${styles[s]}`} />
        ))}
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>Oakhurst NSW &middot; Western Sydney</div>
        <h1 className={styles.heroTitle}>Lawn Care <em>Tools</em></h1>
        <div className={styles.heroSub}>
          12-month program &middot; 140.15m&sup2; &middot; 3 grass varieties &middot; 21 products
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetaItem}><div className={`${styles.heroMetaDot} ${styles.kikuyu}`} />Kikuyu 68.2m&sup2;</div>
          <div className={styles.heroMetaItem}><div className={`${styles.heroMetaDot} ${styles.zoysia}`} />Zoysia 35.0m&sup2;</div>
          <div className={styles.heroMetaItem}><div className={`${styles.heroMetaDot} ${styles.couch}`}  />Couch 36.95m&sup2;</div>
        </div>
      </div>

      <main className={styles.main}>
        {/* Month banner */}
        <div className={styles.monthBanner}>
          <span className={styles.monthBadge}>{monthName.slice(0, 3).toUpperCase()}</span>
          <span className={styles.monthText}>{banner}</span>
          <Link className={styles.monthLink} to={`/tracker?month=${mn}`}>Open Tracker &#8594;</Link>
        </div>

        <div className={styles.sectionLabel}>Tools</div>

        <div className={styles.toolCards}>
          <Link className={styles.toolCard} to="/tracker">
            <span className={styles.toolCardIcon}>&#x1F4CB;</span>
            <div className={styles.toolCardTitle}>Program Tracker</div>
            <div className={styles.toolCardDesc}>
              Your week-by-week lawn care program. Mark tasks done, view product quantities by zone.
            </div>
            <ul className={styles.toolCardFeatures}>
              <li>Month-by-month task view</li>
              <li>Product quantities per zone</li>
              <li>Tank-mix &amp; caution flags</li>
              <li>Saves completions to GitHub</li>
            </ul>
            <div className={styles.toolCardCta}>Open Tracker <span className={styles.ctaArrow}>&#8594;</span></div>
          </Link>

          <Link className={styles.toolCard} to="/dashboard">
            <span className={styles.toolCardIcon}>&#x1F4CA;</span>
            <div className={styles.toolCardTitle}>Dashboard</div>
            <div className={styles.toolCardDesc}>
              Program progress, inventory stock levels, application log, alerts and zone details.
            </div>
            <ul className={styles.toolCardFeatures}>
              <li>Inventory stock levels &amp; updates</li>
              <li>Application log &amp; history</li>
              <li>Low stock &amp; compatibility alerts</li>
              <li>Year-at-a-glance progress</li>
            </ul>
            <div className={styles.toolCardCta}>Open Dashboard <span className={styles.ctaArrow}>&#8594;</span></div>
          </Link>
        </div>

        {/* Quick links */}
        <div className={styles.quickLinks}>
          <span className={styles.quickLinksLabel}>Quick links</span>
          <Link className={styles.quickLink} to={`/tracker?month=${mn}`}><span className={`${styles.quickLinkDot} ${styles.tracker}`} />This month&apos;s tasks</Link>
          <Link className={styles.quickLink} to="/dashboard"><span className={`${styles.quickLinkDot} ${styles.program}`} />Dashboard overview</Link>
          <Link className={styles.quickLink} to="/dashboard?tab=inventory"><span className={`${styles.quickLinkDot} ${styles.inventory}`} />Inventory</Link>
          <Link className={styles.quickLink} to="/dashboard?tab=log"><span className={`${styles.quickLinkDot} ${styles.log}`} />Application log</Link>
          <Link className={styles.quickLink} to="/dashboard?tab=alerts"><span className={`${styles.quickLinkDot} ${styles.alerts}`} />Alerts</Link>
          <Link className={styles.quickLink} to="/dashboard?tab=program"><span className={`${styles.quickLinkDot} ${styles.program}`} />Program</Link>
          <Link className={styles.quickLink} to="/dashboard?tab=zones"><span className={`${styles.quickLinkDot} ${styles.zones}`} />Zones</Link>
        </div>

        <div className={styles.sectionLabel}>Lawn zones</div>

        {/* Zone pills */}
        <div className={styles.lawnSummary}>
          <div className={styles.lawnSummaryTitle}>4 zones &middot; 140.15 m&sup2; total</div>
          <div className={styles.zonesGrid}>
            {Object.entries(ZONES).map(([id, z]) => (
              <div key={id} className={styles.zonePill}>
                <div className={styles.zonePillArea}>{z.area}m&sup2;</div>
                <div className={styles.zonePillName}>{z.name}</div>
                <div className={`${styles.zonePillGrass} ${styles[z.grass]}`}>{z.grass}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className={styles.quickStats}>
          <div className={styles.quickStat}><div className={styles.quickStatVal}>21</div><div className={styles.quickStatLabel}>Products</div></div>
          <div className={styles.quickStat}><div className={styles.quickStatVal}>12</div><div className={styles.quickStatLabel}>Months</div></div>
          <div className={styles.quickStat}><div className={styles.quickStatVal}>3</div><div className={styles.quickStatLabel}>Grass types</div></div>
          <div className={styles.quickStat}>
            <div className={styles.quickStatVal}>{taskCount ?? '—'}</div>
            <div className={styles.quickStatLabel}>Tasks this month</div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        Oakhurst NSW 2761 &nbsp;&middot;&nbsp; Humid subtropical climate &nbsp;&middot;&nbsp;
        <a href={`https://github.com/${CONFIG.owner}/${CONFIG.repo}`} target="_blank" rel="noopener noreferrer">
          GitHub repo
        </a>
      </footer>
    </div>
  )
}
