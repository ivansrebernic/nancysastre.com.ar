# Development Mode Setup

## Environment Configuration

The site now supports different URLs for development and production environments using the `SITE_URL` environment variable.

### Local Development Setup

1. Create or update your `.env` file:
```bash
# Copy the example file
cp .env.example .env
```

2. Set the SITE_URL for local development:
```env
SITE_URL=http://localhost:4321
```

3. Start the development server:
```bash
npm run dev
```

### Production Setup

For production, ensure your `.env` file has:
```env
SITE_URL=https://hidratacionsaludable.com.ar
```

## Email Templates

Email templates need to use the correct URL based on the environment.

### Generate Email Template for Your Environment

Run this script to generate an email template with your current SITE_URL:
```bash
node scripts/generate-email-template.js
```

This will create a file at `hubspot-email-templates/1-welcome-email-generated.html` with the correct URL.

### Manual Update

If you prefer to manually update the email template in HubSpot:

**For Development:**
```html
<a href="http://localhost:4321/bienvenido/{{contact.onboarding_token}}">
  VER PRESENTACIÓN DEL NEGOCIO
</a>
```

**For Production:**
```html
<a href="https://hidratacionsaludable.com.ar/bienvenido/{{contact.onboarding_token}}">
  VER PRESENTACIÓN DEL NEGOCIO
</a>
```

## Testing the Onboarding Flow

1. **Local Testing:**
   - Submit the form on your local site
   - Check the console for the generated onboarding URL
   - The URL should start with `http://localhost:4321`

2. **Email Testing:**
   - Use the generated email template for your environment
   - The email link will redirect to your local server

3. **Direct Access:**
   - Test page: `http://localhost:4321/bienvenido/test`
   - With token: `http://localhost:4321/bienvenido/[token]`

## Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| SITE_URL | http://localhost:4321 | https://hidratacionsaludable.com.ar | Base URL for email links |
| HUBSPOT_ACCESS_TOKEN | Same | Same | HubSpot API token |
| FORMSUBMIT_EMAIL | Same | Same | Email for form submissions |

## Troubleshooting

1. **Email links not working locally:**
   - Ensure SITE_URL is set to `http://localhost:4321`
   - Regenerate the email template with the script
   - Update HubSpot email template with local URL

2. **Console shows wrong URL:**
   - Restart the dev server after changing `.env`
   - Check that astro.config.mjs includes SITE_URL in vite.define

3. **Production deployment:**
   - Ensure SITE_URL is set correctly in production environment
   - Vercel/hosting platform should have the production URL set