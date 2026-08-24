import { JWT } from "google-auth-library";

// Service account with Editor access on the sheet (share the sheet with
// GOOGLE_SERVICE_ACCOUNT_EMAIL). Separate from the public CSV export path
// log-source.ts uses for reads — this is the only place in the app that
// writes to a sheet.
function getClient(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY not configured");
  }
  // .env files can't hold literal newlines in a single-line value, so the
  // key is stored with "\n" escapes and unescaped here.
  const privateKey = rawKey.replace(/\\n/g, "\n");
  return new JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function sheetsFetch(client: JWT, path: string, init?: RequestInit): Promise<Response> {
  const { token } = await client.getAccessToken();
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API ${res.status}: ${body}`);
  }
  return res;
}

async function getFirstSheetTitle(client: JWT, spreadsheetId: string): Promise<string> {
  const res = await sheetsFetch(client, `${spreadsheetId}?fields=sheets.properties`);
  const data = (await res.json()) as { sheets: { properties: { title: string } }[] };
  const first = data.sheets[0];
  if (!first) throw new Error("Spreadsheet has no sheets");
  return first.properties.title;
}

async function getHeaderRow(client: JWT, spreadsheetId: string, title: string): Promise<string[]> {
  const res = await sheetsFetch(client, `${spreadsheetId}/values/${encodeURIComponent(`'${title}'!1:1`)}`);
  const data = (await res.json()) as { values?: string[][] };
  return data.values?.[0] ?? [];
}

// Appends one row to a sheet's first (only) tab, ordering values to match
// whatever column order the header row actually uses — same header-name-
// driven approach the *-source.ts readers use, so a reordered or narrower
// column set doesn't misalign data.
export async function appendSheetRow(spreadsheetId: string, fields: Record<string, string>) {
  const client = getClient();
  const title = await getFirstSheetTitle(client, spreadsheetId);
  const headers = await getHeaderRow(client, spreadsheetId, title);
  if (headers.length === 0) throw new Error(`Sheet "${title}" has no header row`);

  const row = headers.map((h) => fields[h] ?? "");

  // RAW (not USER_ENTERED) so date/time columns stay literal text instead of
  // Sheets reinterpreting them as locale-formatted date/time cells.
  await sheetsFetch(
    client,
    `${spreadsheetId}/values/${encodeURIComponent(`'${title}'!A1`)}:append?valueInputOption=RAW`,
    { method: "POST", body: JSON.stringify({ values: [row] }) }
  );
}
