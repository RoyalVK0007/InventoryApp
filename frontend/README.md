# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


How to Run
1. Start MySQL and create the database:

CREATE DATABASE inventory_management;

Copy
sql
2. Start the backend (set your env vars first):

cd backend
set DB_PASSWORD=your_password
set GOOGLE_CLIENT_ID=your-google-client-id
set JWT_SECRET=your-secret-key-at-least-32-characters-long
mvn spring-boot:run

Copy
cmd
3. Configure the frontend — edit frontend/.env:

VITE_GOOGLE_CLIENT_ID=your-google-client-id

Copy
4. Start the frontend:

cd frontend
npm run dev