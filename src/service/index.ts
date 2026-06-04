import { axiosInstance } from "./api";
import type { ILoginPayload, IOnboardUserPayload, IUpdateAdminUserPayload } from "./service";

export class service {
    /** user login */
    static async userlogin(payload: ILoginPayload) {
        return await axiosInstance.post("/auth/login", payload)
    }
    static async getDepartments() {
        return await axiosInstance.get("/departments")
    }
    static async getuserprofile() {
        return await axiosInstance.get("/users/profile")
    }
    /** user onboard */
    static async onboardUser(payload: IOnboardUserPayload) {
        return await axiosInstance.post("/users/onboard", payload)
    }
    static async getCities() {
        return await axiosInstance.get("/users/city")
    }
    static async getRoles() {
        return await axiosInstance.get("/users/roles")
    }
    static async getUsers(params: { page?: number; limit?: number; search?: string }) {
        const safeParams = { ...params, limit: Math.min(params.limit ?? 20, 100) };
        return await axiosInstance.get("/users", { params: safeParams })
    }
    static async updateAdminUser(id: string, payload: IUpdateAdminUserPayload) {
        return await axiosInstance.patch(`/users/admins/${id}`, payload)
    }
    static async createDepartment(payload: { departlist: string[] }) {
        return await axiosInstance.post('/departments', payload)
    }
    static async getCourses(page: number = 1, limit: number = 10) {
        return await axiosInstance.get(`/courses?page=${page}&limit=${limit}`)
    }
    static async deleteCourse(id: string) {
        return await axiosInstance.delete(`/courses/${id}`)
    }
    static async addCourse(payload: any) {
        return await axiosInstance.post("/courses", payload)
    }
}