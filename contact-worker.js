export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://mattacianel.pages.dev",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const form = await request.formData();
      const name = form.get('name');
      const email = form.get('email');
      const message = form.get('message');

      if (!name || !email || !message) {
        return new Response('Missing fields', { status: 400, headers: corsHeaders });
      }

      const payload = {
        personalizations: [{ to: [{ email: env.CONTACT_EMAIL }] }],
        from: { email: env.CONTACT_EMAIL },
        subject: `New message from ${name}`,
        content: [{ type: 'text/plain', value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}` }]
      };

      const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        return new Response('OK', { status: 200, headers: corsHeaders });
      }
      
      return new Response('Failed to send', { status: 500, headers: corsHeaders });

    } catch (err) {
      return new Response(err.message, { status: 500, headers: corsHeaders });
    }
  }
};