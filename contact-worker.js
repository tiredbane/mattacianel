export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        const sendgridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.SENDGRID_API_KEY}`,
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: env.CONTACT_EMAIL }] }],
            from: { email: env.CONTACT_EMAIL },
            subject: `New Portfolio Message from ${name}`,
            content: [{ type: "text/plain", value: `From: ${name} (${email})\n\nMessage: ${message}` }],
          }),
        });

        if (!sendgridResponse.ok) {
          throw new Error("SendGrid API failed to send the email.");
        }

        return new Response("Message sent successfully!", {
          status: 200,
          headers: corsHeaders,
        });
      } catch (err) {
        return new Response(err.message, {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response("Send a POST request", { status: 400 });
  },
};