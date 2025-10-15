import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard() {
    const [ok, setOk] = useState(false);

    useEffect(() => {
        api.get('/health').then(() => setOk(true)).catch(() => setOk(false));
    }, []);

    return <div style={{ padding: 24 }}>{ok ? '✅ API connected' : '❌ API down'}</div>;
}
