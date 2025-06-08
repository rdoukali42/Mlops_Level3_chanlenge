#!/bin/bash

# Spotify ML Prediction App - Universal Deployment Script
# Supports Firebase Hosting, Cloud Run, and App Engine

PROJECT_ID="your-google-cloud-project-id"
SERVICE_NAME="your-service-name"
REGION="us-central1"

echo "🚀 Spotify ML Prediction App - Universal Deployment"
echo "Project: $PROJECT_ID"
echo "=================================================="

# Function to deploy to Firebase
deploy_firebase() {
    echo "🔥 Deploying to Firebase Hosting..."
    npm run build
    firebase deploy --only hosting --project $PROJECT_ID
    echo "📱 Firebase URL: https://$PROJECT_ID.web.app"
}

# Function to deploy to Cloud Run
deploy_cloud_run() {
    echo "☁️ Deploying to Cloud Run..."
    
    # Build and push Docker image
    echo "🐳 Building Docker image..."
    gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME --project $PROJECT_ID
    
    # Deploy to Cloud Run
    echo "🚀 Deploying to Cloud Run..."
    gcloud run deploy $SERVICE_NAME \
        --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --project $PROJECT_ID
        
    echo "🌐 Cloud Run URL: https://$SERVICE_NAME-xxxxx-xx.a.run.app"
}

# Function to deploy to App Engine
deploy_app_engine() {
    echo "🚀 Deploying to App Engine..."
    npm run build
    gcloud app deploy app.yaml --project $PROJECT_ID
    echo "🌐 App Engine URL: https://$PROJECT_ID.appspot.com"
}

# Main deployment logic
case "$1" in
    "firebase"|"")
        deploy_firebase
        ;;
    "cloudrun")
        deploy_cloud_run
        ;;
    "appengine")
        deploy_app_engine
        ;;
    "all")
        echo "🚀 Deploying to all platforms..."
        deploy_firebase
        echo ""
        deploy_cloud_run
        echo ""
        deploy_app_engine
        ;;
    *)
        echo "Usage: $0 [firebase|cloudrun|appengine|all]"
        echo "  firebase   - Deploy to Firebase Hosting (default)"
        echo "  cloudrun   - Deploy to Cloud Run"
        echo "  appengine  - Deploy to App Engine"
        echo "  all        - Deploy to all platforms"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo "🔗 URLs:"
echo "   Firebase: https://$PROJECT_ID.web.app"
echo "   Cloud Run: https://$SERVICE_NAME-xxxxx-xx.a.run.app"
echo "   App Engine: https://$PROJECT_ID.appspot.com"
