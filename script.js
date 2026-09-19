document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.site-header .nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Secure website email helper. Uses the site's own Vercel API endpoint and Google Workspace mailbox.
  async function sendToEmail(form, subject, extraFields = {}) {
    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v, k) => { payload[k] = v; });
    Object.entries(extraFields).forEach(([k, v]) => { payload[k] = v; });
    payload._subject = subject;
    payload._page = window.location.href;
    const res = await fetch('/api/send-enquiry', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok || result.success !== true) throw new Error(result.message || 'Email delivery failed');
    return result;
  }

  const craveThumb = document.querySelector('.crave-thumb');
  const craveMain = document.getElementById('craveMainImage');
  if (craveThumb && craveMain) {
    craveThumb.addEventListener('click', () => {
      const next = craveThumb.dataset.image;
      const current = craveMain.getAttribute('src');
      craveMain.setAttribute('src', next);
      craveThumb.dataset.image = current;
      craveThumb.querySelector('span').textContent = next.includes('info') ? 'View product photo →' : "See what's inside →";
    });
  }

  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const old = btn.textContent; btn.disabled = true; btn.textContent = 'Sending…';
      const d = new FormData(form);
      const text = `Hello Etnova Pharma,\n\nWebsite enquiry\nName: ${d.get('name')||''}\nCompany: ${d.get('company')||''}\nEmail: ${d.get('email')||''}\nCountry: ${d.get('country')||''}\nRequirement: ${d.get('message')||''}`;
      try {
        await sendToEmail(form, 'Etnova Pharma Website Enquiry', { 'WhatsApp message': text });
        alert('Thank you. Your enquiry has been sent to Etnova Pharma.');
        const wa = `https://wa.me/918983128824?text=${encodeURIComponent(text)}`;
        window.open(wa, '_blank', 'noopener');
        form.reset();
      } catch (err) {
        alert('We could not send the email right now. Please try again or contact Etnova Pharma on WhatsApp.');
      } finally { btn.disabled = false; btn.textContent = old; }
    });
  }

  const stars = [...document.querySelectorAll('.feedback-stars button')];
  const out = document.getElementById('selectedRating');
  let rating = 0;
  stars.forEach(btn => btn.addEventListener('click', () => {
    rating = Number(btn.dataset.rating);
    stars.forEach(x => x.classList.toggle('selected', Number(x.dataset.rating) <= rating));
    if (out) out.textContent = `${rating} / 5 selected`;
  }));

  const STORAGE_KEY = 'etnova_customer_feedback_v1';
  function getFeedback() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
  function saveFeedback(item) { const all = getFeedback(); all.unshift(item); localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); return all; }
  function starsText(n) { return '★'.repeat(n) + '☆'.repeat(5-n); }
  function renderFeedback() {
    const list = getFeedback();
    const grid = document.getElementById('liveFeedbackGrid');
    if (!grid) return;
    grid.innerHTML = list.map((x, i) => `<article class="review live-review"><div class="review-head"><span class="avatar">${escapeHtml((x.name||'C').charAt(0).toUpperCase())}</span><div><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.date)}</small></div></div><div class="stars">${starsText(Number(x.rating))}</div><p>${escapeHtml(x.feedback)}</p><small>Customer feedback submitted on this website</small></article>`).join('');
    const more = document.getElementById('feedbackSeeMore');
    if (more) more.hidden = false;
    [...grid.children].forEach((el,i) => { if (i >= 2) el.classList.add('extra-feedback'); });
  }
  function escapeHtml(v) { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  renderFeedback();

  const f = document.getElementById('feedbackForm');
  if (f) f.addEventListener('submit', async e => {
    e.preventDefault();
    if (!rating) { alert('Please select a star rating first.'); return; }
    const btn = f.querySelector('button[type="submit"]'); const old = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';
    const d = new FormData(f);
    const item = { name: d.get('name'), email: d.get('email'), feedback: d.get('feedback'), rating, date: new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'2-digit',year:'numeric'}) };
    // Save and render first so the customer never loses a valid feedback submission.
    saveFeedback(item); renderFeedback();
    try {
      await sendToEmail(f, `Customer Feedback - ${item.rating}/5`, { 'Rating': `${item.rating}/5` });
      siteNotice('Feedback submitted', `Thank you. Your feedback is now visible in See More Feedback and has been sent to Etnova Pharma for review.`);
    } catch (err) {
      siteNotice('Feedback saved', `Your feedback is now visible in See More Feedback. Email delivery to Etnova Pharma could not be confirmed right now.`);
    } finally {
      f.reset(); rating = 0; stars.forEach(x => x.classList.remove('selected')); if (out) out.textContent = 'Select a rating';
      btn.disabled = false; btn.textContent = old;
    }
  });

  const see = document.getElementById('feedbackSeeMore');
  if (see) see.addEventListener('click', () => { window.location.href = 'feedback.html'; });
});
