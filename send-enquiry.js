const nodemailer = require('nodemailer');

const TO = process.env.MAIL_TO || 'info@etnovapharmaexports.com';
const USER = process.env.GMAIL_USER || TO;
const PASS = process.env.GMAIL_APP_PASSWORD;

function clean(value, max = 5000) {
  return String(value ?? '').trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  if (!PASS) return res.status(500).json({ success: false, message: 'Email service is not configured on the website yet.' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  const name = clean(body.name || body['Full Name'] || body.customerName, 150);
  const company = clean(body.company || body['Company Name'] || body.companyName, 200);
  const email = clean(body.email || body['Customer Email'] || body.customerEmail, 254);
  const phone = clean(body.phone || body['Phone / WhatsApp'] || body.customerPhone, 80);
  const country = clean(body.country || body['Destination Country'] || body.destinationCountry, 120);
  const product = clean(body.Product || body.product || body.selectedProduct, 300);
  const quantity = clean(body['Required Quantity'] || body.requiredQuantity, 100);
  const message = clean(body.message || body['Message / Requirements'] || body.customerMessage || body.feedback, 6000);
  const rating = clean(body.Rating || body.rating, 20);
  const subject = clean(body._subject || 'Etnova Pharma Website Enquiry', 200) || 'Etnova Pharma Website Enquiry';
  const page = clean(body._page || body._url, 1000);

  if (!email || !isEmail(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  if (!name) return res.status(400).json({ success: false, message: 'Please enter your name.' });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: USER, pass: PASS }
  });

  const text = [
    'Etnova Pharma Website Enquiry',
    '',
    `Name: ${name}`,
    `Company: ${company}`,
    `Customer Email: ${email}`,
    `Phone / WhatsApp: ${phone}`,
    `Destination Country: ${country}`,
    `Product: ${product}`,
    `Required Quantity: ${quantity}`,
    `Rating: ${rating}`,
    `Requirement / Message: ${message}`,
    '',
    `Submitted from: ${page}`
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17233b">
      <h2 style="margin-bottom:16px">Etnova Pharma Website Enquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">
        ${[['Name',name],['Company',company],['Customer Email',email],['Phone / WhatsApp',phone],['Destination Country',country],['Product',product],['Required Quantity',quantity],['Rating',rating],['Requirement / Message',message]].map(([k,v]) => `<tr><td style="border:1px solid #ddd;font-weight:700;width:190px">${escapeHtml(k)}</td><td style="border:1px solid #ddd">${escapeHtml(v).replace(/\n/g,'<br>')}</td></tr>`).join('')}
      </table>
      <p style="font-size:12px;color:#667085">Submitted from: ${escapeHtml(page)}</p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `Etnova Pharma <${USER}>`,
      to: TO,
      replyTo: email,
      cc: email,
      subject,
      text,
      html
    });
    return res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('SMTP send failed:', error);
    return res.status(502).json({ success: false, message: 'The enquiry could not be delivered. Please try again or use WhatsApp.' });
  }
};
