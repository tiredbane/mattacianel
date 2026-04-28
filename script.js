document.getElementById('contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const res = await fetch('/contact', { method: 'POST', body: data });
  if (res.ok) {
    alert('Message sent! I’ll get back to you soon.');
    form.reset();
  } else {
    alert('Error: ' + (await res.text()));
  }
});