import React from "react";
import {
    DashboardRounded,
    PeopleRounded,
    CorporateFareRounded,
    MenuBookRounded,
    SchoolRounded,
    RouteRounded,
    SettingsRounded,
    PersonAddAlt1Rounded,
} from "@mui/icons-material";
import { appnavigationpath } from "../../navigation/appnavigation/apppath";

export const navigations = (): { _id: number, visible: true | false, isActive?: string[], navigator: string, name: string, icon: (color: string) => React.JSX.Element }[] => {
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
            visible: true,
            isActive: [appnavigationpath.users],
            navigator: appnavigationpath.users,
            name: "Users",
            icon: (color: string) => <PeopleRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 3,
            visible: true,
            isActive: [appnavigationpath.departments],
            navigator: appnavigationpath.departments,
            name: "Departments",
            icon: (color: string) => <CorporateFareRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 4,
            visible: true,
            isActive: [appnavigationpath.learningprograms],
            navigator: appnavigationpath.learningprograms,
            name: "Learning Programs",
            icon: (color: string) => <SchoolRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 5,
            visible: true,
            isActive: [appnavigationpath.courses],
            navigator: appnavigationpath.courses,
            name: "Courses",
            icon: (color: string) => <MenuBookRounded fontSize="small" sx={{ color }} />
        },
        {
            _id: 6,
            visible: true,
            isActive: [appnavigationpath.benchonboarding],
            navigator: appnavigationpath.benchonboarding,
            name: "Bench Onboarding",
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
            visible: true,
            isActive: [appnavigationpath.settings],
            navigator: appnavigationpath.settings,
            name: "Settings",
            icon: (color: string) => <SettingsRounded fontSize="small" sx={{ color }} />
        },
    ]
}
