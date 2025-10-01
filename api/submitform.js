import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

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
    // Autenticação com Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Envio dos dados para a planilha
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "teste!A:K", // Nome da aba + colunas
      valueInputOption: "USER_ENTERED",
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
        ]],
      },
    });

    return res.status(200).json({ success: true, message: "Dados salvos com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar no Google Sheets:", err);
    return res.status(500).json({ error: "Erro ao salvar no Google Sheets" });
  }
}