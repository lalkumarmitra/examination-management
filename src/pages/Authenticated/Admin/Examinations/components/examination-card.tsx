import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Pencil, PlusCircle, Trash } from "lucide-react";
import { Examination } from "@/types/examination";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CreateExaminationDialog from "./create-examination-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const ExaminationCard = ({examination}:{examination:Examination})=>{
    return (
        
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg font-bold uppercase">{examination.name}</CardTitle>
                    <ExaminationCardActions examination={examination} />
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold uppercase text-muted-foreground">{examination.exam_code} - ({examination.session})</h3>
                        <p className="text-sm text-amber-600">Fees: {examination.fees}/-</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 my-2">{examination.description}</p>
                </CardContent>
                <CardFooter className="flex flex-row justify-between items-center">
                    {examination.papers_count ? (
                        <>
                            <p className="text-sm text-gray-500">Start Date: 20/23/2024{examination.start_date}</p>
                            <p className="text-sm text-gray-500">End Date: 12/01/2025{examination.end_date}</p>
                        </>
                    ) : (
                        <p className="text-sm text-center font-semibold capitalize w-full text-gray-500">No papers found</p>
                    )}
                </CardFooter>
            </Card>
            
    )
}
export default ExaminationCard;


const ExaminationCardActions = ({examination}:{examination:Examination})=>{
    const navigate = useNavigate();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <CreateExaminationDialog examination={examination} >
                    <Button variant="ghost" className="flex justify-start gap-2 w-full rounded-sm font-normal py-1 px-2 text-sm h-fit">
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                    </Button>
                </CreateExaminationDialog>
                <DropdownMenuItem>
                    <Trash className="w-4 h-4 mr-2" />
                    <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>navigate(`/examination/create-paper/${examination.id}`)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    <span>Add Paper</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}