# Project Guidelines: AppSalon MEVN

## 🌐 Project Overview
AppSalon is a modern web solution for booking management and schedule administration, specifically designed for beauty centers and spas. It uses the MEVN stack (MongoDB, Express.js, Vue.js, Node.js).

### 🎯 Objectives
- Optimize booking management.
- Reduce missed opportunities through better organization.
- Improve customer experience with automatic reminders.
- Scalable architecture for future growth.
- **CRM Integration**: Centralized dashboard for business monitoring and customer relationship management.

### 🧩 Technologies
- **Frontend**: Vue.js 3 (Composition API), Pinia (State Management), Vue Router, Tailwind CSS 4, Flowbite, Vite.
- **Validation**: Vee-Validate & Yup.
- **Security**: hCaptcha for authentication forms.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), REST API, MVC Architecture.
- **Auth**: JWT (JSON Web Tokens) with HttpOnly Cookies.
- **Mailing**: Nodemailer for automatic notifications.
- **Deployment**: Vercel.

## 📁 Project Structure
The project is organized as a monorepo with the following main directories:

- `/backend`: Express.js server and API logic.
  - `/config`: Database and server configurations.
  - `/controllers`: Request handlers following MVC.
  - `/models`: Mongoose schemas.
  - `/routes`: API endpoint definitions.
  - `/middleware`: Custom Express middlewares (Auth, etc.).
  - `/helpers`: Utility functions and mailer logic.
  - `/data`: Seeding scripts and initial data.
- `/frontend`: Vue.js application.
  - `/src/components`: Reusable UI components.
    - `/crm`: Specific components for the CRM dashboard.
  - `/src/views`: Application pages.
    - `/admin`: Administration management views.
    - `/crm`: CRM-specific views and dashboards.
    - `/appointments`: Customer booking flow.
    - `/auth`: Login, registration, and password recovery.
  - `/src/stores`: Pinia state management (appointments, services, user, useAlertStore).
  - `/public`: Static assets.

## 🛠 Development Workflow

### Installation
1. Install root dependencies: `npm install`
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`

### Running the Project
- **Backend**: `npm run dev` (standard) or `npm run dev:postman` (to allow Postman requests in development).
- **Frontend**: `npm run dev`.
- **Database**: Requires a MongoDB instance (configured via `.env` in `/backend`).

### Database Seeding
The backend includes scripts to seed the database:
- `npm run seed:import`: Imports initial data.
- `npm run seed:delete`: Clears the database.

## 🧪 Testing and Verification
- Currently, the project focuses on functional implementation.
- When making changes, verify that both frontend and backend compile and lint correctly (`npm run lint` in frontend).
- Ensure API endpoints are tested (manually or via Postman) after backend changes.
- Check responsive design on the frontend for UI changes, especially in the CRM and Admin modules.

## 🎨 Code Style
- Follow the existing MVC pattern in the backend.
- Use Composition API for Vue 3 components in the frontend.
- Tailwind CSS 4 is used for styling; avoid custom CSS where possible.
- Use Flowbite components for consistent UI patterns.
- Use meaningful variable and function names in Spanish/English as per the existing codebase (the UI and some logic use Spanish).
- Maintain consistent indentation and formatting (ESLint and Prettier are configured).

## 📝 General Instructions for Junie
- **Always** check both `backend` and `frontend` if a feature requires full-stack changes.
- Ensure `.env` variables are considered when troubleshooting connection or authentication issues.
- When adding new models or routes, follow the established patterns in their respective directories.
- Respect the authentication flow using HttpOnly cookies and JWT.
