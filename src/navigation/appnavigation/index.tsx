import { Route, Routes, Navigate } from 'react-router-dom'
import {
    AdminDashboard,
    Users,
    Courses,
    Departments,
    BenchOnboarding,
    LearningJourneys,
    CourseRequests,
    UserProfile,
    Settings,
} from '../../screens/app';
import Navigation from '../../components/navigation';
import { appnavigationpath } from './apppath';
import AppUtils from '../../providers/apputils';

const AppNavigation = () => {

    return (
        <Navigation>
            <Routes>
                <Route path={appnavigationpath.admindashboard} element={<AdminDashboard />} />
                <Route path={appnavigationpath.users} element={<Users />} />
                <Route path={appnavigationpath.courses} element={<Courses />} />
                <Route path={appnavigationpath.departments} element={<Departments />} />
                <Route path={appnavigationpath.benchonboarding} element={<BenchOnboarding />} />
                <Route path={appnavigationpath.learningjourneys} element={<LearningJourneys />} />
                <Route path={appnavigationpath.courserequests} element={<CourseRequests />} />
                <Route path={appnavigationpath.userprofile} element={<UserProfile />} />
                <Route path={appnavigationpath.settings} element={<Settings />} />

                <Route path='/' index={true} element={<Navigate to={appnavigationpath.admindashboard} replace={true} />} />
                <Route path='*' index={true} element={<Navigate to={appnavigationpath.admindashboard} replace={true} />} />
            </Routes>
        </Navigation>
    )
}

export default AppUtils(AppNavigation)