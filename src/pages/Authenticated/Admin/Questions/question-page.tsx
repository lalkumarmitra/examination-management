import { CustomSelect } from "@/components/Custom/CustomSelect";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { subjects } from "@/lib/constants";
import { admin_apis } from "@/lib/helpers/api_urls";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { CourseType } from "@/types/client";
import { QuestionType } from "@/types/examination";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddQuestionSheet from "../Examinations/components/add-question-sheet";

const QuestionPage = () => {
    const dispatch = useDispatch();
    const [selectedCourse,setSelectedCourse] = useState<CourseType>();
    const [selectedSubject,setSelectedSubject] = useState<string>('');
    useEffect(()=>{
        dispatch(setBreadcrumb([
            {label:'Dashboard',link:'/dashboard'},
            {label:'Questions Bank',type:'page'},
        ]));
    },[dispatch]);
    const {data:courses,isLoading:coursesLoading} = useQuery<CourseType[]>({
        queryKey:['courses'],
        queryFn:()=>admin_apis.courseList(),
        select:(data:any)=>data.data.course_list,
        staleTime:1000*60*5,
        gcTime:1000*60*5,
    });
    const { data: questions, isLoading: questionsLoading } = useQuery<QuestionType[]>({
        queryKey: ['questions', selectedCourse?.id, selectedSubject],
        queryFn: () => {
            const formData = new FormData();
            formData.append('course_id', selectedCourse?.id.toString() || '');
            formData.append('subject', selectedSubject || '');
            return admin_apis.question.search(formData);
        },
        select: (data: any) => data.data.question,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        enabled: !!selectedCourse && !!selectedSubject,
    });
    return (
        <div className="px-4 md:px-12 py-4">
            <div className="grid md:flex gap-4 justify-end items-center">
                <div className="grid gap-2">
                    <Label>Choose a class/Course <span className="text-red-500">*</span></Label>
                    <CustomSelect 
                        placeholder={coursesLoading?'please wait ...':'Select a course'}
                        onValueChange={(value)=>setSelectedCourse(courses?.find((course:CourseType)=>course.id.toString()===value) || undefined)} 
                        disabled={coursesLoading} 
                        options={courses?.map((course:CourseType)=>({label:course.name,value:course.id.toString()}))} 
                        className="w-48"
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Choose a subject <span className="text-red-500">*</span></Label>
                    <CustomSelect 
                        placeholder={selectedCourse?'Select a subject':'Select a course first'}
                        disabled={!selectedCourse} 
                        onValueChange={(value)=>setSelectedSubject(value)} 
                        options={Object.entries(subjects).map(([key])=>({label:key,value:key}))} 
                        className="w-48"
                    />
                </div>
            </div>
            <div className="grid gap-4">
                {questionsLoading && <Skeleton className="h-[200px]" />}
                {questions?.map((question)=>(
                    <p>{question.question}</p>
                ))}
            </div>
            <AddQuestionSheet course={selectedCourse} subject={selectedSubject} disabled={!selectedCourse || !selectedSubject} />
        </div>
    )
}

export default QuestionPage;