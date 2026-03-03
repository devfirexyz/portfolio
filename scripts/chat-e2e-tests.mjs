#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const port = Number(process.env.CHAT_E2E_PORT || 3388);
const baseUrl = `http://127.0.0.1:${port}`;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runCommand(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: options.stdio || "inherit",
      env: {
        ...process.env,
        ...(options.env || {}),
      },
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} ${args.join(" ")} failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok || res.status === 404) return;
    } catch {
      // retry
    }
    await sleep(400);
  }
  throw new Error(`Server not ready at ${url}`);
}

function parseUiMessageStreamText(raw) {
  let text = "";
  const lines = raw.split("\n");
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const payload = line.slice(6).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      const json = JSON.parse(payload);
      if (json.type === "text-delta" && typeof json.delta === "string") {
        text += json.delta;
      }
    } catch {
      // ignore malformed lines in test parser
    }
  }
  return text;
}

async function getStatus({ guestId, devViewer, devUserId }) {
  const headers = {
    "x-chat-guest-id": guestId,
  };
  if (devViewer) headers["x-chat-dev-viewer"] = devViewer;
  if (devUserId) headers["x-chat-dev-user-id"] = devUserId;

  const res = await fetch(`${baseUrl}/api/chat/status`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET /api/chat/status failed (${res.status}) ${body}`);
  }
  return res.json();
}

async function getHistory({ guestId, devViewer, devUserId }) {
  const headers = {
    "x-chat-guest-id": guestId,
  };
  if (devViewer) headers["x-chat-dev-viewer"] = devViewer;
  if (devUserId) headers["x-chat-dev-user-id"] = devUserId;

  const res = await fetch(`${baseUrl}/api/chat/history`, {
    headers,
    cache: "no-store",
  });
  assert(res.ok, `GET /api/chat/history failed (${res.status})`);
  const payload = await res.json();
  return Array.isArray(payload?.messages) ? payload.messages : [];
}

async function postChat({ guestId, prompt, clientMessageId, threadClientId, devViewer, devUserId }) {
  const headers = {
    "content-type": "application/json",
    "x-chat-guest-id": guestId,
  };
  if (devViewer) headers["x-chat-dev-viewer"] = devViewer;
  if (devUserId) headers["x-chat-dev-user-id"] = devUserId;

  const body = {
    messages: [
      {
        id: `msg-${clientMessageId}`,
        role: "user",
        parts: [{ type: "text", text: prompt }],
      },
    ],
    requestMetadata: {
      clientMessageId,
      ...(threadClientId ? { threadClientId } : {}),
    },
  };

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  assert(res.ok, `POST /api/chat failed (${res.status})`);

  const text = await res.text();
  return {
    reason: res.headers.get("x-chat-reason"),
    text: parseUiMessageStreamText(text),
  };
}

async function ensureBuildExists() {
  const buildIdPath = path.join(root, ".next", "BUILD_ID");
  if (fs.existsSync(buildIdPath)) {
    return;
  }

  console.log("\n📦 Missing production BUILD_ID. Running webpack build for chat E2E...\n");
  await runCommand("pnpm", ["build"], {
    env: {
      NEXT_DISABLE_TURBOPACK: "1",
    },
  });

  if (!fs.existsSync(buildIdPath)) {
    throw new Error("Missing .next BUILD_ID after build. Chat E2E cannot start production server.");
  }
}

async function run() {
  console.log("\n════════════════════════════════════════════════");
  console.log("💬 CHAT E2E TESTS");
  console.log("════════════════════════════════════════════════");

  await ensureBuildExists();
  const storeFilePath = path.join(os.tmpdir(), `portfolio-chat-store-e2e-${Date.now()}.json`);
  try {
    fs.unlinkSync(storeFilePath);
  } catch {
    // ignore
  }

  const server = spawn("pnpm", ["exec", "next", "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      CHAT_ALLOW_DEV_VIEWER_HEADER: "1",
      CHAT_TEST_STATIC_ASSISTANT: "1",
      CHAT_TEST_DISABLE_BURST: "1",
      NEXT_PUBLIC_CONVEX_URL: "",
      CHAT_STORE_FILE_PATH: storeFilePath,
    },
  });

  const stopServer = () => {
    if (!server.killed) {
      server.kill("SIGINT");
    }
  };

  try {
    await waitForServer(baseUrl);

    // Guest flow
    const guestId = `guest-e2e-${Date.now()}`;
    const guestStart = await getStatus({ guestId });
    assert(guestStart.canSend === true, "Guest should be able to send first prompt.");

    const firstGuest = await postChat({
      guestId,
      prompt: "Who is Piyush Raj?",
      clientMessageId: "guest-first",
    });
    assert(firstGuest.reason === "guest_prompt_used", "Guest first response should be guest static.");
    assert(
      firstGuest.text.toLowerCase().includes("please log in"),
      "Guest static response should instruct user to log in."
    );

    const guestAfter = await getStatus({ guestId });
    assert(guestAfter.canSend === false, "Guest should be blocked after first prompt.");
    assert(guestAfter.reason === "guest_prompt_used", "Guest status reason should be guest_prompt_used.");
    const guestHistory = await getHistory({ guestId });
    assert(guestHistory.length >= 2, "Guest history should include first user prompt and static assistant reply.");
    assert(
      guestHistory.some((message) => message.role === "assistant"),
      "Guest history should include assistant response."
    );

    const secondGuest = await postChat({
      guestId,
      prompt: "Can you share projects?",
      clientMessageId: "guest-second",
    });
    assert(secondGuest.reason === "guest_prompt_used", "Second guest prompt must be blocked.");
    const guestHistoryAfterBlock = await getHistory({ guestId });
    assert(
      guestHistoryAfterBlock.length >= guestHistory.length,
      "Guest history should remain visible after guest gets blocked."
    );

    // Guardrail flow with new guest
    const guardGuestId = `${guestId}-guard`;
    const tooLong = "x".repeat(5001);
    const guardrailResult = await postChat({
      guestId: guardGuestId,
      prompt: tooLong,
      clientMessageId: "guest-guardrail",
    });
    assert(guardrailResult.reason === "input_too_long", "Long prompt should trigger input_too_long.");

    // Member flow (dev viewer override)
    const memberGuestId = `${guestId}-member-proxy`;
    const memberId = "member-e2e";
    for (let index = 1; index <= 30; index += 1) {
      const threadClientId = `member-thread-${Math.ceil(index / 10)}`;
      const memberResponse = await postChat({
        guestId: memberGuestId,
        prompt: `Member prompt ${index}`,
        clientMessageId: `member-${index}`,
        threadClientId,
        devViewer: "member",
        devUserId: memberId,
      });
      assert(
        memberResponse.text.length > 0,
        `Member prompt ${index} should return assistant output.`
      );
    }

    const memberAfter30 = await getStatus({
      guestId: memberGuestId,
      devViewer: "member",
      devUserId: memberId,
    });
    assert(memberAfter30.canSend === false, "Member should be blocked after 30 prompts.");
    assert(
      memberAfter30.reason === "lifetime_limit_reached",
      "Member status reason should be lifetime_limit_reached after 30 prompts."
    );

    const member31 = await postChat({
      guestId: memberGuestId,
      prompt: "Member prompt 31",
      clientMessageId: "member-31",
      threadClientId: "member-thread-4",
      devViewer: "member",
      devUserId: memberId,
    });
    assert(
      member31.reason === "lifetime_limit_reached",
      "31st member prompt should be blocked by lifetime limit."
    );
    const memberHistory = await getHistory({
      guestId: memberGuestId,
      devViewer: "member",
      devUserId: memberId,
    });
    assert(
      memberHistory.length >= 60,
      "Member history should include all accepted prompts and assistant responses."
    );

    const threadLimitId = "member-thread-limit-check";
    for (let index = 1; index <= 10; index += 1) {
      await postChat({
        guestId: `${guestId}-thread-cap`,
        prompt: `Thread cap prompt ${index}`,
        clientMessageId: `thread-cap-${index}`,
        threadClientId: threadLimitId,
        devViewer: "member",
        devUserId: `${memberId}-thread-cap`,
      });
    }
    const threadCap11 = await postChat({
      guestId: `${guestId}-thread-cap`,
      prompt: "Thread cap prompt 11",
      clientMessageId: "thread-cap-11",
      threadClientId: threadLimitId,
      devViewer: "member",
      devUserId: `${memberId}-thread-cap`,
    });
    assert(
      threadCap11.reason === "thread_prompt_limit_reached",
      "11th prompt in a single thread should be blocked by thread_prompt_limit_reached."
    );

    console.log("✅ Chat E2E tests passed.");
  } finally {
    stopServer();
    try {
      fs.unlinkSync(storeFilePath);
    } catch {
      // ignore cleanup errors
    }
  }
}

run().catch((error) => {
  console.error("\n❌ Chat E2E tests failed.");
  console.error(error.message);
  process.exit(1);
});
