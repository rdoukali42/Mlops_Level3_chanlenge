# Spotify Music Popularity Prediction

A comprehensive machine learning web application that predicts music popularity using Spotify dataset features. This project combines data science, machine learning, and modern web development to create an interactive platform for music popularity analysis.

## 🎵 Project Overview

This application analyzes over 584,000 Spotify tracks to predict whether a song will be popular or unpopular based on various musical features. The project showcases the complete machine learning pipeline from data preprocessing to model deployment and interactive prediction.

## 🚀 Features

### Data Analysis & Visualization
- **Interactive Data Preparation**: Visualize data cleaning steps including label encoding, column dropping, and categorical data handling
- **Feature Engineering**: Transform raw music data into ML-ready formats
- **Statistical Analysis**: Explore relationships between musical features and popularity

### Machine Learning Model
- **Binary Classification**: Predicts song popularity (Popular/Unpopular)
- **17 Feature Model**: Uses comprehensive audio features for prediction
- **Real-time Predictions**: Instant results through REST API integration

### Interactive Interface
- **Prediction Form**: Input song features and get instant popularity predictions
- **Auto-fill Options**: Load random samples from the dataset for testing
- **Data Exploration**: Browse through dataset samples with index-based selection
- **Chat Interface**: Discuss analysis and results with an integrated chat system

## 🎼 Musical Features Used

The model analyzes these Spotify audio features:

**Basic Info:**
- Artist name, Track name, Year, Genre

**Audio Features:**
- **Danceability**: How suitable for dancing (0.0 to 1.0)
- **Energy**: Intensity and power (0.0 to 1.0) 
- **Valence**: Musical positiveness (0.0 to 1.0)
- **Tempo**: Beats per minute
- **Loudness**: Overall loudness in decibels
- **Speechiness**: Presence of spoken words
- **Acousticness**: Acoustic vs electric sound
- **Instrumentalness**: Vocal content prediction
- **Liveness**: Live audience presence
- **Key**: Musical key (0-11)
- **Mode**: Major (1) or minor (0)
- **Duration**: Track length in milliseconds
- **Time Signature**: Beat grouping (3-7)

## 🛠️ Technology Stack

**Frontend:**
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** for modern, accessible UI components
- **Radix UI** primitives for robust component foundation

**Backend Integration:**
- **REST API** integration for ML model predictions
- **CSV Data Processing** for dataset management
- **Label Encoding** utilities for categorical data

**Development Tools:**
- **ESLint** for code quality
- **TypeScript** for static type checking
- **Bun/npm** for package management

## 🔧 Setup & Installation

### Prerequisites
- Node.js 16+ or Bun
- Python ML model server (runs on localhost:5002)

### Installation Steps

```sh
# Clone the repository
git clone <repository-url>
cd level3_mlops

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

### ML Model Setup
Ensure your machine learning model server is running on `localhost:5002` with the `/invocations` endpoint for predictions.

## 📊 Dataset Information

- **Size**: 584,002+ Spotify tracks
- **Format**: CSV with 17 feature columns
- **Source**: Spotify Web API audio features
- **Timeframe**: Multi-year dataset excluding 2023 data
- **Target**: Binary classification (Popular/Unpopular)

## 🎯 Model Performance

The application showcases various model metrics and performance visualizations:
- Confusion matrices for classification results
- Feature importance analysis
- Class balance handling with weighted training
- Performance metrics before and after parameter tuning

## 🌐 Usage

1. **Explore Data**: Navigate to the Data Preparation section to understand the preprocessing pipeline
2. **Make Predictions**: Use the prediction form to input song features and get popularity predictions
3. **Test with Samples**: Use AutoFill to load random songs from the dataset
4. **Analyze Results**: Review prediction confidence and model explanations
5. **Chat Interface**: Discuss findings and ask questions about the analysis

## 📁 Project Structure

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

## 🔮 Future Enhancements

- Real-time Spotify API integration
- Advanced feature engineering
- Model ensemble techniques
- User playlist analysis
- Music recommendation system
- A/B testing framework for model improvements

## 📈 Contributing

This project demonstrates modern MLOps practices and full-stack development. Contributions are welcome for:
- Model improvements and new algorithms
- UI/UX enhancements
- Additional data sources
- Performance optimizations
- Documentation improvements

---

Built with ❤️ for music lovers and data scientists
