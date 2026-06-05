import {
    CorporateFareRounded,
    DashboardRounded,
    MenuBookRounded,
    PeopleRounded,
    PersonAddAlt1Rounded,
    RouteRounded,
    SchoolRounded,
    SettingsRounded,
    AssignmentRounded
} from "@mui/icons-material";
import React from "react";
import { appnavigationpath } from "../../navigation/appnavigation/apppath";
import type { UserRole } from "../../store/reducer/AdminProfile";

const HIDE_USERS_ROLES: UserRole[] = ['MANAGER', 'EMPLOYEE'];

export const navigations = (role?: UserRole): { _id: number, visible: true | false, isActive?: string[], navigator: string, name: string, icon: (color: string) => React.JSX.Element }[] => {
    const showUsers      = !role || !HIDE_USERS_ROLES.includes(role);
    const showForManager = !role || role !== 'EMPLOYEE';
    return [
        {
            _id: 1,
            visible: true,
            isActive: [appnavigationpath.admindashboard],
            navigator: appnavigationpath.admindashboard,
            name: "Dashboard",
            icon: (color: string) => <DashboardRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 2,
            visible: showUsers,
            isActive: [appnavigationpath.users],
            navigator: appnavigationpath.users,
            name: "Users",
            icon: (color: string) => <PeopleRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 3,
            visible: showUsers,
            isActive: [appnavigationpath.departments],
            navigator: appnavigationpath.departments,
            name: "Departments",
            icon: (color: string) => <CorporateFareRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 4,
            visible: false,
            isActive: [appnavigationpath.learningprograms],
            navigator: appnavigationpath.learningprograms,
            name: "Learning Programs",
            icon: (color: string) => <SchoolRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 5,
            visible: showForManager,
            isActive: [appnavigationpath.courses],
            navigator: appnavigationpath.courses,
            name: "Courses",
            icon: (color: string) => <MenuBookRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 6,
            visible: showForManager,
            isActive: [appnavigationpath.benchonboarding],
            navigator: appnavigationpath.benchonboarding,
            name: "Team Management",
            icon: (color: string) => <PersonAddAlt1Rounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 7,
            visible: true,
            isActive: [appnavigationpath.learningjourneys],
            navigator: appnavigationpath.learningjourneys,
            name: "Learning Journeys",
            icon: (color: string) => <RouteRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 8,
            visible: showForManager,
            isActive: [appnavigationpath.courserequests],
            navigator: appnavigationpath.courserequests,
            name: "Course Requests",
            icon: (color: string) => <AssignmentRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 9,
            visible: true,
            isActive: [appnavigationpath.settings],
            navigator: appnavigationpath.settings,
            name: "Settings",
            icon: (color: string) => <SettingsRounded fontSize="small" sx={{ color }} />
        },
        // {
        //     _id: 2,
        //     visible: true,
        //     isActive: [appnavigationpath.lndcourses],
        //     navigator: appnavigationpath.lndcourses,
        //     name: "L&D Courses",
        //     icon: (color: string) => { return <MenuBookRounded fontSize="small" sx={{ color: color }} /> }
        // }
    ]
}
