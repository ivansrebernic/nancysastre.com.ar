# HubSpot Workflow Setup - Step by Step Guide

## Quick Overview
This workflow sends 4 emails over 7 days to new leads from the "Únete al equipo" form:
1. **Welcome** (5 minutes)
2. **Benefits** (1 day)
3. **Success Stories** (3 days)
4. **Special Offer** (7 days)

## Step 1: Create Custom Property

1. Go to **Settings** → **Properties** → **Contact properties**
2. Click **Create property**
3. Fill in:
   - **Label**: Form Source
   - **Internal name**: `form_source`
   - **Field type**: Single-line text
   - **Group**: Contact information
4. Click **Create**

## Step 2: Upload Email Templates to HubSpot

### For each email template:

1. Go to **Marketing** → **Email** → **Create** → **Regular email**
2. Choose **Drag and drop** editor
3. Click **Start from scratch**
4. In the editor:
   - Delete all default modules
   - Add a **Rich text** module
   - Click **Source code** icon (</>)
   - Copy the HTML from the template files
   - Paste and click **Apply**
5. Update email settings:
   - **From name**: Iván Srebernic
   - **From email**: Your verified email
   - **Reply-to**: srebernicivan@gmail.com
6. Save each template with these names:
   - Welcome Email - Únete al equipo
   - Benefits Email - Únete al equipo
   - Success Stories - Únete al equipo
   - Special Offer - Únete al equipo

## Step 3: Create the Workflow

1. Go to **Automation** → **Workflows**
2. Click **Create workflow** → **From scratch**
3. Select **Contact-based** → **Blank workflow**
4. Name it: "Welcome Sequence - Únete al equipo"

### Configure Enrollment Trigger:

1. Click **Set enrollment triggers**
2. Choose **When filter criteria is met**
3. Set filter:
   ```
   Contact property | Form Source | is equal to | unete_al_equipo
   ```
4. Click **Save**

### Add Email Sequence:

#### Email 1 - Welcome
1. Click **+** to add action
2. Choose **Delay** → **5 minutes**
3. Click **+** again
4. Choose **Send email**
5. Select "Welcome Email - Únete al equipo"
6. Click **Save**

#### Email 2 - Benefits
1. Click **+** after the welcome email
2. Choose **Delay** → **1 day**
3. Click **+** again
4. Choose **Send email**
5. Select "Benefits Email - Únete al equipo"
6. Click **Save**

#### Email 3 - Success Stories
1. Click **+** after the benefits email
2. Choose **Delay** → **2 days**
3. Click **+** again
4. Choose **Send email**
5. Select "Success Stories - Únete al equipo"
6. Click **Save**

#### Email 4 - Special Offer
1. Click **+** after the success stories
2. Choose **Delay** → **4 days**
3. Click **+** again
4. Choose **Send email**
5. Select "Special Offer - Únete al equipo"
6. Click **Save**

### Configure Workflow Settings:

1. Click **Settings** tab
2. General settings:
   - **Timezone**: Your local timezone
   - **Campaign**: Create new or select existing
3. Enrollment settings:
   - ✅ Remove from workflow when no longer meets criteria
   - Re-enrollment: **Enable** → After 30 days
4. Click **Save**

## Step 4: Test Before Going Live

1. Create a test contact manually:
   - Add property `form_source` = `unete_al_equipo`
   - Use a test email address
2. Check workflow **Test** tab to see if enrolled
3. Verify emails are scheduled correctly

## Step 5: Activate the Workflow

1. Toggle the workflow **ON** (top right)
2. Submit a real test through your form
3. Monitor the workflow performance

## Email Sending Schedule Summary

| Email | Delay | Total Time | Purpose |
|-------|-------|------------|---------|
| Welcome | 5 min | 5 minutes | Immediate engagement |
| Benefits | 1 day | ~24 hours | Share value proposition |
| Success Stories | 2 days | ~3 days | Build trust with social proof |
| Special Offer | 4 days | ~7 days | Convert with urgency |

## Pro Tips

1. **Best sending times**: Emails will send based on when they enrolled
2. **A/B Testing**: After running for a week, create variations
3. **Monitor metrics**: Check open rates (aim for 25%+)
4. **Personalization**: All emails use {{firstname}} token
5. **Mobile-friendly**: All templates are responsive

## Monitoring Performance

After 1 week, check:
- **Enrollment rate**: How many form submissions enrolled
- **Email performance**: Open rates, click rates
- **Unsubscribes**: Should be under 2%
- **Goal completion**: How many contacted via WhatsApp

## Next Steps

Once this is working well:
1. Create a second workflow for people who don't open emails
2. Add SMS follow-up (requires HubSpot upgrade)
3. Create product-specific sequences
4. Set up lead scoring based on engagement

## Need Help?

- **Workflow not enrolling**: Check form_source is being set
- **Emails not sending**: Verify email is connected in HubSpot
- **Low open rates**: Test different subject lines
- **High unsubscribes**: Increase delay between emails