import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.js'
import { BrowserRouter, Routes, Route } from "react-router";
import URLDetailPage from './pages/URLDetailPage';
import Dashboard from './pages/Dashboard.js';
import { Navigate } from "react-router";

const isUserAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  // TODO check for expired token as well
  if(token === null || token === undefined) {
    return false;
  }
  return true;
}
const ProtectedRoute = ({ children }) => {
  const userAuthorized = isUserAuthenticated();

  if (!userAuthorized) {
    return <Navigate to="/" replace />;
  }
  return children;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<App/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/url/:id" element={<ProtectedRoute><URLDetailPage/></ProtectedRoute>} />
      </Route>
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
