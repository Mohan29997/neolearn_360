import { axiosInstance } from "./api";
import type { ILoginPayload } from "./service";

export class service {

    static async findadmin(payload: ILoginPayload) {
        return await axiosInstance.patch("/admin/admin/find", payload)
    }

    static async sendloginotp(payload: ILoginPayload) {
        return await axiosInstance.patch(`/admin/auth/login/admin/verification/otp/send`, payload)
    }

    static async verifyotp(payload: { _user: string, code: number | string, mobile: number | string }) {
        return await axiosInstance.patch(`/admin/auth/login/admin/verification/${payload._user}/verify`, { mobile: payload.mobile, code: payload.code })
    }

    static async adminprofile() {
        return await axiosInstance.get("/admin/profile")
    }


    static async spherebloodpatients(query?: string) {
        return await axiosInstance.get(`/admin/sphere/blood/patients?${query}`)
    }
    static async spherebloodpatient({ _patient }: { _patient: string }) {
        return await axiosInstance.get(`/admin/sphere/blood/patient/${_patient}`)
    }

    static async patientfeedbacks(query?: string) {
        return await axiosInstance.get(`/admin/sphere/blood/patients/feedbacks?${query}`)
    }
    static async patientfeedback({ _feedback, _feedbackBy }: { _feedback: string, _feedbackBy: string }) {
        return await axiosInstance.get(`/sphere/blood/patients/feedback/${_feedback}/feedbackby/${_feedbackBy}`)
    }
    static async patientreports(query?: string) {
        return await axiosInstance.get(`/admin/sphere/blood/patients/reports?${query && query}`)
    }
    static async patientreport({ _report, _reportedBy }: { _report: string, _reportedBy: string }) {
        return await axiosInstance.get(`/sphere/blood/patients/report/${_report}/reportedby/${_reportedBy}`)
    }
    static async patientsuggestions(query?: string) {
        return await axiosInstance.get(`/admin/sphere/blood/patients/suggestions?${query && query}`)
    }
    static async patientsuggestion({ _suggestion, _suggestionBy }: { _suggestion: string, _suggestionBy: string }) {
        return await axiosInstance.get(`/sphere/blood/patients/suggestion/${_suggestion}/suggestionby/${_suggestionBy}`)
    }

    static getdonorbypincode(query?: string) {
        return axiosInstance.get(`/admin/app/summary/donor/by/pincode?${query}`)
    }
    static getdonorbycity(query?: string) {
        return axiosInstance.get(`/admin/app/summary/donor/by/city?${query}`)
    }
    static getdonorbystate(query?: string) {
        return axiosInstance.get(`/admin/app/summary/donor/by/state?${query}`)
    }
    static getdonorbycountry(query?: string) {
        return axiosInstance.get(`/admin/app/summary/donor/by/country?${query}`)
    }

    static adminuserlocation(payload: { location: { latitude: number, longitude: number }, isOnline: true | false }) {
        return axiosInstance.patch(`/admin/update/location`, payload)
    }

    static changeusertype(payload: { _type: "admin" | "patient" | "volunteer", _patient: string }) {
        return axiosInstance.patch(`/admin/sphere/blood/patient/make/admin/or/volunteer`, payload)
    }
    static patientaccountactivestatus(payload: { _status: "deactivated" | "active" | "reactivated", _patient: string, reaosn: string, reason_category: string }) {
        return axiosInstance.patch(`/admin/patient/${payload._patient}/account`, payload)
    }


    /** blood requests endpints */
    static spherebloodrequests(query?: string) {
        return axiosInstance.get(`/admin/patient/requests?${query}`)
    }
    static spherebloodrequest({_request, _requester}: {_request: string, _requester: string}) {
        return axiosInstance.get(`/admin/patient/request/${_request}/requester/${_requester}`)
    }
    static gethospitalcities(query?: string) {
        return axiosInstance.get(`/admin/patient/request/address/hospital/cities?${query}`)
    }
    static gethospitalstates(query?: string) {
        return axiosInstance.get(`/admin/patient/request/address/hospital/states?${query}`)
    }
    static gethospitalcountries(query?: string) {
        return axiosInstance.get(`/admin/patient/request/address/hospital/countries?${query}`)
    }
    static getpatientcities(query?: string) {
        return axiosInstance.get(`/admin/patient/request/address/patient/cities?${query}`)
    }
    static getpatientstates(query?: string) {
        return axiosInstance.get(`/admin/patient/request/address/patient/states?${query}`)
    }
    static getpatientcountries(query?: string) {
        return axiosInstance.get(`/admin/patient/request/address/patient/countries?${query}`)
    }
    /** blood requests endpints */
}