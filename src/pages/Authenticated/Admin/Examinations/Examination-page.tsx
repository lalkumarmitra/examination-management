import CreateExaminationDialog from "./components/create-examination-dialog";
import { admin_apis } from "@/lib/helpers/api_urls";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Examination } from "@/types/examination";
import ExaminationCard from "./components/examination-card";
import { useEffect } from "react";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useDispatch } from "react-redux";

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
            {isLoading && <div className="flex justify-center items-center h-screen"><Loader2 className="w-4 h-4 animate-spin" /></div>}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data?.map((examination)=>(
                    <ExaminationCard examination={examination} />
                ))}
            </div>
        </div>
    )
}

export default ExaminationPage