require("dotenv").config();
const mysql = require("mysql2/promise");
const { google } = require("googleapis");
const cron = require("node-cron");
const fs = require("fs");

// Autenticación con Google
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const connectDB = async () => {
  return await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
  });
};

const syncData = async () => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const conn = await connectDB();
    const [rows] = await conn.execute("SELECT * FROM cliente");
    await conn.end();

    const data = rows.map(obj => Object.values(obj)); // convertir a array de arrays

    // Escribir encabezado + datos
    const headers = Object.keys(rows[0]);
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${process.env.SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [headers, ...data],
      },
    });

    console.log("✅ Datos sincronizados:", new Date().toLocaleString());
  } catch (err) {
    console.error("❌ Error en la sincronización:", err.message);
  }
};

// ⏱️ Ejecutar cada minuto
cron.schedule("*/5 * * * *", syncData);


module.exports = { syncData }
