#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();

function runTest(scriptPath, name) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶️  Running ${name}...\n`);
    
    const child = spawn("node", [path.join(root, scriptPath)], {
      stdio: "inherit",
      cwd: root
    });
    
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${name} failed with exit code ${code}`));
      }
    });
    
    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function runAllTests() {
  console.log("════════════════════════════════════════════════");
  console.log("🧪 COMPREHENSIVE TEST SUITE");
  console.log("════════════════════════════════════════════════");
  
  try {
    // Run original smoke tests
    await runTest("scripts/feedback-smoke-tests.mjs", "Smoke Tests");
    
    // Run theme contrast tests
    await runTest("scripts/theme-contrast-tests.mjs", "Theme Contrast Tests");

    // Run performance budget tests
    await runTest("scripts/performance-budget-tests.mjs", "Performance Budget Tests");
    
    console.log("\n════════════════════════════════════════════════");
    console.log("✅ ALL TESTS PASSED SUCCESSFULLY");
    console.log("════════════════════════════════════════════════\n");
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n════════════════════════════════════════════════");
    console.error("❌ TEST SUITE FAILED");
    console.error("════════════════════════════════════════════════");
    console.error(`\n${error.message}\n`);
    process.exit(1);
  }
}

runAllTests();
