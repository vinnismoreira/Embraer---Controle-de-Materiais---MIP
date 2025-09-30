import { google } from "googleapis";

const sheets = google.sheets("v4");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    name,
    materialId,
    desc,
    quantity,
    status,
    location,
    discardReason,
    verificationDate,
    expiryDate,
    responsible
  } = req.body;

  try {
    const client = await auth.getClient();
    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:K",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          name,
          materialId,
          desc,
          location,
          discardReason,
          verificationDate,
          expiryDate,
          responsible,
          quantity,
          status,
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