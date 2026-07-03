import { axiosInstance } from "./api";
import type { ILoginPayload, IOnboardUserPayload, IUpdateAdminUserPayload } from "./service";
import type { IAddCoursePayload } from "../types/course.types";

/**
 * Central API service layer for NeoLearn 360.
 *
 * All HTTP calls go through this class. The underlying `axiosInstance` handles:
 * - Bearer token injection on every request
 * - Silent 401 → refresh-token → retry flow
 * - Automatic retry (up to 3×) on network errors and 5xx responses
 * - Snackbar notifications on 400 / 404 / 405 errors
 */
export class service {
    /**
     * Authenticate a user and receive access + refresh tokens.
     * @param payload - `{ email, password }`
     */
    static async userlogin(payload: ILoginPayload) {
        return await axiosInstance.post("/auth/login", payload)
    }

    /**
     * Fetch all departments. Cache-busted on every call via `_t` timestamp.
     */
    static async getDepartments() {
        return await axiosInstance.get("/departments", { params: { _t: Date.now() } })
    }

    /** Fetch the authenticated user's full profile. */
    static async getuserprofile() {
        return await axiosInstance.get("/users/profile")
    }

    /**
     * Onboard a new user into the system.
     * @param payload - User onboarding data including role, department, tech stack
     */
    static async onboardUser(payload: IOnboardUserPayload | Record<string, unknown>) {
        return await axiosInstance.post("/users/onboard", payload)
    }

    /** Fetch the list of available office cities. */
    static async getCities() {
        return await axiosInstance.get("/users/city")
    }

    /** Fetch all available user roles (used to populate role filter dropdowns). */
    static async getRoles() {
        return await axiosInstance.get("/users/roles")
    }

    /**
     * Update an admin-level user's profile fields.
     * @param id - MongoDB `_id` of the user to update
     * @param payload - Fields to update; `password` is optional (omit to keep unchanged)
     */
    static async updateAdminUser(id: string, payload: Record<string, unknown>) {
        return await axiosInstance.patch(`/users/admins/${id}`, payload)
    }

    /** Delete an admin user by ID. */
    static async deleteAdminUser(id: string) {
        return await axiosInstance.delete(`/users/admins/${id}`)
    }

    /**
     * Fetch a paginated, optionally filtered list of users.
     * Defaults to limit 90 to support client-side pagination on the Users screen.
     * @param params - Filter params: page, limit, search (name/email), role, department, status
     */
    static async getUsers(params: { page?: number; limit?: number; search?: string; role?: string; department?: string; status?: string }) {
        const safeParams = { ...params, limit: params.limit ?? 90 };
        return await axiosInstance.get("/users", { params: safeParams })
    }

    /**
     * Create one or more departments in bulk.
     * @param payload - `{ departlist }` array of `{ name, manager_name, employee_id }`
     */
    static async createDepartment(payload: { departlist: { name: string; manager_name: string; employee_id: string }[] }) {
        return await axiosInstance.post('/departments', payload)
    }

    /**
     * Update an existing department.
     * @param id - Department `_id`
     * @param payload - Updated fields including active status
     */
    static async updateDepartment(id: string, payload: { name: string; manager_name: string; employee_id: string; isActive: boolean }) {
        return await axiosInstance.patch(`/departments/${id}`, payload)
    }

    /**
     * Delete a department and its sub-departments.
     * @param id - Department `_id`
     */
    static async deleteDepartment(id: string) {
        return await axiosInstance.delete(`/departments/${id}`)
    }

    /** Fetch sub-departments of a department. */
    static async getSubDepartments(id: string) {
        return await axiosInstance.get(`/departments/${id}/sub-departments`)
    }

    /** Create a sub-department under a parent department. */
    static async createSubDepartment(parentId: string, payload: { name: string; managerName: string }) {
        return await axiosInstance.post(`/departments/${parentId}/sub-departments`, payload)
    }

    /** Update a sub-department. */
    static async updateSubDepartment(subId: string, payload: { name: string; managerName: string; isActive?: boolean }) {
        return await axiosInstance.patch(`/departments/sub-departments/${subId}`, payload)
    }

    /** Delete a sub-department. */
    static async deleteSubDepartment(subId: string) {
        return await axiosInstance.delete(`/departments/sub-departments/${subId}`)
    }

    /**
     * Fetch admin/manager users with optional filters.
     * Used by the admin user management table.
     */
    static async getAdminUsers(params: { page?: number; limit?: number; department?: string; role?: string; status?: string; search?: string }) {
        return await axiosInstance.get("/users/admins", { params })
    }

    /**
     * Fetch all bench users, optionally filtered by department.
     * Used by bench onboarding to populate the employee table.
     */
    static async getBenchUsers(params: { department?: string } = {}) {
        return await axiosInstance.get("/users", { params: { page: 1, limit: 90, ...params } })
    }

    /**
     * Update a user's bench status (on_bench / shadowing / on_project).
     * @param id - User `_id`
     * @param status - One of: `"on_bench"`, `"shadowing"`, `"on_project"`
     */
    static async updateUserStatus(id: string, status: string) {
        return await axiosInstance.patch(`/users/${id}/status`, { status })
    }

    /** Fetch all users visible to the current manager (scoped by backend). */
    static async getManagerUsers() {
        return await axiosInstance.get("/users", { params: { page: 1, limit: 90 } })
    }

    /**
     * Fetch paginated course list.
     * @param page - 1-indexed page number
     * @param limit - Items per page (default 90 for client-side pagination)
     */
    static async getCourses(page: number = 1, limit: number = 90) {
        return await axiosInstance.get(`/courses?page=${page}&limit=${limit}`)
    }

    /**
     * Delete a course by ID.
     * @param id - Course `_id`
     */
    static async deleteCourse(id: string) {
        return await axiosInstance.delete(`/courses/${id}`)
    }

    /**
     * Create a new course in the enterprise library.
     * @param payload - Course data: title, provider, level, duration, url, description
     */
    static async addCourse(payload: IAddCoursePayload) {
        return await axiosInstance.post("/courses", payload)
    }

    /**
     * Assign a course to a bench employee with a designated mentor.
     * @param payload - `{ mentor_id, user_id, pre_assessment_score }`
     */
    static async assignCourse(payload: { mentor_id: string; user_id: string; pre_assessment_score: number }) {
        return await axiosInstance.post("/courses/assign", payload)
    }

    /**
     * Update the status of an existing course assignment.
     * @param payload - `{ user_id, course_id, coordinator_id }`
     */
    static async updateAssignedCourse(payload: { user_id: string; course_id: string; coordinator_id: string }) {
        return await axiosInstance.patch(`/courses/assign`, payload)
    }

    /**
     * Fetch assigned courses, optionally filtered by user or status.
     * Used by both the Employee dashboard and the Course Requests screen.
     * @param params - Filter params: page, limit, user_id, status
     */
    static async getAssignedCourses(params: { page?: number; limit?: number; user_id?: string; status?: string }) {
        return await axiosInstance.get("/courses/assign", { params })
    }

    /**
     * Fetch structured learning journey paths.
     * @param params - page and limit (defaults to page 1, limit 20)
     */
    static async getLearningJourneys(params: { page?: number; limit?: number } = {}) {
        return await axiosInstance.get("/learning-journeys", { params: { page: 1, limit: 20, ...params } })
    }

    /** Fetch the full organisation hierarchy tree. */
    static async getOrgTree() {
        return await axiosInstance.get("/users/org-tree")
    }
}