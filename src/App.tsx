import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Clientes from './pages/Clientes';
import ClienteForm from './pages/ClienteForm';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuth } from './lib/auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/new"
          element={
            <ProtectedRoute>
              <ClienteForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/edit/:id"
          element={
            <ProtectedRoute>
              <ClienteForm />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/"
          element={isAuth() ? <Navigate to="/clientes" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
