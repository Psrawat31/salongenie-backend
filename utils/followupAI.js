function daysBetween(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = now - past;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function categorizeCustomer(days) {
  if (days <= 30) return "Active";
  if (days <= 60) return "At Risk";
  return "Lost";
}

function rebookingProbability(category) {
  if (category === "Active") return "85–95%";
  if (category === "At Risk") return "55–75%";
  return "20–40%";
}

function recommendedAction(category) {
  if (category === "Active") return "Send friendly WhatsApp reminder";
  if (category === "At Risk") return "Call and offer a small perk";
  return "Urgent follow-up + personalized message";
}

function aiMessage(name, days, service, category) {
  if (category === "Active") {
    return `Hi ${name}! It’s been ${days} days since your last ${service}. Want a quick refresh? We’d love to have you again 😊`;
  }
  if (category === "At Risk") {
    return `Hi ${name}, we noticed it’s been a while since your last visit. If you want a ${service} touch-up, we can reserve a special slot for you this week!`;
  }
  return `Hey ${name}, it's been ${days} days since we saw you last. We hope everything is okay. We’d love to offer you a comfort ${service} session — want us to check available slots?`;
}

module.exports = {
  daysBetween,
  categorizeCustomer,
  rebookingProbability,
  recommendedAction,
  aiMessage
};
