# FITVERSE — AI-Powered Fitness & Nutrition Platform

FITVERSE is a modern, full-stack fitness and nutrition web application designed to help athletes and fitness enthusiasts track daily nutrition with verified Indian and global food staples, record progressive overload workout sessions, establish structured transformation journeys, track physical measurements, build healthy habits, and interact with **FitBot AI**—an intelligent assistant grounded in your real records.

---

## 1. Technology Stack

- **Frontend**:
  - React 18, TypeScript, Vite, Tailwind CSS
  - React Router DOM (v6) for navigation
  - Lucide React icons, Recharts for visual progress
  - Axios for authenticated REST API communication
- **Backend**:
  - Java 17 LTS
  - Spring Boot 3.3.x (Spring Web, Spring Security, Spring Data JPA)
  - Hibernate ORM & Jakarta Validation
  - Flyway version-controlled database migrations
  - Stateless JWT (JSON Web Token) authentication with BCrypt hashing
  - Maven Wrapper (`mvnw` / `mvnw.cmd`)
- **Database**:
  - MySQL 8.0 (Local & Cloud Persistent Storage)

---

## 2. Project Directory Structure

```text
FITVERSE/
├── .vscode/                 # Visual Studio Code workspace settings & recommended extensions
│   ├── extensions.json
│   └── settings.json
├── frontend/                # React + TypeScript + Vite web client
│   ├── src/
│   │   ├── components/      # UI components, layout, cards, and charts
│   │   ├── context/         # AuthContext (JWT session management)
│   │   ├── data/            # 22 verified Indian & global reference foods
│   │   ├── pages/           # Landing page + all 11 working dashboard routes
│   │   ├── services/        # Axios API client (uses VITE_API_BASE_URL)
│   │   ├── types/           # TypeScript domain definitions
│   │   └── utils/           # Pure nutrition calculation engine & search
│   ├── tests/               # Automated unit tests for nutrition calculations
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Java Spring Boot REST API
│   ├── src/main/java/com/fitverse/
│   ├── src/main/resources/
│   │   ├── db/migration/    # Flyway SQL migrations (V1__init_schema.sql)
│   │   └── application.yml
│   └── pom.xml
├── docs/                    # Architecture, API endpoints & deployment guides
├── .env.example             # Safe environment variable configuration template
├── .gitignore               # Excludes secrets, node_modules, target, logs
└── README.md                # Beginner-friendly setup & deployment manual
```

---

## 3. How to Open and Work in Visual Studio Code

1. Launch **Visual Studio Code**.
2. Click **File** → **Open Folder...** (or press `Ctrl + K`, `Ctrl + O`).
3. Select your project folder:
   ```text
   C:\Users\nethr\OneDrive\Desktop\FITVERSE
   ```
4. VS Code will automatically detect the `.vscode/extensions.json` file and recommend:
   - **Extension Pack for Java** (Language Support, Debugger, Maven)
   - **Spring Boot Extension Pack**
   - **Tailwind CSS IntelliSense**
   - **Thunder Client** (for testing REST APIs inside VS Code)
5. To open an integrated terminal inside VS Code, press ``Ctrl + ` `` (Backtick) or go to **Terminal** → **New Terminal**.

---

## 4. Local Development Setup

### A. Prerequisites
- **Java 17 JDK** (Installed: Temurin OpenJDK 17)
- **Node.js** (Installed: Node v24 & npm 11)
- **MySQL 8.0** (Service `MySQL80` running locally)

### B. Configuring Environment Variables
1. Copy `.env.example` to create your local `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Update `.env` with your local MySQL credentials:
   ```env
   DB_URL=jdbc:mysql://localhost:3306/fitverse_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   ```

### C. Running the Frontend
1. Open a terminal in the `frontend` folder:
   ```powershell
   cd frontend
   npm.cmd install
   npm.cmd run dev
   ```
2. Open your browser at:
   ```text
   http://localhost:5173
   ```

### D. Running Frontend Tests
Run the automated nutrition calculation and serving-conversion test suite:
```powershell
cd frontend
npm.cmd test
```

### E. Running the Java Spring Boot Backend
1. Open a separate terminal in the `backend` folder:
   ```powershell
   cd backend
   ./mvnw.cmd spring-boot:run
   ```
2. The backend REST API will start on:
   ```text
   http://localhost:8080
   ```
3. API documentation (Swagger UI) is available at:
   ```text
   http://localhost:8080/swagger-ui/index.html
   ```

---

## 5. Live Online Deployment Plan

To make FITVERSE available to anyone on the internet, we deploy the frontend and backend to separate free-tier cloud platforms:

| Component | Recommended Host | Why | Output URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** or **Netlify** | Native Vite/React support, free global CDN, automatic HTTPS, fast builds | `https://fitverse.vercel.app` |
| **Backend** | **Render** or **Railway** | Native Java 17 / Docker support, environment variable secret manager | `https://fitverse-backend.onrender.com` |
| **Database** | **Aiven** / **Clever Cloud** / **Railway** | Managed persistent MySQL with SSL, zero data wipe on redeploys | `mysql://user:pass@host:port/db` |

### How Frontend Connects to Backend in Production
1. When you deploy the frontend on Vercel, set the environment variable:
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```
2. In your backend environment settings, configure CORS:
   ```env
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
3. The frontend communicates with the backend over secure HTTPS with no hardcoded localhost addresses.

---

## 6. Troubleshooting Common Questions

- **PowerShell Execution Policy Error on npm?**
  Always use `npm.cmd` instead of `npm` in PowerShell on Windows to bypass `.ps1` script restrictions.
- **Port 5173 or 8080 already in use?**
  Vite will automatically offer the next port (e.g. 5174). For the backend, edit `PORT=8081` in your `.env`.
- **Database Connection Refused?**
  Verify the Windows MySQL service is running by opening PowerShell and running:
  ```powershell
  Get-Service -Name MySQL80
  ```
  If stopped, start it with `Start-Service MySQL80` (requires Administrator).
