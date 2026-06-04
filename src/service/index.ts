import { axiosInstance } from "./api";
import type { ILoginPayload } from "./service";

export class service {
    /** user login */
    static async userlogin(payload: ILoginPayload) {
        return await axiosInstance.post("/auth/login", payload)
    }
    static async getuserprofile() {
        return await axiosInstance.get("/users/profile")
    }
    /** user login */
}