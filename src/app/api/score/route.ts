import { google } from "googleapis";

export const runtime = "nodejs";

type SheetsApiConfig = {
  spreadsheetId: string;
  sheetName: string;
  clientEmail: string;
  privateKey: string;
};

type ScorePayload = {
  at: string;
  kind: string;
  playerName: string;
  totalTimeMs: number | string;
  attempts: number | string;
  mainTotalTimeMs: number;
  mainAttempts: number;
  sideTotalTimeMs: number;
  sideAttempts: number;
};

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function getEndpoint() {
  return (
    process.env.SHEETS_ENDPOINT || process.env.NEXT_PUBLIC_SHEETS_ENDPOINT || ""
  );
}

function getSheetsApiConfig(): SheetsApiConfig | null {
  const spreadsheetId =
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
    process.env.SHEETS_SPREADSHEET_ID ||
    "";
  const sheetName =
    process.env.GOOGLE_SHEETS_SHEET_NAME ||
    process.env.SHEETS_SHEET_NAME ||
    "Scores";
  const clientEmail =
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL || process.env.GOOGLE_SA_EMAIL || "";
  const privateKeyRaw =
    process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
    process.env.GOOGLE_SA_PRIVATE_KEY ||
    "";

  if (!spreadsheetId || !clientEmail || !privateKeyRaw) return null;

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  return { spreadsheetId, sheetName, clientEmail, privateKey };
}

