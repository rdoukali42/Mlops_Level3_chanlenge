# Spotify Music Popularity Prediction

> **Arkadia LEVEL3 Program**
> This project was developed as part of the **Arkadia LEVEL3 MLOps Track**.
> Not intended for production use as-is.

A full-stack ML application that predicts whether a Spotify track will be popular or not. Trained on 584,000+ tracks using audio features. Covers the full pipeline: data preprocessing, binary classification model, REST API integration, and a React frontend with data visualization and a chat interface.

**Live:** [spotify-ml-app.web.app](https://spotify-ml-app.web.app)

## Project Structure

```
src/
├── components/          # React components
│   ├── Form.tsx        # Prediction input form
│   ├── ChatInterface.tsx # Chat functionality
│   └── ui/             # UI component library
├── pages/              # Application pages
│   ├── Index.tsx       # Landing page
│   ├── DataPrepare.tsx # Data preprocessing visualization
│   ├── Data.tsx        # Dataset exploration
│   └── Model.tsx       # Model performance
├── utils/              # Utility functions
│   ├── csvUtils.ts     # CSV data processing
│   └── labelEncoder.ts # Categorical encoding
└── hooks/              # Custom React hooks
```

## How to Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Make sure the ML model server is running on `localhost:5002` with a `/invocations` endpoint.

Copy the example config files before running:

```bash
cp firebase.example.json firebase.json
cp supabase/config.example.toml supabase/config.toml
```

### Deploy to GCP

```bash
# Firebase Hosting
npm run deploy:firebase

# Cloud Run (containerized)
npm run deploy:cloud-run
```

---

**Reda Doukali**
[github.com/rdoukali42](https://github.com/rdoukali42) | [linkedin.com/in/reda-doukali](https://linkedin.com/in/reda-doukali)
