const { sendEmail } = require("./sendEmail");

const checkAndAlertLowStock = async (ingredient, type) => {
  const DANGER_THRESHOLD = 5;

  if (ingredient.availableQty < DANGER_THRESHOLD) {
    const subject = `⚠️ Low Stock Alert: ${ingredient.name} (${type})`;
    const message = `
      The ingredient "${ingredient.name}" under type "${type}" has dropped below the safe limit.
      Current quantity: ${ingredient.availableQty}
      Please restock it soon to ensure uninterrupted pizza creation.
    `;

    await sendEmail(process.env.ADMIN_EMAIL, subject, message);
  }
};

module.exports = checkAndAlertLowStock;
