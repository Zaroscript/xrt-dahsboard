import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store/store";
import { setAuth } from "./store/slices/authSlice";
import { getStoredAuth } from "./lib/mockAuth";

const existing = getStoredAuth();
if (existing) {
  store.dispatch(setAuth({ user: existing.user, isAuthenticated: true }));
}

createRoot(document.getElementById("root")!).render(<App />);
