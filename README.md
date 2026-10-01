# FindTrace AI — AI-Assisted Missing Person CCTV Search System

**Tagline:** *“Search. Track. Verify.”*

FindTrace AI is a production-grade, cybersecurity/investigation-style web application designed to assist authorized law enforcement and security personnel in searching CCTV footage for a missing person using a reference photograph.

---

> [!IMPORTANT]
> **MANDATORY LEGAL & ETHICAL DISCLAIMER:**
> AI-generated candidate matches are probabilistic and based on visual feature similarity. They **do not establish identity** or provide definitive identity confirmation. Every candidate detection requires human verification by authorized investigators. The system never outputs language such as "Identity confirmed" or "100% match".

---

## 🌟 Key Features

1. **AI-Assisted Person Detection**: Detect human shapes in video feeds using neural vision models.
2. **Smart Multi-Frame Tracking**: Track candidate movement persistently across frames (`TRK-027`, `TRK-042`).
3. **Visual Re-ID Appearance Matching**: Extract 128-dimensional embedding vectors from reference photos and compare against detected crops using cosine similarity.
4. **Interactive Evidence Viewer**: Scrub through CCTV timestamps (`10:32:14`, `10:32:38`, `10:33:21`), zoom in on candidate crops with bounding box overlays, and download evidence frames.
5. **Movement Timeline**: Multi-camera visual sequence visualization (`CCTV-01` → `CCTV-03` → `CCTV-05`) with detection thumbnails.
6. **Manual Investigator Review**: Confirm ("Keep Candidate"), reject, or flag candidates with investigator rationale notes stored in the database audit log.
7. **Official Investigation Reports**: Export compliant PDF/Print, CSV, and JSON investigation reports with mandatory disclaimers.
8. **Interactive Demo Mode**: One-click "Run Demo Search" workflow allowing full demonstration without downloading heavy GPU weights.

---

## 🏗️ Modular AI Model Architecture

The AI processing pipeline is strictly decoupled using abstract base classes so models can be swapped effortlessly:

```text
BasePersonDetector
    ├── YOLOPersonDetector
    └── MockPersonDetector (Demo Mode / CPU Fallback)

BaseTracker
    ├── ByteTrackTracker
    └── MockTracker (Demo Mode / CPU Fallback)

BaseEmbeddingModel
    ├── ReIDEmbeddingModel
    └── MockEmbeddingModel (Demo Mode / CPU Fallback)
```

### Pipeline Flow:
```text
Reference Image ➔ Embedding Extraction ➔ CCTV Video ➔ Frame Sampling ➔ Person Detection ➔ Tracking ➔ Re-ID Cosine Matching ➔ Evidence Bounding Box Generation ➔ Timeline & Reports API
```

---

## 💻 Technology Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Drawing.
* **Backend**: Python 3.14, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2, Pillow (PIL), NumPy.
* **Database**: SQLite (built-in fallback database `findtrace.db`) / PostgreSQL ready.
* **Storage**: Local Storage Abstraction (`/storage/reference_photos/`, `/storage/videos/`, `/storage/evidence_frames/`).

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js v18+ and npm
- Python 3.10+

### 2. Backend Setup
```bash
cd backend
python -m pip install fastapi uvicorn sqlalchemy pydantic pillow numpy python-multipart
python seed_data.py
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Backend API will be available at: `http://127.0.0.1:8000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Web application will be live at: `http://localhost:3000`

---

## 🔐 Environment Variables (`.env.example`)

Create a `.env` file in `backend/` with the following variables:

```env
PROJECT_NAME="FindTrace AI — AI-Assisted Missing Person CCTV Search System"
VERSION="1.0.0"
SECRET_KEY="findtrace-super-secret-investigation-key-2026"
DATABASE_URL="sqlite:///backend/findtrace.db"
DEMO_MODE=true
DEFAULT_DETECTION_CONFIDENCE=0.50
DEFAULT_SIMILARITY_THRESHOLD=0.70
DEFAULT_FRAME_SAMPLING=5
```

---

## 📡 REST API Documentation

* `POST /api/auth/login` - Authenticate investigator session.
* `GET /api/cases` - List investigation cases.
* `POST /api/cases` - Create new search case.
* `POST /api/cases/{case_id}/reference` - Upload reference photo.
* `POST /api/cases/{case_id}/videos` - Add CCTV footage stream.
* `POST /api/cases/{case_id}/start-search` - Trigger AI search pipeline.
* `GET /api/cases/{case_id}/results` - Get candidate results & similarity bands.
* `GET /api/candidates/{candidate_id}/timeline` - Get multi-camera timeline events.
* `POST /api/candidates/{candidate_id}/review` - Record investigator review decision & notes.
* `GET /api/cases/{case_id}/report?format=csv|json|text` - Export investigation report.

---

## 🛡️ Security & Privacy Notice

* **Authorization Notice**: Only upload footage and photographs you are legally authorized to process.
* **Biometric Privacy**: Reference image embeddings are kept in-memory for the active search session only.
* **Audit Logging**: All investigator review decisions and notes are permanently audited.
