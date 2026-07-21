const SPREADSHEET_ID = "17QQJ0Y6aDS-dAq8QvkGTDSBE58fA7BGZhHQ0oa4FSQA";
const SHEET_NAME = "問卷回覆";
const NOTIFY_EMAIL = "pamela72choi@gmail.com";

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "Pamela Creative Studio inquiry form" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = (e && e.parameter) || {};

  // Honeypot: legitimate visitors never fill this hidden field.
  if (params.website) {
    return jsonResponse_({ ok: true });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`找不到工作表：${SHEET_NAME}`);

    const submittedAt = new Date();
    sheet.appendRow([
      submittedAt,
      params.problem || "",
      params.brandName || "",
      params.industry || "",
      params.offering || "",
      params.officialWebsite || "",
      params.socialMethods || "",
      params.socialOther || "",
      params.salesMethods || "",
      params.services || "",
      params.serviceOther || "",
      params.budget || "",
      params.name || "",
      params.email || "",
      params.line || "",
      params.phone || "",
      params.sourcePage || "",
    ]);

    const row = sheet.getLastRow();
    sheet.getRange(row, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    SpreadsheetApp.flush();

    const time = Utilities.formatDate(submittedAt, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss");
    const message = [
      "網站收到一筆新的方案需求",
      "",
      `送出時間：${time}`,
      `姓名：${params.name || "未填寫"}`,
      `Email：${params.email || "未填寫"}`,
      `LINE：${params.line || "未填寫"}`,
      `電話：${params.phone || "未填寫"}`,
      "",
      `希望解決的問題：${params.problem || "未填寫"}`,
      `品牌名稱：${params.brandName || "未填寫"}`,
      `行業：${params.industry || "未填寫"}`,
      `商品／服務：${params.offering || "未填寫"}`,
      `官方網站：${params.officialWebsite || "未填寫"}`,
      `社群經營：${params.socialMethods || "未填寫"}`,
      `社群其他：${params.socialOther || "未填寫"}`,
      `目前銷售方式：${params.salesMethods || "未填寫"}`,
      `需要的服務：${params.services || "未填寫"}`,
      `其他服務：${params.serviceOther || "未填寫"}`,
      `預算：${params.budget || "未填寫"}`,
      "",
      `Google Sheet：https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
    ].join("\n");

    const mail = {
      to: NOTIFY_EMAIL,
      subject: `【網站新需求】${params.name || "未填姓名"}｜${params.problem || "方案諮詢"}`,
      body: message,
      name: "Pamela Creative Studio 網站",
    };
    if (params.email) mail.replyTo = params.email;
    MailApp.sendEmail(mail);

    return jsonResponse_({ ok: true, row: row });
  } catch (error) {
    return jsonResponse_({ ok: false, message: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