async function appendRowViaSheetsApi(
  payload: Record<string, unknown>,
  config: SheetsApiConfig,
) {
  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: [SHEETS_SCOPE],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const normalized = normalizeScorePayload(payload);

  const row = [
    normalized.at,
    normalized.kind,
    normalized.playerName,
    normalized.totalTimeMs,
    normalized.attempts,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetName}!A:E`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

function normalizeScorePayload(payload: Record<string, unknown>): ScorePayload {
  const at =
    typeof payload.at === "string" && payload.at
      ? payload.at
      : new Date().toISOString();
  const kind =
    typeof payload.kind === "string" && payload.kind ? payload.kind : "score";
  const playerName =
    typeof payload.playerName === "string" ? payload.playerName : "";
  const totalTimeMs =
    typeof payload.totalTimeMs === "number"
      ? payload.totalTimeMs
      : typeof payload.totalTimeMs === "string"
        ? payload.totalTimeMs
        : "";
  const attempts =
    typeof payload.attempts === "number"
      ? payload.attempts
      : typeof payload.attempts === "string"
        ? payload.attempts
        : "";

  const asNumberOrZero = (v: unknown) => (typeof v === "number" ? v : 0);
  const baseTotal = asNumberOrZero(payload.totalTimeMs);
  const baseAttempts = asNumberOrZero(payload.attempts);

  const mainTotalTimeMs = asNumberOrZero(payload.mainTotalTimeMs) || baseTotal;
  const mainAttempts = asNumberOrZero(payload.mainAttempts) || baseAttempts;
  const sideTotalTimeMs = asNumberOrZero(payload.sideTotalTimeMs);
  const sideAttempts = asNumberOrZero(payload.sideAttempts);

  return {
    at,
    kind,
    playerName,
    totalTimeMs,
    attempts,
    mainTotalTimeMs,
    mainAttempts,
    sideTotalTimeMs,
    sideAttempts,
  };
}

async function postToWebhookEndpoint(
  endpoint: string,
  payload: Record<string, unknown>,
  requestId: string,
) {
  const started = Date.now();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);

  try {
    const normalized = normalizeScorePayload(payload);
    const webhookPayload = {
      ...payload,
      at: normalized.at,
      kind: normalized.kind,
      playerName: normalized.playerName,
      totalTimeMs: normalized.totalTimeMs,
      attempts: normalized.attempts,
      // Compatibility fields for older Apps Script handlers.
      mainTotalTimeMs: normalized.mainTotalTimeMs,
      mainAttempts: normalized.mainAttempts,
      sideTotalTimeMs: normalized.sideTotalTimeMs,
      sideAttempts: normalized.sideAttempts,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(webhookPayload),
      cache: "no-store",
      signal: controller.signal,
    });

    const elapsedMs = Date.now() - started;
    const text = await res.text().catch(() => "");
    const snippet = text.slice(0, 1200);
    const upstreamCt = res.headers.get("content-type") || "";

    let upstreamOk = res.ok;
    let upstreamErrorMessage = "";
    try {
      const parsed = JSON.parse(text) as unknown;
      if (parsed && typeof parsed === "object") {
        const rec = parsed as Record<string, unknown>;
        if (rec.status === "error") upstreamOk = false;
        if (typeof rec.message === "string") upstreamErrorMessage = rec.message;
      }
    } catch {
      // ignore non-JSON bodies
    }

    console.log(
      `[api/score][${requestId}] Upstream responded status=${res.status} ok=${upstreamOk} elapsedMs=${elapsedMs} content-type=${upstreamCt}`,
    );
    if (!upstreamOk) {
      console.warn(
        `[api/score][${requestId}] Upstream body (snippet): ${snippet}`,
      );
    } else {
      console.log(
        `[api/score][${requestId}] Upstream body (snippet): ${snippet}`,
      );
    }

    return {
      ok: upstreamOk,
      status: res.status,
      body: snippet,
      elapsedMs,
      errorMessage: upstreamErrorMessage,
    };
  } finally {
    clearTimeout(t);
  }
}

function safeRequestId() {
  try {
    // Node 18+/modern runtimes
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function redactEndpoint(endpoint: string) {
  try {
    const u = new URL(endpoint);
    // Keep origin + last path segment; avoids logging full token-y paths if present.
    const pathParts = u.pathname.split("/").filter(Boolean);
    const tail = pathParts.slice(-3).join("/");
    return `${u.origin}/${tail}`;
  } catch {
    return "(invalid url)";
  }
}

export async function POST(req: Request) {
  const requestId = safeRequestId();
  const endpoint = getEndpoint();
  const sheetsConfig = getSheetsApiConfig();

  const ct = req.headers.get("content-type") || "";
  const cl = req.headers.get("content-length") || "";
  console.log(
    `[api/score][${requestId}] POST content-type=${ct} content-length=${cl}`,
  );

  console.log(
    `[api/score][${requestId}] endpointConfigured=${Boolean(endpoint)} endpoint=${endpoint ? redactEndpoint(endpoint) : "(empty)"}`,
  );

  console.log(
    `[api/score][${requestId}] sheetsApiConfigured=${Boolean(sheetsConfig)} sheet=${sheetsConfig ? sheetsConfig.sheetName : "(none)"}`,
  );

  if (!endpoint && !sheetsConfig) {
    // Logging not configured; treat as success (best-effort).
    console.log(
      `[api/score][${requestId}] No endpoint configured, returning 204.`,
    );
    return new Response(null, {
      status: 204,
      headers: { "x-request-id": requestId },
    });
  }

  let payload: unknown;
  let rawBody = "";
  try {
    // Read text once so we can log on JSON parse failures.
    rawBody = await req.text();
    payload = JSON.parse(rawBody);
    console.log(
      `[api/score][${requestId}] Received JSON payload (len=${rawBody.length}): ${rawBody.length > 1500 ? rawBody.slice(0, 1500) + "…" : rawBody}`,
    );
  } catch {
    console.warn(
      `[api/score][${requestId}] invalid_json (len=${rawBody.length}): ${rawBody.length > 500 ? rawBody.slice(0, 500) + "…" : rawBody}`,
    );
    return Response.json(
      { ok: false, error: "invalid_json", requestId },
      { status: 400, headers: { "x-request-id": requestId } },
    );
  }

  if (!payload || typeof payload !== "object") {
    console.warn(
      `[api/score][${requestId}] invalid_payload_type: ${typeof payload}`,
    );
    return Response.json(
      { ok: false, error: "invalid_payload_type", requestId },
      { status: 400, headers: { "x-request-id": requestId } },
    );
  }

  try {
    if (sheetsConfig) {
      const started = Date.now();
      try {
        await appendRowViaSheetsApi(
          payload as Record<string, unknown>,
          sheetsConfig,
        );
        const elapsedMs = Date.now() - started;

        console.log(
          `[api/score][${requestId}] Sheets API append ok elapsedMs=${elapsedMs} sheet=${sheetsConfig.sheetName}`,
        );

        return Response.json(
          { ok: true, provider: "sheets-api", requestId, elapsedMs },
          {
            headers: { "x-request-id": requestId, "cache-control": "no-store" },
          },
        );
      } catch (sheetErr) {
        console.warn(
          `[api/score][${requestId}] Sheets API append failed, trying webhook fallback: ${String(sheetErr)}`,
        );
      }
    }

    const upstream = await postToWebhookEndpoint(
      endpoint,
      payload as Record<string, unknown>,
      requestId,
    );

    const setupHint = upstream.errorMessage.includes("openById")
      ? "Webhook Apps Script could not open spreadsheet. Verify SHEET_ID, deployment access (Anyone), and script owner permissions."
      : undefined;

    return Response.json(
      {
        ok: upstream.ok,
        status: upstream.status,
        body: upstream.body,
        requestId,
        elapsedMs: upstream.elapsedMs,
        setupHint,
      },
      { headers: { "x-request-id": requestId, "cache-control": "no-store" } },
    );
  } catch (err) {
    console.error(`[api/score][${requestId}] Error fetching webhook:`, err);
    return Response.json(
      { ok: false, error: String(err), requestId },
      { status: 500, headers: { "x-request-id": requestId } },
    );
  }
}
