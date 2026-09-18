# Deployment Guide: Render (Backend) & Vercel (Frontend)

Your project is completely configured and ready to be deployed. Follow these simple steps:

---

## Part 1: Deploy Backend to Render (Django API)

1. **Push your code to GitHub**:
   - Create a repository on GitHub (e.g. `cjo-portfolio`).
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Complete portfolio with hidden CMS and social links"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/cjo-portfolio.git
     git push -u origin main
     ```

2. **Log into [Render.com](https://render.com/)**:
   - Click **New +** → Select **Web Service**.
   - Connect your GitHub repository.
   - Configure the service:
     * **Name:** `cjo-portfolio-backend`
     * **Root Directory:** `backend`
     * **Runtime:** `Python 3`
     * **Build Command:** `./build.sh` (or `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --fake-initial`)
     * **Start Command:** `gunicorn portfolio_backend.wsgi:application`

3. **Set Environment Variables on Render**:
   * `DATABASE_URL`: `postgres://avnadmin:<YOUR_AIVEN_PASSWORD>@ostaga-itps-cjostaga-itps.c.aivencloud.com:20345/defaultdb?sslmode=require`
   * `DEBUG`: `False`
   * `ALLOWED_HOSTS`: `.onrender.com,localhost,127.0.0.1`
   * `GMAIL_APP_PASSWORD`: *(Your 16-character Gmail App Password for password resets)*
   * `SECRET_KEY`: *(Generate any random string or let Render generate one)*

4. **Deploy**:
   - Click **Create Web Service**.
   - Render will build and deploy your Django API.
   - Once complete, copy your Render URL (e.g., `https://cjo-portfolio-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel (React + Vite)

1. **Log into [Vercel.com](https://vercel.com/)**:
   - Click **Add New...** → **Project**.
   - Import your GitHub repository.

2. **Configure Project Settings**:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`

3. **Set Environment Variables on Vercel**:
   In **Environment Variables**, add:
   * **Key:** `VITE_API_BASE_URL`
   * **Value:** `https://cjo-portfolio-backend.onrender.com/api` *(replace with your actual Render backend URL)*

4. **Deploy**:
   - Click **Deploy**.
   - In ~30 seconds, your site will be live at `https://your-portfolio.vercel.app`!

---

## Part 3: Test in Production

1. Visit your Vercel URL.
2. Verify all sections load with your live Aiven PostgreSQL database data.
3. Check the **Contact** section for TikTok, Instagram, and Facebook buttons.
4. Press and hold your **Hero Logo** for 5 seconds to test Owner CMS mode in production!
