# Technical Test - Task Management UI

A premium, responsive Task Management application built with **Vue 3**, **Vite**, and **TypeScript**. This project integrates with a Laravel-based REST API and provides a seamless user experience for managing daily tasks.

---

## 🚀 Features

### 🔑 Authentication
- **User Registration**: Create a new account with profile validation.
- **Secure Login**: JWT-based authentication with persistent sessions.
- **Automated Logout**: Global session clearing and API-based logout integration.
- **Dynamic Navigation**: Header links toggle based on authentication state.

### 📋 Task Management (CRUD)
- **Dashboard**: A clean, paginated table view of all tasks.
- **Search**: Debounced searching for efficient task filtering.
- **Create & Edit**: A unified modal system for adding and updating tasks.
- **Delete**: Reusable confirmation dialogs for destructive actions.
- **Real-time Feedback**: Loading states and error handling for all API interactions.

---

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Networking**: [Axios](https://axios-http.com/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Styling**: Vanilla CSS with modern aesthetics (Glassmorphism, Flexbox, Grid)

---

## 📦 Project Structure

```text
src/
├── assets/         # Global styles and images
├── components/     # Reusable UI components (Modals, Dialogs)
│   ├── Common/     # Shared components (ConfirmDialog)
│   └── Task/       # Task-specific components (TaskFormModal)
├── services/       # API integration layer (Axios)
├── stores/         # Pinia stores (Auth, Task)
├── types/          # TypeScript interfaces/DTOs
├── views/          # Page components (Login, Register, Dashboard)
└── router/         # Application routing logic
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- The [Backend API](http://localhost/api/v1) must be running locally.

### 2. Clone and Install
```sh
# Clone the repository
git clone <repository-url>

# Navigate to project folder
cd technical-test-ui

# Install dependencies
npm install
```

### 3. Run Development Server
```sh
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🔒 Environment Configuration

The application currently points to `http://localhost/api/v1` as the base API endpoint. You can modify this in `src/services/api.service.ts` if your backend is hosted elsewhere.

## 🧪 Testing

```sh
# Run Unit Tests
npm run test:unit

# Run End-to-End Tests
npm run test:e2e
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
