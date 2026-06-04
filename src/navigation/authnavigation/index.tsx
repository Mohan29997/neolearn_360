import { Route, Routes, Navigate } from 'react-router-dom'
import { AdminLogin } from '../../screens/auth';
import { authpath } from './authpath';

const AuthNavigation = () => {
    return (
        <Routes>
            <Route path={authpath.adminLogin} element={<AdminLogin />} />

            <Route path='/' index={true} element={<Navigate to={'/admin/login'} replace={true} />} />
            <Route path='*' index={true} element={<Navigate to={'/admin/login'} replace={true} />} />
        </Routes>
    )
}

export default AuthNavigation