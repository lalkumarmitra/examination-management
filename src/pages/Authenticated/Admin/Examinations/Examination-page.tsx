import CreateExaminationDialog from "./components/create-examination-dialog";
import { admin_apis } from "@/lib/helpers/api_urls";
import { useQuery } from "@tanstack/react-query";
import { Examination } from "@/types/examination";
import ExaminationCard from "./components/examination-card";
import { useEffect } from "react";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

const ExaminationPage = () => {
    const dispatch = useDispatch();
    const {data,isLoading} = useQuery<Examination[]>({
        queryKey:['examinations'],
        queryFn:()=>admin_apis.examination.read(),
        select:(data:any)=>data.data.examination,
        staleTime:1000*60*5,
        gcTime:1000*60*5,
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([
            {label:'Dashboard',link:'/dashboard'},
            {label:'Examination',type:'page'}
        ]))
    },[])
    return (
        <div className="px-4 md:px-12 py-4">
            <div className="flex gap-2 justify-end items-center mb-4">
                <CreateExaminationDialog />
            </div>
            {isLoading && <ExaminationPageSkeleton />}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data?.map((examination)=>(
                    <ExaminationCard examination={examination} />
                ))}
            </div>
        </div>
    )
}

export default ExaminationPage

const ExaminationPageSkeleton = ()=>{
    return <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({length:6}).map((_,index)=>(
            <Skeleton key={index} className="h-[200px]" />
        ))}
    </div>
}