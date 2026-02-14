# Troubleshooting Guide

This guide helps you resolve common issues when setting up and running XMRChat.

## Emails are not sending

If emails are not being sent from the application, follow these steps to diagnose and fix the issue:

### 1. Check Email Configuration in `.env`

First, verify that all required email environment variables are set correctly in your `server/.env` file:

- `MAIL_HOST` - Your SMTP server hostname (e.g., `smtp.gmail.com`, `smtp.mailgun.org`)
- `MAIL_PORT` - SMTP server port (commonly `587` for TLS or `465` for SSL)
- `MAIL_USERNAME` - Your SMTP username/email address
- `MAIL_PASSWORD` - Your SMTP password or app-specific password
- `MAIL_FROM_ADDRESS` - The email address that will appear as the sender
- `MAIL_FROM_NAME` - The display name for the sender

### 2. Password with Special Characters

**Important:** If your `MAIL_PASSWORD` contains a `$` (dollar sign) character, you must wrap the entire value in quotes in your `.env` file. Otherwise, the `$` will be interpreted as a variable reference.

**Incorrect:**

```env
MAIL_PASSWORD=password$test
```

**Correct:**

```env
MAIL_PASSWORD='password$test'
```

This applies to any environment variable value that contains `$` characters. Always use double quotes around values containing special characters.

### 3. Verify Environment Variables are Loaded

Ensure your `.env` file is in the correct location (`server/.env`) and that the application is reading it properly. You can verify this by checking the application logs for any configuration errors.

### 4. Development vs Production Mode

Note that in development mode (`NODE_ENV=development`), the application uses Mailhog (a local email testing tool) instead of your configured SMTP server. Make sure `NODE_ENV=production` in your `.env` file if you want to use real email sending.

### 5. Test Email Sending

You can test email functionality using the built-in command:

```bash
docker compose exec -it nest npm run commander:send-email
```

This will attempt to send a test email and help identify any configuration issues.
