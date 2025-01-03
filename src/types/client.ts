import { UserType } from "./user";


export type ClientType = {
    client_code:number;
    business_name:string;
    subdomain:string;
    logo:string;
    api_url:string;
    asset_url:string;
    business_email:string;
    business_phone:string;
    business_address:string;
    business_city:string;
    business_district:string;
    business_state:string;
    business_pin:string;
}

export type CourseType = {
    id:number;
    name:string;
    section:string;
    type:string;
    min_eligibility:string;
    semesters:string|number;
    sem_duration_in_months:string|number;
    description:string;
    fees?:any;
    users?:UserType[];
    students?:UserType[];
    teachers?:UserType[];
    attendance?:any;
}