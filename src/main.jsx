import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n"; // Initialize i18n
import App from "./App.jsx";
import "./components/css/Layout css/Navbar.css";

const saved = localStorage.getItem("theme");
if (
  saved === "dark" ||
  (!saved &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
