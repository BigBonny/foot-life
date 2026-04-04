# EmailJS setup instructions

1. Install EmailJS:
   npm install @emailjs/browser

2. Sign up at https://www.emailjs.com/

3. Create an email service:
   - Go to Email Services → Add New Service
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the connection instructions

4. Create an email template:
   - Go to Email Templates → Create New Template
   - Template ID: contact_form_template
   - Use these variables: {{name}}, {{email}}, {{subject}}, {{message}}

5. Get your Public Key:
   - Go to Account → API Keys
   - Copy your Public Key

6. Add these to your .env.local:
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=contact_form_template
