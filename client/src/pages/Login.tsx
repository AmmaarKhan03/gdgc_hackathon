import { useState } from 'react';
import { api } from '../lib/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState<string | null>(null);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            location.href = '/dash';
        } catch (e: any) {
            setMsg(e?.response?.data?.message || 'Login failed');
        }
    }

    return (
        <form onSubmit={submit} style={{ display:'grid', gap:12, maxWidth:320, margin:'80px auto' }}>
            <h2>Sign in</h2>
            <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button>Login</button>
            {msg && <p>{msg}</p>}
        </form>
    );
}
