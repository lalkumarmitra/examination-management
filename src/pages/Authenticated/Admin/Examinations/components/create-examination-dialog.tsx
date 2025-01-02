import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { admin_apis } from "@/lib/helpers/api_urls";
import { useMutation } from "@tanstack/react-query";
import { PlusCircle, SendHorizonal } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { toast } from "sonner";

interface CreateExaminationDialogProps extends PropsWithChildren {
    
}

const CreateExaminationDialog:React.FC<CreateExaminationDialogProps> = ({children}) => {
    const [open, setOpen] = useState(false);
    const {mutate,isPending} = useMutation({
        mutationFn:(data:FormData)=>admin_apis.examination.create(data),
        onSuccess:()=>{
            toast.success("Examination created successfully");
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
                    <DialogTitle>Create Examination</DialogTitle>
                    <DialogDescription>Fill up the form to create a new examination. Fields marked with <span className="text-red-500">*</span> are required fields.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                            <Input id="name" name="name" placeholder="Enter the name of the examination" />
                        </div>
                        <div className="grid gap-2 col-span-1">
                            <Label htmlFor="exam_code">Exam Code <span className="text-red-500">*</span></Label>
                            <Input id="exam_code" name="exam_code" placeholder="Enter exam code eg:sa1, fa1, etc." />
                        </div>
                        <div className="grid gap-2 col-span-1">
                            <Label htmlFor="fees">Fees <span className="text-red-500">*</span></Label>
                            <Input id="fees" name="fees" placeholder="Enter the fees" />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Enter the description of the examination" />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit">Create <SendHorizonal className="w-4 h-4 ml-2" /></Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateExaminationDialog