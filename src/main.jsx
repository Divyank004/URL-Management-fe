import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import URLDetailPage from './pages/URLDetailPage.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<App/>} />
        <Route path="/url/:id" element={<URLDetailPage/>} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
