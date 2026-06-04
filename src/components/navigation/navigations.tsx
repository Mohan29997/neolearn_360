import React from "react";
import {
    DashboardRounded,
    PeopleRounded,
    WaterDropRounded,
    FeedbackRounded,
    ReportRounded,
    SettingsSuggestRounded
} from "@mui/icons-material";
import { appnavigationpath } from "../../navigation/appnavigation/apppath";

export const navigations = (): {_id: number, visible: true | false, isActive?: string[], navigator: string, name: string, icon: (color: string) => React.JSX.Element}[] => {
    return [
        {
            _id: 1,
            visible: true, 
            isActive: [appnavigationpath.admindashboard],
            navigator: appnavigationpath.admindashboard,
            name: "Dashboard",
            icon: (color: string) => { return <DashboardRounded fontSize="small" sx={{ color: color }} /> }
        },
    ]
}