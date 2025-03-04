'use client';

import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = () => {
        dispatch(login('User'));
        router.push('/dashboard');
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
