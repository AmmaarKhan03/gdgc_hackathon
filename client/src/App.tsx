import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/dash" /> : <Login />} />
                <Route path="/dash" element={token ? <Dashboard /> : <Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
