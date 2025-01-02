import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash } from "lucide-react";
import { Examination } from "@/types/examination";
import { MoreHorizontal } from "lucide-react";

const ExaminationCard = ({examination}:{examination:Examination})=>{
    return (
        <div className="border p-4 rounded-md">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{examination.name}</h2>
                <ExaminationCardActions examination={examination} />
            </div>
            <p className="text-sm text-gray-500">{examination.description}</p>
            {examination.papers_count > 0 ? (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Start Date: {examination.start_date}</p>
                    <p className="text-sm text-gray-500">End Date: {examination.end_date}</p>
                </div>
            ) : (
                <p className="text-sm text-gray-500">No papers found</p>
            )}
        </div>
    )
}
export default ExaminationCard;


const ExaminationCardActions = ({examination}:{examination:Examination})=>{
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={()=>{
                    console.log(examination);
                }}>
                    <Pencil className="w-4 h-4 mr-2" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Trash className="w-4 h-4 mr-2" />
                    <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    <span>View</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}