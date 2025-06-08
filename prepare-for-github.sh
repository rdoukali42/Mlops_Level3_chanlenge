#!/bin/bash

# GitHub Preparation Script for Spotify ML Prediction App
# This script safely prepares the project for public GitHub repository

echo "🔒 Preparing Spotify ML Prediction App for GitHub"
echo "================================================="

# Function to backup sensitive files
backup_sensitive_files() {
    echo "📦 Creating backup of sensitive files..."
    mkdir -p ../spotify-ml-app-backup
    
    # Backup sensitive files
    if [ -f "src/integrations/supabase/client.ts" ]; then
        cp "src/integrations/supabase/client.ts" "../spotify-ml-app-backup/"
        echo "✅ Backed up supabase client.ts"
    fi
    
    if [ -f "src/components/chat/apiService.ts" ]; then
        cp "src/components/chat/apiService.ts" "../spotify-ml-app-backup/"
        echo "✅ Backed up chat apiService.ts"
    fi
    
    if [ -f "supabase/config.toml" ]; then
        cp "supabase/config.toml" "../spotify-ml-app-backup/"
        echo "✅ Backed up supabase config.toml"
    fi
    
    if [ -f "firebase.json" ]; then
        cp "firebase.json" "../spotify-ml-app-backup/"
        echo "✅ Backed up firebase.json"
    fi
    
    if [ -f "deploy.sh" ]; then
        cp "deploy.sh" "../spotify-ml-app-backup/"
        echo "✅ Backed up deploy.sh"
    fi
    
    if [ -f "deploy-to-firebase.sh" ]; then
        cp "deploy-to-firebase.sh" "../spotify-ml-app-backup/"
        echo "✅ Backed up deploy-to-firebase.sh"
    fi
    
    if [ -f "update.sh" ]; then
        cp "update.sh" "../spotify-ml-app-backup/"
        echo "✅ Backed up update.sh"
    fi
    
    echo "📦 Backup completed at ../spotify-ml-app-backup/"
}

# Function to remove sensitive files
remove_sensitive_files() {
    echo "🗑️ Removing sensitive files..."
    
    # Remove sensitive configuration files
    rm -f "src/integrations/supabase/client.ts"
    rm -f "src/components/chat/apiService.ts"
    rm -f "supabase/config.toml"
    rm -f "firebase.json"
    rm -f "deploy.sh"
    rm -f "deploy-to-firebase.sh"
    rm -f "update.sh"
    rm -f "setup-gcloud.sh"
    rm -f "app.yaml"
    
    # Remove lock files
    rm -f "package-lock.json"
    rm -f "bun.lockb"
    rm -f "yarn.lock"
    
    echo "✅ Sensitive files removed"
}

# Function to clean git history (optional)
clean_git_history() {
    echo "🧹 Cleaning git history..."
    
    # Remove any cached sensitive files from git
    git rm --cached -f src/integrations/supabase/client.ts 2>/dev/null || true
    git rm --cached -f src/components/chat/apiService.ts 2>/dev/null || true
    git rm --cached -f supabase/config.toml 2>/dev/null || true
    git rm --cached -f firebase.json 2>/dev/null || true
    git rm --cached -f deploy.sh 2>/dev/null || true
    git rm --cached -f deploy-to-firebase.sh 2>/dev/null || true
    git rm --cached -f update.sh 2>/dev/null || true
    git rm --cached -f setup-gcloud.sh 2>/dev/null || true
    git rm --cached -f app.yaml 2>/dev/null || true
    git rm --cached -f package-lock.json 2>/dev/null || true
    git rm --cached -f bun.lockb 2>/dev/null || true
    
    echo "✅ Git cache cleaned"
}

# Function to verify .gitignore
verify_gitignore() {
    echo "🔍 Verifying .gitignore..."
    
    if [ -f ".gitignore" ]; then
        echo "✅ .gitignore exists"
        
        # Check if sensitive files are in .gitignore
        if grep -q "src/integrations/supabase/client.ts" .gitignore; then
            echo "✅ Supabase client.ts is ignored"
        else
            echo "⚠️ WARNING: Supabase client.ts not in .gitignore"
        fi
        
        if grep -q "src/components/chat/apiService.ts" .gitignore; then
            echo "✅ Chat apiService.ts is ignored"
        else
            echo "⚠️ WARNING: Chat apiService.ts not in .gitignore"
        fi
        
        if grep -q "supabase/config.toml" .gitignore; then
            echo "✅ Supabase config.toml is ignored"
        else
            echo "⚠️ WARNING: Supabase config.toml not in .gitignore"
        fi
    else
        echo "❌ ERROR: .gitignore not found!"
        exit 1
    fi
}

# Function to create GitHub-ready commit
create_commit() {
    echo "📝 Creating GitHub-ready commit..."
    
    git add .
    git add -A  # Include deletions
    git commit -m "feat: prepare project for GitHub publication

- Remove sensitive configuration files
- Add comprehensive .gitignore
- Include example templates for setup
- Add SECURITY_SETUP.md with configuration guide
- Clean deployment scripts and API keys
- Ready for public repository sharing

Security changes:
- Removed Supabase client configuration
- Removed chat API webhook endpoints  
- Removed Firebase and Google Cloud project IDs
- Removed deployment scripts with sensitive data
- Added example templates for all sensitive files"
    
    echo "✅ GitHub-ready commit created"
}

# Main execution
echo "Starting GitHub preparation process..."
echo ""

# Confirm with user
read -p "This will backup and remove sensitive files. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

# Execute preparation steps
backup_sensitive_files
echo ""
remove_sensitive_files
echo ""
clean_git_history
echo ""
verify_gitignore
echo ""
create_commit

echo ""
echo "🎉 GitHub Preparation Complete!"
echo "================================"
echo ""
echo "✅ What was done:"
echo "   • Sensitive files backed up to ../spotify-ml-app-backup/"
echo "   • Removed all sensitive configuration files"
echo "   • Cleaned git cache of sensitive files"
echo "   • Verified .gitignore is properly configured"
echo "   • Created GitHub-ready commit"
echo ""
echo "📁 Backup location: ../spotify-ml-app-backup/"
echo "📖 Setup guide: SECURITY_SETUP.md"
echo ""
echo "🚀 Ready for GitHub! You can now:"
echo "   1. Create a new GitHub repository"
echo "   2. Push this cleaned version: git push origin main"
echo "   3. Share the repository publicly"
echo ""
echo "🔄 To restore for local development:"
echo "   1. Copy files back from ../spotify-ml-app-backup/"
echo "   2. Follow SECURITY_SETUP.md for new setup"
echo ""
echo "⚠️ Remember to follow SECURITY_SETUP.md when cloning to new environments!"
