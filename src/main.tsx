import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import TanStackProvider from "./components/TanStackProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanStackProvider>
      <App />
    </TanStackProvider>
  </StrictMode>,
);
