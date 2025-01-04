import { del, get, post } from "./api_helper";


export const auth = {
    login: (data:FormData) => post('/login',data),
    validate: () => get('/validate'),
    logout: () => get("/logout"),
}


export const student_apis = {
    get_examination_paper: (paperId: string | number) => get(`/examination-paper/${paperId}`),
    myCourse: () => get('/my-course'),
}

export const admin_apis = {
    examination:{
        create: (data:FormData) => post('/examination',data),
        update: (data:FormData) => post('/examination-update',data),
        delete: (examinationId:string) => del(`/examination/${examinationId}`),
        read: () => get(`/examination`),
        select: (examinationId:string) => get(`/examination/${examinationId}`),
        search: (data:FormData) => get(`/examination-search`,data),
    },
    question:{
        create: (data:FormData) => post('/question',data),
        update: (questionId:string,data:FormData) => post(`/question/${questionId}`,data),
        delete: (questionId:string) => del(`/question/${questionId}`),
        read: () => get(`/question`),
        select: (questionId:string) => get(`/question/${questionId}`),
        search: (data:FormData) => post(`/question-search`,data),
        addMedia:(data:FormData)=>post(`/question/add-media`,data),
        removeMedia:(mediaId:string)=>del(`/question/remove-media/${mediaId}`),
    },
    courseList: () => get('/course-list'),
    get_examination_paper: (paperId: string) => get(`/examination-paper/${paperId}`),

}



