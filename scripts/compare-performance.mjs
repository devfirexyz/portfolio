#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'

if (process.argv.length < 4) {
  console.log('Usage: node compare-performance.mjs <baseline.json> <optimized.json>')
  process.exit(1)
}

const baselinePath = process.argv[2]
const optimizedPath = process.argv[3]

try {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))
  const optimized = JSON.parse(readFileSync(optimizedPath, 'utf8'))

  const extractMetrics = (report) => ({
    performance: Math.round(report.categories.performance.score * 100),
    accessibility: Math.round(report.categories.accessibility.score * 100),
    bestPractices: Math.round(report.categories['best-practices'].score * 100),
    seo: Math.round(report.categories.seo.score * 100),
    lcp: report.audits['largest-contentful-paint'].numericValue,
    fcp: report.audits['first-contentful-paint'].numericValue,
    tbt: report.audits['total-blocking-time'].numericValue,
    cls: report.audits['cumulative-layout-shift'].numericValue,
    speedIndex: report.audits['speed-index'].numericValue,
    interactive: report.audits['interactive'].numericValue,
    totalByteWeight: report.audits['total-byte-weight'].numericValue,
  })

  const before = extractMetrics(baseline)
  const after = extractMetrics(optimized)

  const formatMs = (ms) => `${(ms / 1000).toFixed(2)}s`
  const formatBytes = (bytes) => `${(bytes / 1024).toFixed(1)}KB`
  const calcChange = (b, a) => {
    const diff = a - b
    const pct = ((diff / b) * 100).toFixed(1)
    const sign = diff > 0 ? '+' : ''
    return `${sign}${diff.toFixed(0)} (${sign}${pct}%)`
  }
  const calcChangePercent = (b, a) => {
    const diff = a - b
    const pct = ((diff / b) * 100).toFixed(1)
    const sign = diff > 0 ? '+' : ''
    return `${sign}${pct}%`
  }

  console.log('\n========================================')
  console.log('PERFORMANCE COMPARISON REPORT')
  console.log('========================================\n')

  console.log('LIGHTHOUSE SCORES')
  console.log('----------------------------------------')
  console.log(`Performance:      ${before.performance} → ${after.performance}  (${calcChange(before.performance, after.performance)})`)
  console.log(`Accessibility:    ${before.accessibility} → ${after.accessibility}  (${calcChange(before.accessibility, after.accessibility)})`)
  console.log(`Best Practices:   ${before.bestPractices} → ${after.bestPractices}  (${calcChange(before.bestPractices, after.bestPractices)})`)
  console.log(`SEO:              ${before.seo} → ${after.seo}  (${calcChange(before.seo, after.seo)})`)

  console.log('\nCORE WEB VITALS')
  console.log('----------------------------------------')
  console.log(`LCP:   ${formatMs(before.lcp)} → ${formatMs(after.lcp)}  (${calcChangePercent(before.lcp, after.lcp)})`)
  console.log(`FCP:   ${formatMs(before.fcp)} → ${formatMs(after.fcp)}  (${calcChangePercent(before.fcp, after.fcp)})`)
  console.log(`TBT:   ${before.tbt.toFixed(0)}ms → ${after.tbt.toFixed(0)}ms  (${calcChangePercent(before.tbt, after.tbt)})`)
  console.log(`CLS:   ${before.cls.toFixed(3)} → ${after.cls.toFixed(3)}  (${calcChangePercent(before.cls, after.cls)})`)

  console.log('\nLOAD METRICS')
  console.log('----------------------------------------')
  console.log(`Speed Index:      ${formatMs(before.speedIndex)} → ${formatMs(after.speedIndex)}  (${calcChangePercent(before.speedIndex, after.speedIndex)})`)
  console.log(`TTI:              ${formatMs(before.interactive)} → ${formatMs(after.interactive)}  (${calcChangePercent(before.interactive, after.interactive)})`)

  console.log('\nRESOURCE METRICS')
  console.log('----------------------------------------')
  console.log(`Total Size:       ${formatBytes(before.totalByteWeight)} → ${formatBytes(after.totalByteWeight)}  (${calcChangePercent(before.totalByteWeight, after.totalByteWeight)})`)

  console.log('\n========================================')
  console.log('IMPROVEMENT SUMMARY')
  console.log('========================================')

  const lcpImprovement = ((before.lcp - after.lcp) / before.lcp * 100).toFixed(1)
  const perfImprovement = after.performance - before.performance
  const sizeReduction = ((before.totalByteWeight - after.totalByteWeight) / 1024).toFixed(1)

  console.log(`✓ Lighthouse Performance: +${perfImprovement} points`)
  console.log(`✓ LCP improvement: ${lcpImprovement}%`)
  console.log(`✓ Speed Index improvement: ${calcChangePercent(before.speedIndex, after.speedIndex)}`)
  console.log(`✓ Bundle size reduction: ${sizeReduction}KB`)

  console.log('\n')

  const report = {
    before,
    after,
    comparison: {
      performanceChange: perfImprovement,
      lcpImprovement: `${lcpImprovement}%`,
      sizeReductionKB: sizeReduction,
      timestamp: new Date().toISOString()
    }
  }

  writeFileSync('performance-comparison-report.json', JSON.stringify(report, null, 2))
  console.log('✓ Full report saved to: performance-comparison-report.json\n')

} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
