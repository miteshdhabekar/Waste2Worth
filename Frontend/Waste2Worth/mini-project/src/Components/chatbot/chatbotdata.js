export const QUICK_REPLIES = [
  "How to donate food?",
  "What is Waste2Worth?",
  "How to register?",
  "Buy fertilizer",
  "Track my donation",
  "Contact support",
  "NGO registration",
];

export const BOT_RESPONSES = [
  {
    keywords: ["donate food", "donation", "how to donate", "submit donation", "give food"],
    answer: `🍱 **How to Donate Food:**

1. **Register** as a Donor on our platform
2. Click **"Donate Food"** from your dashboard or navbar
3. Fill in the donation form:
   - Food type & quantity
   - Pickup address & location
   - Upload a photo (optional)
4. Submit — our NGO partners will review and accept your donation
5. You'll receive an **email confirmation** once accepted!

Every donation counts. Thank you for fighting food waste! 💚`,
  },
  {
    keywords: ["register", "sign up", "create account", "join"],
    answer: `📝 **How to Register on Waste2Worth:**

1. Click **"Register"** in the top navbar
2. Fill in your details:
   - Full name, email, phone
   - Choose your role: **Donor** or **NGO**
   - Set a password
3. Submit the form
4. **Donors** can log in immediately!
5. **NGO accounts** require Admin approval (usually within 24 hours)

Already have an account? Click **"Login"** instead! 😊`,
  },
  {
    keywords: ["what is waste2worth", "about", "platform", "waste 2 worth", "w2w"],
    answer: `🌿 **About Waste2Worth:**

Waste2Worth is a food waste management platform that:

♻️ **Connects donors** (restaurants, households, businesses) with **NGOs** to redistribute surplus food

🌱 **Converts rotten food** into organic **fertilizers** sold through our store

📊 Tracks your impact with real-time donation analytics

🏆 Celebrates top donors on our leaderboard

Together, we're reducing food waste and fighting hunger! Join us today.`,
  },
  {
    keywords: ["contact", "support", "help", "email", "phone", "reach"],
    answer: `📞 **Contact Waste2Worth Support:**

📧 **Email:** admin@waste2worth.com
📱 **Phone:** +91-123 456 7890
📍 **Address:** 123 Ravet Road, Pune, India

🕐 **Support Hours:** Mon–Sat, 9 AM – 6 PM IST

You can also use the **Contact** page from the navbar to send us a direct message. We typically respond within 24 hours! 💬`,
  },
  {
    keywords: ["track", "status", "my donation", "donation status", "check donation"],
    answer: `🔍 **Track Your Donation:**

1. **Log in** to your Donor account
2. Go to your **Dashboard** (User Panel)
3. Click the **"Donation History"** tab
4. View the status of each donation:
   - 🟡 **Pending** — Awaiting NGO review
   - ✅ **Accepted** — NGO has accepted your donation
   - ❌ **Rejected** — Unfortunately couldn't be accommodated

You'll also receive **email notifications** for every status change! 📧`,
  },
  {
    keywords: ["buy fertilizer", "fertilizer", "store", "organic", "compost", "purchase"],
    answer: `🌿 **Buy Organic Fertilizer:**

Visit our **Store** page from the navbar! We offer:

🪴 **Organic Compost** — ₹199/kg (100% recycled food waste)
💧 **Liquid Compost Tea** — ₹149/unit (nutrient-rich liquid fertilizer)
🔬 **Biofertilizer Mix** — ₹249/kg (nitrogen-fixing microbes)

**How to buy:**
1. Click any product → **"Buy Now"**
2. Fill in your details & address
3. Pay securely via **Razorpay**
4. Get email confirmation instantly! 🎉`,
  },
  {
    keywords: ["ngo", "ngo registration", "partner", "organisation", "organization", "non-profit"],
    answer: `🤝 **NGO Registration Process:**

1. Go to the **Register** page
2. Select role as **"NGO"**
3. Fill in your organization details
4. Submit — your application goes to Admin review
5. Admin approves within **24–48 hours**
6. You'll receive an **approval email**

**As an NGO, you can:**
✅ Accept/reject food donations
📊 View sales analytics
💰 Manage fertilizer sales
📋 Export donation reports

Questions? Contact us at admin@waste2worth.com 📧`,
  },
];

export const DEFAULT_RESPONSE = `🤔 I'm not sure I understood that. Here are some things I can help with:

• How to donate food
• Registration guide
• Track donations
• Buy fertilizer
• NGO registration
• Contact support

Or click a quick reply button below! 👇`;

export const findResponse = (userMessage) => {
  const msg = userMessage.toLowerCase().trim();
  for (const item of BOT_RESPONSES) {
    if (item.keywords.some((kw) => msg.includes(kw))) {
      return item.answer;
    }
  }
  return DEFAULT_RESPONSE;
};
