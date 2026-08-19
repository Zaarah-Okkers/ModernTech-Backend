import {
  getSettings,
  updateSettings
} from "../models/settingsModel.js";


export async function fetchSettings(req, res) {

  try {

    const settings = await getSettings();

    res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {

    console.error("Settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve settings"
    });

  }

}


export async function saveSettings(req, res) {

  try {

    const {
      companyName,
      hrContactEmail,
      notifications,
      darkMode
    } = req.body;


    if (!companyName || !hrContactEmail) {

      return res.status(400).json({
        success: false,
        message: "Company name and HR email are required"
      });

    }


    await updateSettings(
      companyName,
      hrContactEmail,
      notifications,
      darkMode
    );


    res.status(200).json({
      success: true,
      message: "Settings updated successfully"
    });

  } catch (error) {

    console.error("Settings update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update settings"
    });

  }

}