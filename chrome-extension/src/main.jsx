import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MemoryRouter, Route, Routes } from "react-router";
import { Layout } from "./components";
import { Home, Settings } from "./pages";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </StrictMode>
);
