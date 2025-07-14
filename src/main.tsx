import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.js'
import { BrowserRouter, Routes, Route } from "react-router";
import URLDetailPage from './pages/URLDetailPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<App/>} />
        <Route path="/url/:id" element={<URLDetailPage/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
