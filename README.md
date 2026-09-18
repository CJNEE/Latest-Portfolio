# Christian Joseph Ostaga — Portfolio Platform

A modern, responsive, and performance-optimized personal portfolio platform built with **React + Vite** (TypeScript) and **Django REST Framework**, connected to a live managed **PostgreSQL** database on Aiven cloud.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite 5, TypeScript, Framer Motion, TanStack Query (React Query), Lucide React, HTML5 Canvas
* **Backend:** Python, Django 5, Django REST Framework, django-cors-headers, psycopg2
* **Database:** PostgreSQL (Aiven Cloud)
* **Design & Animations:** Custom Dark Navy + Teal theme (`#0a0f1e` & `#00d4aa`), interactive particle canvas background, glassmorphism cards, animated typing hero, scroll-reveal transitions, responsive mobile navbar.

---

## 📁 Project Structure

```text
PORFOLIO/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── seed_data.py                    # Script to re-seed or populate data
│   ├── portfolio_backend/              # Django core settings & routing
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── portfolio/                      # Portfolio DRF App
│       ├── models.py                   # 12 Database schema models
│       ├── serializers.py              # DRF Serializers (public-safe)
│       ├── views.py                    # Read-only public API & visit tracker
│       ├── urls.py                     # API routing (/api/...)
│       └── admin.py                    # Complete Django Admin setup
├── frontend/
│   ├── package.json
│   ├── vite.config.ts                  # Vite config with /api proxy to Django
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css                   # Global styles & design system
│       ├── types/portfolio.ts          # TypeScript interfaces
│       ├── api/                        # Axios client & typed API services
│       ├── hooks/                      # TanStack React Query hooks
│       ├── components/
│       │   ├── layout/                 # Navbar (glassmorphism) & Footer
│       │   ├── ui/                     # Particle canvas, Skeletons, Empty/Error states
│       │   └── sections/               # All 9 portfolio sections
│       └── pages/Home.tsx
├── start_backend.bat                   # 1-click backend runner
├── start_frontend.bat                  # 1-click frontend runner
└── README.md
```

---

## 🚀 Running the Project

### 1. Start the Django Backend
Double-click `start_backend.bat` or run:
```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```
* **API Endpoints:** `http://localhost:8000/api/`
* **Django Admin Panel:** `http://localhost:8000/admin/`
  * **Username:** `admin`
  * **Password:** `Admin@CJO2024!`

### 2. Start the React Frontend
Double-click `start_frontend.bat` or run:
```bash
cd frontend
npm run dev
```
* **Portfolio Website:** `http://localhost:5173/`

---

## 🌐 Public API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/profile/` | `GET` | Christian Joseph Ostaga profile & bio |
| `/api/aboutme/` | `GET` | Background & engineering philosophy |
| `/api/skills/` | `GET` | Technical skills categorized |
| `/api/projects/` | `GET` | Projects with media, demo & github URLs |
| `/api/education/` | `GET` | Educational background & timeline |
| `/api/certifications/` | `GET` | Professional certifications & verification links |
| `/api/achievements/` | `GET` | Honors, awards & achievements |
| `/api/contact/` | `GET` | Public contact methods & social links |
| `/api/resume/` | `GET` | Downloadable resume version info & links |
| `/api/analytics/track/` | `POST` | Anonymous page view tracker |

---

## 🔒 Security & Privacy

* Sensitized data (passwords, tokens, internal IDs, database credentials) is excluded from all public API endpoints.
* Django Admin provides secure authentication for managing portfolio content.
* Frontend components include robust loading skeletons, error recovery retry states, and empty states.
