# Performance Testing Setup

This directory contains scripts for automated performance testing and comparison.

## Testing Workflow

### 1. Run Baseline Test (Before Optimization)
```bash
# Capture baseline metrics
npx lighthouse https://devfire.xyz \
  --output=json \
  --output-path=./lighthouse-baseline.json \
  --quiet --chrome-flags="--headless"
```

### 2. Deploy Optimizations
Deploy your performance improvements to production.

### 3. Run Optimized Test (After Deployment)
```bash
# Capture post-optimization metrics
npx lighthouse https://devfire.xyz \
  --output=json \
  --output-path=./lighthouse-optimized.json \
  --quiet --chrome-flags="--headless"
```

### 4. Compare Results
```bash
# Generate comparison report
node scripts/compare-performance.mjs lighthouse-baseline.json lighthouse-optimized.json
```

## Available Scripts

### `compare-performance.mjs`
Compares two Lighthouse JSON reports and outputs:
- Lighthouse scores (before/after)
- Core Web Vitals (LCP, FCP, TBT, CLS)
- Load metrics (Speed Index, TTI)
- Resource metrics (bundle size)
- Improvement summary

**Usage:**
```bash
node scripts/compare-performance.mjs <baseline.json> <optimized.json>
```

**Output:**
- Console: Formatted comparison table
- File: `performance-comparison-report.json` (full data)

## Key Metrics Tracked

### Lighthouse Scores (Target: 90+)
- Performance
- Accessibility
- Best Practices
- SEO

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FCP** (First Contentful Paint): < 1.8s
- **TBT** (Total Blocking Time): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Load Metrics
- **Speed Index**: < 3.4s
- **Time to Interactive**: < 3.8s

### Resources
- Total byte weight
- JavaScript bundle size
- CSS size
- Image optimization

## Baseline Metrics (March 3, 2026)

**Scores:**
- Performance: 64/100 ⚠️
- Accessibility: 90/100 ✅
- Best Practices: 69/100 ⚠️
- SEO: 100/100 ✅

**Web Vitals:**
- LCP: 7.39s 🔴 (3x over budget)
- FCP: 3.63s 🟠
- TBT: 20ms ✅
- CLS: 0 ✅
- Speed Index: 5.76s 🔴
- TTI: 7.66s 🔴 (2x over budget)

**Resources:**
- Total: 11.6MB (!!)
- Images: 11.1MB
- JavaScript: 195KB
- Fonts: 136KB

## After Optimization (Expected)

- Performance: 85-90
- LCP: < 2.5s
- Speed Index: < 3.4s
- Bundle: -120KB

## Performance Budget

Set in `next.config.mjs`:
```javascript
experimental: {
  optimizePackageImports: ['framer-motion', 'lucide-react'],
}
```

## Continuous Monitoring

Run tests regularly:
- Before major deployments
- Weekly automated runs
- After adding new features
- Monitor production Core Web Vitals
