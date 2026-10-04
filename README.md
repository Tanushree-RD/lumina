# Lumina

> Explainable AI for Trustworthy Exoplanet Discovery

**Live Demo:** https://lumina-xai.vercel.app/

Lumina is an AI-assisted exoplanet detection platform that combines machine learning, explainable AI, and astrophysical validation to identify potential exoplanets from astronomical observations.

The platform analyzes stellar light curves, detects transit signals, estimates atmospheric composition, explains every prediction through Explainable AI (XAI), and prioritizes candidates for scientific validation.

---

## Features

### Transit Detection
- Upload custom light curve CSV files
- Analyze preset exoplanet candidates
- Automatic transit signal detection
- Transit depth and orbital period estimation

### Atmospheric Analysis
- Generate and analyze transmission spectra
- Detect atmospheric gases including:
  - H₂O
  - CO₂
  - CH₄
  - O₃
  - O₂
  - N₂O
  - SO₂

### Explainable AI
- AI-based exoplanet classification
- Feature importance visualization
- Confidence scoring
- Physics-based validation
- Transparent prediction reasoning

### Dashboard
- Candidate summary
- Detection confidence
- Atmospheric analysis
- Candidate ranking
- Interactive charts
- Scientific results dashboard

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts

### Backend

- FastAPI (planned)
- Python
- NumPy
- Pandas
- SciPy

### AI / ML

- PyTorch
- CNN-based Transit Detection
- Explainable AI (XAI)
- Physics-based Validation

---

## Project Structure

```text
lumina/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── assets/
│
├── public/
├── backend/
├── models/
├── datasets/
└── README.md
```

---

## Getting Started

Clone the repository

```bash
git clone https://github.com/Tanushree-RD/lumina.git
```

Navigate to the project

```bash
cd lumina
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

## Live Demo

https://lumina-xai.vercel.app/

---

## Current Progress

- ✅ Landing Page
- ✅ Detection Pipeline
- ✅ Transit Detection UI
- ✅ Atmospheric Analysis UI
- ✅ Explainable AI Dashboard
- ✅ Candidate Ranking
- ✅ Responsive Design
- ✅ Vercel Deployment
- 🚧 PDF Report Export
- 🚧 Backend Integration
- 🚧 AI Model Integration

---

## Future Scope

- Real NASA Exoplanet Archive integration
- TESS and Kepler dataset support
- Transformer-based detection models
- Multi-model ensemble predictions
- Automated scientific report generation
- Observatory dashboard
- Research collaboration support

---

## License

Developed for research, educational purposes, and hackathons.

## Team

OUTLIERS
