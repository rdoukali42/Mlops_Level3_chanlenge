# 🔒 Security Setup Guide

## ⚠️ IMPORTANT: Sensitive Files Removed for Security

This repository has been cleaned for public distribution. The following sensitive files have been removed and replaced with example templates:

### 🚫 Files NOT included in this repository:

1. **Supabase Configuration**
   - `src/integrations/supabase/client.ts` → Use `client.example.ts` as template
   - `supabase/config.toml` → Use `config.example.toml` as template

2. **API Service Configuration**
   - `src/components/chat/apiService.ts` → Use `apiService.example.ts` as template

3. **Deployment Scripts**
   - `deploy.sh` → Use `deploy.example.sh` as template
   - `deploy-to-firebase.sh` → Create your own based on example
   - `update.sh` → Create your own
   - `setup-gcloud.sh` → Create your own

4. **Cloud Configuration**
   - `firebase.json` → Use `firebase.example.json` as template
   - `app.yaml` → Contains project-specific settings

5. **Lock Files** (can be regenerated)
   - `package-lock.json`
   - `bun.lockb`

## 🛠️ Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy `src/integrations/supabase/client.example.ts` to `src/integrations/supabase/client.ts`
3. Replace the placeholders:
   ```typescript
   const SUPABASE_URL = "https://your-project-id.supabase.co";
   const SUPABASE_PUBLISHABLE_KEY = "your-supabase-anon-key-here";
   ```
4. Copy `supabase/config.example.toml` to `supabase/config.toml`
5. Update with your project ID:
   ```toml
   project_id = "your-supabase-project-id"
   ```

### 2. Chat API Setup (Optional)

If you want to use the chat functionality:

1. Set up n8n or your preferred webhook service
2. Copy `src/components/chat/apiService.example.ts` to `src/components/chat/apiService.ts`
3. Replace the webhook URLs:
   ```typescript
   const MESSAGE_API_ENDPOINT = "https://your-n8n-instance.app.n8n.cloud/webhook-test/your-webhook-id";
   const FILE_API_ENDPOINT = "https://your-n8n-instance.app.n8n.cloud/webhook-test/your-file-webhook-id";
   ```

### 3. Firebase/Google Cloud Setup

1. Create a Google Cloud project
2. Enable Firebase Hosting
3. Copy `firebase.example.json` to `firebase.json`
4. Update the site ID:
   ```json
   {
     "hosting": {
       "site": "your-firebase-site-id",
       // ... rest of config
     }
   }
   ```

### 4. Deployment Setup

1. Copy `deploy.example.sh` to `deploy.sh`
2. Update the project variables:
   ```bash
   PROJECT_ID="your-google-cloud-project-id"
   SERVICE_NAME="your-service-name"
   ```
3. Make the script executable:
   ```bash
   chmod +x deploy.sh
   ```

## 🔐 Environment Variables (Recommended)

For enhanced security, consider using environment variables instead of hardcoded values:

### Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
VITE_MESSAGE_API_ENDPOINT=https://your-n8n-instance.app.n8n.cloud/webhook-test/your-webhook-id
VITE_FILE_API_ENDPOINT=https://your-n8n-instance.app.n8n.cloud/webhook-test/your-file-webhook-id
```

### Update your code to use environment variables:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## 📦 Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Set up your configuration files (see above)

3. Run the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## 🚀 Deployment

After setting up all configuration files:

```bash
# Deploy to Firebase (default)
./deploy.sh

# Deploy to Cloud Run
./deploy.sh cloudrun

# Deploy to App Engine
./deploy.sh appengine

# Deploy to all platforms
./deploy.sh all
```

## ⚡ Quick Start (Without External Services)

If you just want to run the app locally without external services:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. The app will work with mock data, but chat and database features will be disabled

## 🛡️ Security Best Practices

- Never commit real API keys or sensitive configuration
- Use environment variables for sensitive data
- Regularly rotate API keys and tokens
- Review `.gitignore` before committing
- Use Firebase Security Rules for Supabase
- Implement proper CORS settings for APIs

## 📋 Checklist Before Going Live

- [ ] All example files replaced with real configuration
- [ ] Environment variables set up
- [ ] API keys configured
- [ ] Firebase project created and configured
- [ ] Security rules implemented
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate enabled
- [ ] Error monitoring set up
- [ ] Backup strategy in place

## 🆘 Need Help?

- Check the main README.md for project-specific documentation
- Review DEPLOYMENT.md for detailed deployment instructions
- Ensure all dependencies are installed
- Verify your API keys and project IDs are correct
- Check browser console for error messages
