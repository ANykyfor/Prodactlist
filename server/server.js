const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = "AC7fc6e0704abbd60f7c1a7575646fbf";
const authToken = "2477f2def7ab1b44ed3c6eac6faf79d32";
const twilioNumber = "+15737664486";

const client = twilio(accountSid, authToken);

app.post("/send-sms", (req, res) => {
  const { to, message } = req.body;

  client.messages
    .create({
      body: message,
      from: twilioNumber,
      to: to,
    })
    .then(msg => res.json({ success: true, sid: msg.sid }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});

app.listen(3000, () => {
  console.log("✅ Сервер запущено: http://localhost:3000");
});
