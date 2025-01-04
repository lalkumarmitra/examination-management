import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Loader2, Pencil, PlusCircle, Trash } from "lucide-react";
import { Examination } from "@/types/examination";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CreateExaminationDialog from "./create-examination-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose, DialogProps } from "@radix-ui/react-dialog";
import { useState } from "react";
import { admin_apis } from "@/lib/helpers/api_urls";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
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
                    <p className="text-sm text-muted-foreground line-clamp-2 my-2">{examination.description}</p>
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
                <ExaminationDeleteConfirmationDialog examination={examination}>
                    <Button variant="ghost" className="flex justify-start gap-2 w-full rounded-sm font-normal py-1 px-2 text-sm h-fit">
                        <Trash className="w-4 h-4" />
                        <span>Delete</span>
                    </Button>
                </ExaminationDeleteConfirmationDialog>
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

interface ExaminationDeleteConfirmationDialogProps extends DialogProps{
    examination:Examination;
}
const ExaminationDeleteConfirmationDialog = ({examination,children}:ExaminationDeleteConfirmationDialogProps)=>{
    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);
    const queryClient = useQueryClient();
    const handleDelete = ()=>{
        setLoading(true);
        admin_apis.examination.delete(examination.exam_code).then(()=>{
            setOpen(false);
            queryClient.invalidateQueries({queryKey:["examinations"]});
            toast.success("Examination deleted successfully");
        }).catch((err)=>toast.error("Failed to delete examination. "+err.response?.data?.message ?? "Something went wrong"))
        .finally(()=>setLoading(false));
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children ?? <Trash className="w-4 h-4" />}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Examination ?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete <span className="font-bold underline">{examination.name}</span>?
                    <p className="text-sm text-destructive font-semibold my-2">This action cannot be undone. All related papers will be deleted. Please check the details below.</p>
                    <h3 className="text-base font-bold uppercase">{examination.name}</h3>
                    <p className="text-sm text-muted-foreground my-2">Code: {examination.exam_code}</p>
                    <p className="text-sm text-muted-foreground my-2">Session: {examination.session}</p>
                    <p className="text-sm text-muted-foreground my-2">Fees: {examination.fees}/-</p>
                    <p className="text-sm text-muted-foreground my-2">Number of Papers: {examination.papers_count}</p>
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDelete} disabled={loading} variant="destructive">
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash className="w-4 h-4 mr-2" />}
                        <span>{loading ? "Deleting..." : "Delete"}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}