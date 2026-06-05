import { axiosInstance } from "./api";
import type { ILoginPayload, IOnboardUserPayload, IUpdateAdminUserPayload } from "./service";

export class service {
    /** user login */
    static async userlogin(payload: ILoginPayload) {
        return await axiosInstance.post("/auth/login", payload)
    }
    static async getDepartments() {
        return await axiosInstance.get("/departments", { params: { _t: Date.now() } })
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
    static async updateAdminUser(id: string, payload: { employeeId?: string; name?: string; email?: string; password?: string; isActive?: boolean }) {
        return await axiosInstance.patch(`/users/admins/${id}`, payload)
    }
    static async getUsers(params: { page?: number; limit?: number; search?: string; role?: string; department?: string; status?: string }) {
        const safeParams = { ...params, limit: params.limit ?? 90 };
        return await axiosInstance.get("/users", { params: safeParams })
    }
    static async updateAdminUser(id: string, payload: IUpdateAdminUserPayload) {
        return await axiosInstance.patch(`/users/admins/${id}`, payload)
    }
    static async createDepartment(payload: { departlist: { name: string; manager_name: string; employee_id: string }[] }) {
        return await axiosInstance.post('/departments', payload)
    }
    static async updateDepartment(id: string, payload: { name: string; manager_name: string; employee_id: string; isActive: boolean }) {
        return await axiosInstance.patch(`/departments/${id}`, payload)
    }
    static async getAdminUsers(params: { page?: number; limit?: number; department?: string; role?: string; status?: string; search?: string }) {
        return await axiosInstance.get("/users/admins", { params })
    }
    static async getBenchUsers(params: { department?: string } = {}) {
        return await axiosInstance.get("/users", { params: { page: 1, limit: 90, ...params } })
    }
    static async updateUserStatus(id: string, status: string) {
        return await axiosInstance.patch(`/users/${id}/status`, { status })
    }
    static async getManagerUsers() {
        return await axiosInstance.get("/users", { params: { page: 1, limit: 90 } })
    }
    static async getCourses(page: number = 1, limit: number = 90) {
        return await axiosInstance.get(`/courses?page=${page}&limit=${limit}`)
    }
    static async deleteCourse(id: string) {
        return await axiosInstance.delete(`/courses/${id}`)
    }
    static async addCourse(payload: any) {
        return await axiosInstance.post("/courses", payload)
    }
    static async assignCourse(payload: { course_id: string; mentor_id: string; user_id: string }) {
        return await axiosInstance.post("/courses/assign", payload)
    }
    static async updateAssignedCourse(payload: { user_id: string; course_id: string; coordinator_id: string }) {
        return await axiosInstance.patch(`/courses/assign`, payload)
    }
    static async getAssignedCourses(params: { page?: number; limit?: number; user_id?: string; status?: string }) {
        return await axiosInstance.get("/courses/assign", { params })
    }
    static async getLearningJourneys(params: { page?: number; limit?: number } = {}) {
        return await axiosInstance.get("/learning-journeys", { params: { page: 1, limit: 20, ...params } })
    }
}