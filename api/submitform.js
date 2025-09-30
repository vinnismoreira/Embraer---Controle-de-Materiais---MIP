import { google } from "googleapis";

const sheets = google.sheets("v4");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body;

  try {
    const client = await auth.getClient();
    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
    req.body.name,
    req.body.ecode,
    req.body.description,
    req.body.location,
    req.body.discardReason,
    req.body.verificationDate,
    req.body.expiryDate,
    req.body.responsible,
    req.body.quantity,
    req.body.status,
    new Date().toISOString() // timestamp
]]
      }
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar dados" });
  }
}