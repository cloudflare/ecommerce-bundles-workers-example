"use strict";
const { GoogleSpreadsheet } = require("google-spreadsheet");

module.exports.add_to_sheet = async (event) => {
  try {
    const auth = event.headers["x-auth-token"];
    if (!auth || auth !== process.env.AUTH_KEY) {
      return {
        status: 401,
        body: "Unauthorized",
      };
    }

    const { email, sheet_id } = event.queryStringParameters;
    if (!email) throw new Error("Missing email param");
    if (!sheet_id) throw new Error("Missing sheet_id param");

    const doc = new GoogleSpreadsheet(sheet_id);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow([email]);

    return {
      statusCode: 201,
      body: "OK",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.toString(),
      }),
    };
  }
};
