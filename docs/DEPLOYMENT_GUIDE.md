# FITVERSE — Cloud Deployment Guide

This guide explains how to deploy FITVERSE online so you receive separate public URLs for your **React Frontend** and **Java Spring Boot Backend** connected to a **Persistent Cloud MySQL Database**.

---

## 1. Overview of Deployment Architecture

```mermaid
graph LR
    User[Web User] -->|HTTPS| Frontend[Vercel / Netlify<br/>React + TypeScript SPA]
    Frontend -->|REST API (JSON)| Backend[Render / Railway<br/>Java 17 Spring Boot Backend]
    Backend -->|JDBC over SSL| Database[Cloud MySQL<br/>Persistent Storage & Flyway]
```

---

## 2. Step 1: Cloud MySQL Database Setup

A production app requires a database that **does not shut down or lose data** when the backend redeploys.

### Free-Tier Managed MySQL Options:
1. **Aiven for MySQL** (Free tier available, reliable, automatic SSL).
2. **Clever Cloud** (Offers free add-on MySQL databases).
3. **Railway** (Offers managed MySQL services).

### Steps:
1. Create a MySQL database instance named `fitverse_db`.
2. Obtain your connection parameters:
   - Host (e.g. `mysql-fitverse.aivencloud.com`)
   - Port (e.g. `12345` or `3306`)
   - Database name (`fitverse_db`)
   - Username
   - Password
3. Flyway migrations in Spring Boot (`V1__init_schema.sql`) will automatically create the tables the first time the backend boots up!

---

## 3. Step 2: Deploying the Java Spring Boot Backend (Render / Railway)

### Recommended Host: **Render** (Web Service) or **Railway**
- Both support Java 17 and Docker/Maven builds natively.

### Steps on Render:
1. Connect your GitHub repository.
2. Select **Root Directory**: `backend`
3. Select **Environment**: `Java` (or `Docker` using the provided Dockerfile).
4. Set **Build Command**:
   ```bash
   ./mvnw clean package -DskipTests
   ```
5. Set **Start Command**:
   ```bash
   java -jar target/fitverse-backend-1.0.0.jar
   ```
6. Add Environment Variables:
   - `PORT`: `8080`
   - `DB_URL`: `jdbc:mysql://<your-db-host>:<port>/fitverse_db?useSSL=true&serverTimezone=UTC`
   - `DB_USERNAME`: `<your-db-user>`
   - `DB_PASSWORD`: `<your-db-password>`
   - `JWT_SECRET`: `<your-generated-256bit-secret>`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
7. Click **Deploy Web Service**.
8. Once deployed, Render will issue your public Backend URL:
   ```text
   https://fitverse-backend.onrender.com
   ```

---

## 4. Step 3: Deploying the React Frontend (Vercel)

### Recommended Host: **Vercel**
1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New Project** and select your `FITVERSE` repository.
3. Configure Project Settings:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://fitverse-backend.onrender.com/api` (your backend URL from Step 2)
5. Click **Deploy**.
6. Vercel will build and provide your public Frontend URL:
   ```text
   https://fitverse.vercel.app
   ```

---

## 5. Step 4: Verification & Handshake

Once both are deployed:
1. Open your Vercel URL in your browser: `https://fitverse.vercel.app`.
2. Click **Get Started** and register a new user.
3. Open your browser Developer Tools (`F12` → **Network** tab).
4. Verify that requests go to `https://fitverse-backend.onrender.com/api/auth/register` with status `200 OK`.
5. Log a meal in the Nutrition Tracker and verify it persists across refreshes directly in your Cloud MySQL database!
