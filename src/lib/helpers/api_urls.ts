import { del, get, post, put } from "./api_helper";


export const auth = {
    login: (data:FormData) => post('/login',data),
    validate: () => get('/validate'),
    logout: () => get("/logout"),
}

export const student_apis = {
    get_examination_paper: (paperId: string | number) => get(`/examination-paper/${paperId}`),
}

export const admin_apis = {
    examination:{
        create: (data:FormData) => post('/examination',data),
        update: (data:FormData) => put('/examination',data),
        delete: (examinationId:string) => del(`/examination/${examinationId}`),
        read: () => get(`/examination`),
        select: (examinationId:string) => get(`/examination/${examinationId}`),
        search: (data:FormData) => get(`/examination-search`,data),
    },
    get_examination_paper: (paperId: string) => get(`/examination-paper/${paperId}`),

}



