import db from "../config/db.js";

export async function getSettings() {

  const [rows] = await db.query(`
    SELECT
      settings_id,
      company_name,
      hr_contact_email,
      notification_enabled,
      dark_mode_enabled
    FROM settings
    LIMIT 1
  `);

  return rows[0];
}


export async function updateSettings(
  companyName,
  hrContactEmail,
  notifications,
  darkMode
) {

  const [result] = await db.query(`
    UPDATE settings
    SET
      company_name = ?,
      hr_contact_email = ?,
      notification_enabled = ?,
      dark_mode_enabled = ?
    WHERE settings_id = 1
  `, [
    companyName,
    hrContactEmail,
    notifications,
    darkMode
  ]);

  return result;
}