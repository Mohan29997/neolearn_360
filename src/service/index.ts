import { axiosInstance } from "./api";
import type { ILoginPayload, IOnboardUserPayload } from "./service";

export class service {
    /** user login */
    static async userlogin(payload: ILoginPayload) {
        return await axiosInstance.post("/auth/login", payload)
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
}