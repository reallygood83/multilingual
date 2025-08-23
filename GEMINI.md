# GEMINI Project Context: Multilingual School Notice Generator

## Project Overview

This project is a full-stack web application designed to create, translate, and distribute school notices in multiple languages. Its primary goal is to bridge the communication gap for multicultural families within the Korean school system.

The application consists of two main parts:

1.  **Frontend (`school-notice-app/`)**: A React-based single-page application built with Vite. It provides a WYSIWYG editor for drafting notices, controls for AI-powered translation, and a preview panel for generating and downloading PDFs.
2.  **Backend (`backend/`)**: A Node.js server using Express. It handles API requests for translation services and other server-side logic.

**Key Technologies:**
*   **Frontend**: React, Vite, `react-quill` (for the editor), `jspdf` / `html2canvas` (for PDF generation), `axios` (for API calls).
*   **Backend**: Node.js, Express.
*   **Deployment**: Vercel, with configuration defined in `vercel.json`.
*   **Testing**: Playwright for end-to-end tests.
*   **Linting**: ESLint.

## Building and Running

### 1. Running the Backend Server

The backend server handles the translation logic.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server (runs on http://localhost:3001)
npm start
```

### 2. Running the Frontend Application

The frontend is a Vite-powered React app.

```bash
# Navigate to the frontend directory
cd school-notice-app

# Install dependencies
npm install

# Start the development server (usually on http://localhost:5173)
npm run dev
```
The development server is configured to proxy API requests from `/api` to the backend at `http://localhost:3001`.

### 3. Building for Production

The production build is configured for Vercel deployment.

```bash
# From the root directory
cd school-notice-app
npm install
npm run build
```
The output will be in the `school-notice-app/dist` directory.

### 4. Running Tests

The project uses Playwright for end-to-end testing.

```bash
# From the school-notice-app directory
npm run test:e2e

# To run tests with the UI
npm run test:e2e:ui
```

## Development Conventions

*   **Monorepo-like Structure**: The frontend and backend code are kept in separate directories (`school-notice-app/` and `backend/`) within the same repository.
*   **Environment Variables**: Configuration is managed via `.env` files. Examples (`.env.example`) are provided in both the frontend and backend directories.
*   **API Proxying**: During development, the Vite server proxies requests to the backend to avoid CORS issues. This is configured in `school-notice-app/vite.config.js`.
*   **Component-Based Architecture**: The React application follows a standard component-based structure, with components located in `school-notice-app/src/components/` and business logic services in `school-notice-app/src/services/`.
*   **Code Style**: Code quality is maintained using ESLint. Run `npm run lint` in the `school-notice-app` directory to check for issues.
*   **Deployment**: The application is designed for deployment on Vercel. The `vercel.json` file and the `buildCommand` in `package.json` define the build and deployment settings.
