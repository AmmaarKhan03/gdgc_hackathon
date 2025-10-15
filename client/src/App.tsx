import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-white text-gray-900">
                <header className="border-b">
                    <nav className="mx-auto max-w-5xl flex items-center gap-6 p-4">
                        <Link to="/" className="font-semibold">Home</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/login">Login</Link>
                    </nav>
                </header>

                <main className="mx-auto max-w-5xl p-6">
                    <Routes>
                        <Route path="/" element={<h1 className="text-3xl font-bold">Welcome</h1>} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}
