# Etnova Pharma — Website Email Setup

The website no longer uses FormSubmit. Enquiries are sent by the Vercel server-side API through the existing Google Workspace mailbox `info@etnovapharmaexports.com` using Gmail SMTP.

## 1. Create a Google Workspace App Password

The Google Workspace account `info@etnovapharmaexports.com` must have 2-Step Verification enabled. In that Google account, create an **App Password** for the website mail sender. Copy the 16-character app password. Do not put it in website JavaScript or commit it to GitHub.

## 2. Add Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `GMAIL_USER` = `info@etnovapharmaexports.com`
- `GMAIL_APP_PASSWORD` = the 16-character Google App Password
- `MAIL_TO` = `info@etnovapharmaexports.com`

Apply to Production (and Preview if you want to test previews). Redeploy after saving.

## 3. What the website does

Customer form → `/api/send-enquiry` → Google Workspace SMTP → `info@etnovapharmaexports.com`. The customer can also receive a copy because the API puts their address in CC, and Reply-To is set to their email.

No FormSubmit, EmailJS, Resend, or other form-delivery service is used. Vercel is the website host and Google Workspace is the mail provider.

## 4. Test

Test the Contact Us form, then test a product enquiry from Our Products. Confirm the message appears in `info@etnovapharmaexports.com` and that the customer copy arrives.
