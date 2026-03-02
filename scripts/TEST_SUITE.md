# Test Suite Documentation

## Overview

This project includes a comprehensive test suite that validates:
- Theme token configuration
- Color contrast compliance
- Component styling patterns
- Build integrity

## Test Scripts

### Run All Tests
```bash
npm run test
```
Runs all test suites in sequence (smoke tests + theme contrast tests).

### Run Theme Contrast Tests
```bash
npm run test:theme
```
Validates theme tokens, color contrast, and component styling patterns.

### Run Smoke Tests
```bash
npm run test:smoke
```
Validates core functionality and architecture decisions.

## Test Suites

### 1. Theme Contrast Tests (`scripts/theme-contrast-tests.mjs`)

**Tests:**
- ✅ **Theme Tokens**: Validates light and dark theme token definitions
- ✅ **No Hardcoded Colors**: Ensures no forbidden color patterns (gray-*, dark:, etc.)
- ✅ **Theme Variables**: Validates theme variable usage in components
- ✅ **Syntax Highlighting**: Tests code block color accessibility
- ✅ **Component Contrast**: Validates dark section contrast patterns
- ✅ **Code Blocks**: Tests code block styling for accessibility

**Validated Components:**
- `BlogPostClient.tsx` - Syntax highlighting, markdown rendering
- `FeaturePostCard.tsx` - Card styling
- `RegularPostCard.tsx` - Card styling
- `HomeFooter.tsx` - Footer contrast
- `HomeHeader.tsx` - Header styling
- `HeroBackdrop.tsx` - Background effects
- `NeoProcessSection.tsx` - Process cards
- `NeoCompareSection.tsx` - Comparison section
- `InfiniteTicker.tsx` - Ticker styling

### 2. Smoke Tests (`scripts/feedback-smoke-tests.mjs`)

**Tests:**
- ✅ Build configuration
- ✅ Component architecture
- ✅ Theme initialization
- ✅ CSS organization

## Test Runner

All tests are orchestrated by `scripts/run-all-tests.mjs`, which:
1. Runs smoke tests
2. Runs theme contrast tests
3. Reports combined results
4. Exits with code 0 on success, 1 on failure

## Writing New Tests

### Add Theme Contrast Test

1. Open `scripts/theme-contrast-tests.mjs`
2. Create a new test function:
```javascript
function testNewFeature() {
  console.log("\n🧪 Testing New Feature...");
  
  const component = read("components/NewComponent.tsx");
  
  assert(
    component.includes("var(--nb-"),
    "NewComponent must use theme variables"
  );
  
  console.log("✅ New feature validated");
}
```

3. Add to the `run()` function:
```javascript
function run() {
  // ... existing tests
  testNewFeature();
}
```

### Add Smoke Test

1. Open `scripts/feedback-smoke-tests.mjs`
2. Add assertions:
```javascript
const component = read("components/NewComponent.tsx");
assert(
  component.includes("expected-pattern"),
  "NewComponent validation message"
);
```

## Continuous Integration

Add to your CI/CD pipeline:
```yaml
- name: Run Tests
  run: npm run test
```

## Best Practices

1. **Run tests after every edit**:
   ```bash
   npm run test
   ```

2. **Fix test failures immediately** - don't commit broken tests

3. **Add tests for new features** - ensure future compatibility

4. **Test file patterns**:
   - Use `read()` to load files
   - Use `assert()` for validation
   - Console.log for progress
   - Throw errors for failures

## Test Coverage

**Theme System:**
- ✅ Light theme tokens
- ✅ Dark theme tokens
- ✅ Token contrast ratios
- ✅ Semantic token usage

**Components:**
- ✅ Blog components
- ✅ Home components
- ✅ Navigation components
- ✅ UI components

**Patterns:**
- ✅ No hardcoded colors
- ✅ Theme variable usage
- ✅ Contrast patterns
- ✅ Accessibility basics

## Troubleshooting

### Test Failure: "Theme token not found"
- Check `app/globals.css` for token definitions
- Verify token names match between CSS and tests

### Test Failure: "Hardcoded colors found"
- Replace `text-gray-*` with `text-[var(--nb-foreground-muted)]`
- Replace `bg-gray-*` with `bg-[var(--nb-surface)]`
- Replace `dark:` with theme-aware alternatives

### Test Failure: "Component contrast pattern invalid"
- Dark sections need `text-[var(--nb-foreground-inverse)]`
- Light sections need `text-[var(--nb-foreground)]`
- Ensure proper pairing: `nb-surface-strong` + `nb-foreground-inverse`
