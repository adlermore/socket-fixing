'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';

export default function DashboardPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        // Redirect to login page
        window.location.href = '/login';
    };

    return (
        <div>
            <h1>Welcome, {user}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
