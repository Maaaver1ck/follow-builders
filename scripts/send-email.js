import { readFileSync } from 'fs';

const digest = readFileSync('/tmp/fb-digest.txt', 'utf8');

const html = digest
  .replace(/^# (.+)$/gm, '<h1 style="color:#1a1a1a;font-family:sans-serif">$1</h1>')
  .replace(/^## (.+)$/gm, '<h2 style="color:#1a1a1a;border-bottom:1px solid #eee;padding-bottom:8px;font-family:sans-serif">$1</h2>')
  .replace(/^### (.+)$/gm, '<h3 style="color:#333;font-family:sans-serif">$1</h3>')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#0066cc">$1</a>')
  .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #eee;margin:20px 0">')
  .replace(/\n\n/g, '</p><p style="font-family:sans-serif;line-height:1.6;color:#333">')
  .replace(/\n/g, '<br>');

const body = `
<div style="font-family:sans-serif;max-width:700px;margin:auto;padding:30px;color:#333">
  <p style="font-family:sans-serif;line-height:1.6;color:#333">${html}</p>
</div>`;

const today = new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' });

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
  },
  body: JSON.stringify({
    from: 'onboarding@resend.dev',
    to: process.env.TO_EMAIL,
    subject: `AI Builders Digest — ${today}`,
    html: body
  })
});

const result = await res.json();
console.log('Email result:', JSON.stringify(result));
if (result.error) {
  console.error('Failed to send email:', result.error);
  process.exit(1);
}
