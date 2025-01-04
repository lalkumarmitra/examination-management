import { Examination } from "@/types/examination";
import { admin_apis } from "@/lib/helpers/api_urls";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { Loader2} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useAuth } from "@/Auth/AuthProvider";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/Custom/CustomSelect";
import { CourseType } from "@/types/client";
import { subjects } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import AddQuestionSheet from "./components/add-question-sheet";
import ChooseQuestionDialog from "./components/choose-question-dialog";

const CreatePaperPage = () => {
    const {client} = useAuth();
    const dispatch = useDispatch();
    const {examinationId} = useParams();
    const [selectedCourse,setSelectedCourse] = useState<CourseType | undefined>(undefined);
    const [selectedSubject,setSelectedSubject] = useState<string | undefined>(undefined);
    const {data,isLoading} = useQuery<Examination | undefined>({
        queryKey:['examinations'],
        queryFn:()=>admin_apis.examination.read(),
        select:(data:any)=>data.data.examination.find((examination:Examination)=>examination.id == examinationId),
        staleTime:1000*60*5,
        gcTime:1000*60*5,
    });
    const {data:classes,isLoading:classesLoading} = useQuery<CourseType[]>({
        queryKey:['courses'],
        queryFn:()=>admin_apis.courseList(),
        select:(data:any)=>data.data.course_list,
        staleTime:1000*60*5,
        gcTime:1000*60*5,
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([
            {label:'Dashboard',link:'/dashboard'},
            {label:'Examination',link:'/examination'},
            {label:'Create Paper',type:'page'}
        ]))
    },[])
    if(!examinationId) return <Navigate to="/examination" />
    if(isLoading || !client) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-4 h-4 animate-spin" /></div>
    if(!data) return <div className="flex justify-center items-center h-screen">Invalid Examination</div>
    return (
        <div className="px-4 md:px-12 py-4">
            <div className="rounded-md grid gap-4 border py-4 shadow-sm">
                {/* HEADER */}
                <div className="grid gap-4 px-4">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{client?.business_name}</h1>
                        <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-lg mx-auto">{client?.business_address} | {client?.business_phone} | {client?.business_email}</p>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-secondary-foreground">
                            {data.name} - {data.exam_code}  
                            <span className="whitespace-nowrap"> ({data.session})</span>
                        </h2>
                    </div>
                    <div className="flex gap-2 justify-between items-center px-4 w-full">
                        <div className="grid gap-2 ">
                            <Label>Select Class <span className="text-red-500">*</span></Label>
                            <CustomSelect 
                                placeholder={classesLoading?'please wait ...':'Select a class'}
                                disabled={classesLoading} 
                                options={classes?.map((course:CourseType)=>({label:course.name,value:course.id}))} 
                                onValueChange={(value:string)=>setSelectedCourse(classes?.find((course:CourseType)=>course.id.toString()===value) || undefined)}
                                className="md:min-w-64"
                            />
                        </div>
                        <div className="grid gap-2 ">
                            <Label>Select Subject <span className="text-red-500">*</span></Label>
                            <CustomSelect 
                                placeholder={classesLoading?'please wait ...':'Select a subject'}
                                disabled={classesLoading} 
                                options={Object.entries(subjects).map(([key])=>({label:key,value:key}))} 
                                onValueChange={(value:string)=>setSelectedSubject(value)}
                                className="md:min-w-64"
                            />
                        </div>
                    </div>
                </div>
                <Separator className="my-4 " />
                {/* BODY */}
                <div className="grid gap-2 px-4">
                    <div className="grid gap-2">
                        <Label>Instructions (optional)</Label>
                        <Textarea className="w-full" placeholder="Enter instructions for the paper" />
                    </div>
                </div>

            </div>
            <ChooseQuestionDialog course={selectedCourse} subject={selectedSubject} />
            <AddQuestionSheet examination={data} course={selectedCourse} subject={selectedSubject} disabled={!selectedCourse || !selectedSubject} />
        </div>
    )
}

export default CreatePaperPage;