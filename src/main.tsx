import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { HomePage } from "./pages/home/HomePage";
import { OverviewPage } from "./pages/overview/OverviewPage";
import { ComponentsPage } from "./pages/components/ComponentsPage";
import "./styles/theme.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    {window.location.pathname.startsWith("/components") ? (
      <ComponentsPage slug={window.location.pathname.split("/")[2]} />
    ) : window.location.pathname.replace(/\/$/, "") === "/overview" ? (
      <OverviewPage />
    ) : (
      <HomePage />
    )}
  </StrictMode>,
);
