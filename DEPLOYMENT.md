# Deployment Instructions for Nancy Sastre

## Prerequisites
- Node.js 18+ installed
- Vercel account (free tier works)
- Git installed (optional)

## Deployment Steps

### Option 1: Deploy with Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project:
   ```bash
   cd /Users/ivansrebernic/Documents/web-projects/hidratacionsaludable.com.ar/output/nancy-sastre
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Follow the prompts:
   - Login to Vercel (if first time)
   - Select "Set up and deploy"
   - Choose project name: nancy-sastre
   - Accept default settings

### Option 2: Deploy via Vercel Dashboard

1. Compress the project folder into a ZIP file

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project"

4. Choose "Upload" and drag your ZIP file

5. Configure:
   - Project Name: nancy-sastre
   - Framework Preset: Astro (should auto-detect)
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Click "Deploy"

## Custom Domain Setup

After deployment, you can add a custom domain:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., nancysastre.com)
4. Follow DNS configuration instructions

## Environment Variables

The following environment variables have been configured in `.env`:
- HUBSPOT_ACCESS_TOKEN (for lead management)
- SITE_URL (update after deployment)

Remember to update SITE_URL in Vercel's environment settings after deployment.

## Support

For issues or questions:
- Email: nancysastre@gmail.com
- WhatsApp: +549299651620
