// import ReactDOM from 'react-dom/client';
// import { InternetIdentityProvider } from './hooks/useInternetIdentity';
// import { initEditor } from './hooks/useEditor';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import App from './App';
// import './index.css';

// const queryClient = new QueryClient();

// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => initEditor());
// } else {
//     initEditor();
// }

// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <QueryClientProvider client={queryClient}>
//         <InternetIdentityProvider>
//             <App />
//         </InternetIdentityProvider>
//     </QueryClientProvider>
// );


// frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initEditor } from "./hooks/useEditor";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

// Keep the editor init logic
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initEditor());
} else {
  initEditor();
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);