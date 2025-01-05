import { CustomSelect } from "@/components/Custom/CustomSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subjects as subjects_list } from "@/lib/constants";
import { admin_apis } from "@/lib/helpers/api_urls";
import { CourseType } from "@/types/client";
import { QuestionType } from "@/types/examination";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusIcon, TableIcon } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";

interface ChooseQuestionDialogProps extends PropsWithChildren{
    disabled?:boolean
    course?:CourseType
    subject?:string
}

const ChooseQuestionDialog = ({disabled=false,course,subject}:ChooseQuestionDialogProps)=>{
    const [open,setOpen] = useState(false);
    const [selectedCourse,setSelectedCourse] = useState<CourseType | null>(course || null);
    const [selectedSubject,setSelectedSubject] = useState<string | null>(subject || null);
    const [topic,setTopic] = useState<string | null>(null);
    
    const {data:course_list=[],isLoading:coursesLoading} = useQuery<CourseType[]>({
        queryKey:['courses'],
        queryFn:()=>admin_apis.courseList(),
        select:(data:any)=>data.data.course_list,
        staleTime:1000*60*5,
        gcTime:1000*60*5,
    });
    const { data: questions=[], isLoading: questionsLoading } = useQuery<QuestionType[]>({
        queryKey: ['questions', selectedCourse?.id, selectedSubject],
        queryFn: () => {
            const formData = new FormData();
            formData.append('course_id', selectedCourse?.id.toString() || '');
            formData.append('subject', selectedSubject || '');
            return admin_apis.question.search(formData);
        },
        select: (data: any) => data.data.questions,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        enabled: !!selectedCourse && !!selectedSubject, // Runs query only if conditions are met
    });
    useEffect(()=>{
        if(selectedCourse && selectedSubject){
            setTopic(null);
        }
    },[selectedCourse,selectedSubject]);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    disabled={disabled}
                    size="icon" 
                    variant="default" 
                    className="animate-in slide-in-from-bottom-10 absolute bottom-24 right-10 rounded-full"
                >
                    <TableIcon className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Choose Question</DialogTitle>
                    <DialogDescription>Choose a question from the list</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 grid-cols-3">
                    <div className="grid gap-2">
                        <Label>Choose a class/Course <span className="text-red-500">*</span></Label>
                        <CustomSelect 
                            disabled={coursesLoading} 
                            className="w-48"
                            defaultValue={course?.id.toString()}
                            onValueChange={(value)=>setSelectedCourse(course_list?.find((course:CourseType)=>course.id.toString()===value) || null)} 
                            options={course_list?.map((course:CourseType)=>({label:course.name,value:course.id.toString()}))} 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Choose a subject <span className="text-red-500">*</span></Label>
                        <CustomSelect 
                            disabled={!course && (selectedCourse === null)} 
                            className="w-48"
                            defaultValue={subject}
                            onValueChange={(value)=>setSelectedSubject(value)} 
                            options={Object.entries(subjects_list).map(([key])=>({label:key,value:key}))} 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Chapter / Topic</Label>
                        <Input 
                            disabled={(!subject)&&(selectedSubject === null)} 
                            placeholder="Chapter / Topic" 
                            value={topic || ''} 
                            onChange={(e)=>setTopic(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="grid gap-4">
                    {questionsLoading ? (
                        <div className="flex justify-center items-center border p-2 shadow-sm min-h-80 overflow-y-auto">
                            <Loader2 className="size-8 animate-spin" />
                        </div>
                    ):(
                        <div className="grid gap-2 rounded-md border p-2 shadow-sm min-h-80 overflow-y-auto">
                            {(selectedCourse && selectedSubject && !questions?.length) ? (
                                <div className="flex justify-center items-center">
                                    <p className="text-sm text-gray-500">No questions found</p>
                                </div>
                            ):(
                                <ul className="">
                                    {questions?.filter(q=>{
                                        if(!topic) return true;
                                        return q.topic.toLowerCase().includes(topic.toLowerCase())
                                    }).map((question:QuestionType)=>(
                                        <li key={question.id} className="mb-2 flex items-center justify-between shadow-sm py-2 px-4">
                                            <p className="flex justify-start items-start gap-2"><Checkbox />{question.question}</p>
                                            <p className="text-muted-foreground text-xs capitalize" >{question.topic}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button> <PlusIcon className="size-4" /> Add Selected Questions</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChooseQuestionDialog;