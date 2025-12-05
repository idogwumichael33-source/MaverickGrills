require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "/")));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reservation POST route
app.post("/reserve", async (req, res) => {
  const data = req.body;

  const htmlContent = `
    <h2>New Reservation Request</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email || "Not provided"}</p>
    <p><strong>Service:</strong> ${data.service}</p>
    <p><strong>Event Date:</strong> ${data.eventDate}</p>
    <p><strong>Plates/Qty:</strong> ${data.plates}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Notes:</strong> ${data.notes}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Maverick Grill" <${process.env.EMAIL_USER}>`,
      to: process.env.CLIENT_EMAIL,
      subject: "New Reservation Request",
      html: htmlContent,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// Fallback: send index.html for any unknown route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
