import { Examination } from "@/types/examination";
import { admin_apis } from "@/lib/helpers/api_urls";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { Loader2, PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useAuth } from "@/Auth/AuthProvider";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/Custom/CustomSelect";
import { CourseType } from "@/types/client";
import { subjects } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CreatePaperPage = () => {
    const [addQuestionFormStatus,setAddQuestionFormStatus] = useState(false);
    const {client} = useAuth();
    const dispatch = useDispatch();
    const {examinationId} = useParams();
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
                <div className="grid gap-2 px-4">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold">{client?.business_name}</h1>
                        <p className="text-base text-muted-foreground max-w-lg mx-auto">{client?.business_address} | {client?.business_phone} | {client?.business_email}</p>
                        <h2 className="text-2xl font-semibold text-secondary-foreground">{data.name} - {data.exam_code} ({data.session})</h2>
                    </div>
                    <div className="flex gap-2 justify-between items-center px-4">
                        <div className="grid gap-2">
                            <Label>Select Class</Label>
                            <CustomSelect 
                                disabled={classesLoading} 
                                options={classes?.map((course:CourseType)=>({label:course.name,value:course.id}))} 
                                onValueChange={(value:string)=>console.log(value)}
                                className="min-w-64"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Date of Paper</Label>
                            <Input type="date" className="min-w-64" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-between items-center px-4">
                        <div className="grid gap-2">
                            <Label>Select Subject</Label>
                            <CustomSelect 
                                disabled={classesLoading} 
                                options={Object.entries(subjects).map(([key])=>({label:key,value:key}))} 
                                onValueChange={(value:string)=>console.log(value)}
                                className="min-w-64"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Duration (in minutes)</Label>
                            <Input type="number" className="min-w-64" defaultValue={120}/>
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
            {addQuestionFormStatus ? (
                <div className="animate-in slide-in-from-bottom-10 absolute bottom-2 w-3/4 mx-auto left-1/2 -translate-x-1/2 flex gap-2 shadow-xl border rounded-md p-4">
                    <div onClick={()=>setAddQuestionFormStatus(false)} className="absolute cursor-pointer -top-2 -right-2 rounded-full  shadow-sm border-2 border-destructive bg-background flex items-center justify-center">
                        <X className="size-4 text-destructive" />
                    </div>
                    <Textarea className="w-full" placeholder="Enter question" />
                    <div className="flex gap-2 flex-col justify-between">
                        <Button variant="outline">Select Questions</Button>
                        <Button>Save Question</Button>
                    </div>
                </div>
            ):(
                <Button size="icon" variant="default" className="animate-in slide-in-from-bottom-10 absolute bottom-10 right-10 rounded-full" onClick={()=>setAddQuestionFormStatus(true)}><PlusIcon className="size-4" /></Button>
            )}
        </div>
    )
}

export default CreatePaperPage;