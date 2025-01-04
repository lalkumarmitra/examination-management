import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { admin_apis } from "@/lib/helpers/api_urls";
import { Examination } from "@/types/examination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, SendHorizonal } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { toast } from "sonner";

interface CreateExaminationDialogProps extends PropsWithChildren {
    examination?: Examination;
}

const CreateExaminationDialog:React.FC<CreateExaminationDialogProps> = ({children,examination}) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const {mutate,isPending} = useMutation({
        mutationFn:(data:FormData)=>examination?.id ? admin_apis.examination.update(data) : admin_apis.examination.create(data),
        onSuccess:(response:any)=>{
            queryClient.invalidateQueries({queryKey:['examinations']});
            toast.success(response.message);
            setOpen(false);
        },
        onError:(error:any)=>toast.error(error.response?.data?.message || error.message)
    })

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        mutate(formData);
    }

    return (
        <Dialog open={isPending?true:open} onOpenChange={setOpen}>
            <DialogTrigger>
                {children ?? <Button><PlusCircle className="w-4 h-4" />Create Examination</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{examination ? "Update Examination" : "Create Examination"}</DialogTitle>
                    <DialogDescription>
                        Fill up the form to {examination ? "update examination" : "create a new examination"} . Fields marked with 
                        <span className="text-red-500">*</span> are required fields.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    {examination?.exam_code && <input type="hidden" name="exam_code" value={examination.exam_code} />}
                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                            <Input id="name" name="name" placeholder="Enter the name of the examination" defaultValue={examination?.name} />
                        </div>
                        <div className="grid gap-2 col-span-1">
                            <Label htmlFor="exam_code">Exam Code <span className="text-red-500">*</span></Label>
                            <Input id="exam_code" name="exam_code" placeholder="Enter exam code eg:sa1, fa1, etc." defaultValue={examination?.exam_code} />
                        </div>
                        <div className="grid gap-2 col-span-1">
                            <Label htmlFor="fees">Fees <span className="text-red-500">*</span></Label>
                            <Input id="fees" name="fees" placeholder="Enter the fees" defaultValue={examination?.fees} />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Enter the description of the examination" defaultValue={examination?.description} />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {examination ? "Update" : "Create"} <SendHorizonal className="w-4 h-4 ml-2" />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateExaminationDialog