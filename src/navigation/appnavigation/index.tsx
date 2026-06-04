import { Route, Routes, Navigate } from 'react-router-dom'
import {
    AdminDashboard,
} from '../../screens/app';
import Navigation from '../../components/navigation';
import { appnavigationpath } from './apppath';
import AppUtils from '../../providers/apputils';

const AppNavigation = () => {
    
    return (
        <Navigation>
            <Routes>
                <Route path={appnavigationpath.admindashboard} element={<AdminDashboard />} />

                <Route path='/' index={true} element={<Navigate to={appnavigationpath.admindashboard} replace={true} />} />
                <Route path='*' index={true} element={<Navigate to={appnavigationpath.admindashboard} replace={true} />} />
            </Routes>
        </Navigation>
    )
}

export default AppUtils(AppNavigation)