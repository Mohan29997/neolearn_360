export const userType: Record<string, "admin" | "superadmin" | "volunteer" | "patient"> = {
    admin: "admin",
    superadmin: "superadmin",
    volunteer: "volunteer",
    patient: "patient"
}

export interface IUserTypeArray {
    name: string,
    value: "patient" | "admin" | "volunteer"
}
export const userTypeArray: IUserTypeArray[] = [
    {
        name: "Patients",
        value: "patient"
    },
    {
        name: "Admin",
        value: "admin"
    },
    {
        name: "Volunteer",
        value: "volunteer"
    },
]

export interface IStatusArray {
    name: "Volunteer",
    value: 'pending' | 'fulfilled' | 'cancelled'
}
export const statusArray = [
    {
        name: "Pending",
        value: "pending"
    },
    {
        name: "Accepted",
        value: "accepted"
    },
    {
        name: "Fulfilled",
        value: "fulfilled"
    },
    {
        name: "Cancelled",
        value: "cancelled"
    },
    {
        name: "Expired",
        value: "expired"
    },
]