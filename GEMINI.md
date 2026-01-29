# GEMINI.md

## Project Overview

This is a web-based resume builder application. It allows users to create, edit, and export their resumes as PDF files. The application features a split-pane layout with a real-time editor on one side and a resume preview on the other.

**Main Technologies:**

*   **Frontend:** React.js (with Vite for building)
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **PDF Generation:** @react-pdf/renderer
*   **Icons:** Lucide Icons

**Architecture:**

The application is structured as a single-page application (SPA). The main components are:

*   **`src/App.jsx`:** The main application component, which sets up the layout and routing.
*   **`src/components/`:** Contains all the React components, organized by feature (Editor, Preview, Export, etc.).
*   **`src/store/`:** Contains the Zustand store for managing the application's state.
*   **`src/styles/`:** Contains the CSS and Tailwind CSS configuration.
*   **`public/`:** Contains the public assets, such as `index.html` and fonts.

## Building and Running

### Prerequisites

*   Node.js and npm (or yarn)

### Key Commands

*   **`npm install`**: To install the dependencies.
*   **`npm run dev`**: To start the development server. The application will be available at `http://localhost:5173`.
*   **`npm run build`**: To build the application for production. The output will be in the `dist` directory.
*   **`npm run lint`**: To run the ESLint code linter.
*   **`npm run preview`**: To preview the production build locally.

## Development Conventions

*   **Component-Based Architecture:** The application is built with React components, which are organized by feature in the `src/components` directory.
*   **State Management:** Zustand is used for state management. The stores are defined in the `src/store` directory.
*   **Styling:** Tailwind CSS is used for styling. The configuration is in `tailwind.config.js`.
*   **Linting:** ESLint is used for linting. The configuration is in `eslint.config.js`.
*   **Modals:** Modals are lazy-loaded for better performance.
*   **Keyboard Shortcuts:** The application has keyboard shortcuts for common actions.
*   **Custom Hooks:** Custom hooks are used for reusable logic, such as `useKeyboardShortcuts`.
