#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const port = Number(process.env.PERF_TEST_PORT || 3377);
const baseUrl = `http://127.0.0.1:${port}`;

const budgets = [
  {
    route: "/",
    minScore: 0.95,
    maxFcp: 1800,
    maxLcp: 2500,
    maxTbt: 200,
    maxCls: 0.1,
  },
  {
    route: "/blog",
    minScore: 0.95,
    maxFcp: 1800,
    maxLcp: 2500,
    maxTbt: 200,
    maxCls: 0.1,
  },
  {
    route: "/blog/hello-world",
    minScore: 0.9,
    maxFcp: 2600,
    maxLcp: 3000,
    maxTbt: 200,
    maxCls: 0.1,
  },
];

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: options.stdio || "inherit",
      env: { ...process.env, ...options.env },
    });

    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${cmd} ${args.join(" ")} failed with exit code ${code}\n${stderr}`));
      }
    });

    child.on("error", (error) => reject(error));
  });
}

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok || response.status === 404) {
        return;
      }
    } catch {
      // Keep polling until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Server did not become ready at ${url} within ${timeoutMs}ms`);
}

async function ensureBuildExists() {
  const buildIdPath = path.join(root, ".next", "BUILD_ID");
  if (fs.existsSync(buildIdPath)) {
    return;
  }

  console.log("\n📦 No build output found. Running production build for perf tests...\n");
  await run("pnpm", ["build"]);
}

async function runLighthouse(route) {
  const safeRoute = route.replace(/\//g, "_") || "root";
  const outputPath = path.join(os.tmpdir(), `lighthouse-${safeRoute}-${Date.now()}.json`);

  await run("npx", [
    "-y",
    "lighthouse",
    `${baseUrl}${route}`,
    "--quiet",
    "--chrome-flags=--headless=new --no-sandbox",
    "--only-categories=performance",
    "--output=json",
    `--output-path=${outputPath}`,
  ]);

  return JSON.parse(fs.readFileSync(outputPath, "utf8"));
}

function extractMetrics(report, route) {
  return {
    route,
    score: report.categories.performance.score,
    fcp: report.audits["first-contentful-paint"].numericValue,
    lcp: report.audits["largest-contentful-paint"].numericValue,
    tbt: report.audits["total-blocking-time"].numericValue,
    cls: report.audits["cumulative-layout-shift"].numericValue,
  };
}

function validateBudget(metrics, budget) {
  const failures = [];

  if (metrics.score < budget.minScore) {
    failures.push(`score ${metrics.score.toFixed(2)} < ${budget.minScore.toFixed(2)}`);
  }
  if (metrics.fcp > budget.maxFcp) {
    failures.push(`FCP ${Math.round(metrics.fcp)}ms > ${budget.maxFcp}ms`);
  }
  if (metrics.lcp > budget.maxLcp) {
    failures.push(`LCP ${Math.round(metrics.lcp)}ms > ${budget.maxLcp}ms`);
  }
  if (metrics.tbt > budget.maxTbt) {
    failures.push(`TBT ${Math.round(metrics.tbt)}ms > ${budget.maxTbt}ms`);
  }
  if (metrics.cls > budget.maxCls) {
    failures.push(`CLS ${metrics.cls.toFixed(3)} > ${budget.maxCls.toFixed(3)}`);
  }

  return failures;
}

async function runPerformanceTests() {
  console.log("\n════════════════════════════════════════════════");
  console.log("⚡ PERFORMANCE BUDGET TESTS");
  console.log("════════════════════════════════════════════════");

  await ensureBuildExists();

  const server = spawn("pnpm", ["exec", "next", "start", "-p", String(port)], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });

  const stopServer = () => {
    if (!server.killed) {
      server.kill("SIGINT");
    }
  };

  process.on("SIGINT", () => {
    stopServer();
    process.exit(1);
  });

  try {
    await waitForServer(baseUrl);

    const results = [];
    const failures = [];

    for (const budget of budgets) {
      console.log(`\n🔎 Auditing ${budget.route} ...`);
      const report = await runLighthouse(budget.route);
      const metrics = extractMetrics(report, budget.route);
      const routeFailures = validateBudget(metrics, budget);

      results.push(metrics);
      if (routeFailures.length > 0) {
        failures.push({ route: budget.route, errors: routeFailures });
      }
    }

    console.log("\nRoute             Score   FCP(ms)  LCP(ms)  TBT(ms)  CLS");
    console.log("-----------------------------------------------------------");
    for (const item of results) {
      console.log(
        `${item.route.padEnd(16)} ${item.score.toFixed(2).padStart(5)}   ${String(
          Math.round(item.fcp)
        ).padStart(7)}  ${String(Math.round(item.lcp)).padStart(7)}  ${String(
          Math.round(item.tbt)
        ).padStart(7)}  ${item.cls.toFixed(3).padStart(5)}`
      );
    }

    if (failures.length > 0) {
      console.error("\n❌ Performance budgets failed:");
      for (const failure of failures) {
        console.error(`- ${failure.route}`);
        for (const error of failure.errors) {
          console.error(`  • ${error}`);
        }
      }
      process.exitCode = 1;
      return;
    }

    console.log("\n✅ Performance budgets passed.");
  } finally {
    stopServer();
  }
}

runPerformanceTests().catch((error) => {
  console.error("\n❌ Performance budget tests failed to run.");
  console.error(error.message);
  process.exit(1);
});
