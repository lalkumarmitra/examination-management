import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Loader, Pen, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { eventCategoryApis } from '@/lib/helpers/api_urls'
import { MasterCategoryType } from '../events-category'
import { toast } from 'sonner'

interface NewCategoryModalProps {
    afterSave?: (e: MasterCategoryType) => void
    modalType?: "addnew" | "update"
    defaultData?: MasterCategoryType
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({ afterSave = () => null, defaultData, modalType }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const handler = (modalType === 'update') ? eventCategoryApis.update : eventCategoryApis.add;
        formData.append('type','event');
        handler(formData).then((res:any) => {
            setOpen(false);
            afterSave(res.data.category)
            toast.success(res.message);
        })
            .catch(e => toast.error(e.response?e.response.data.message:e.message))
            .finally(() => setLoading(false))
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {modalType === "update"
                    ? (<Button variant={'outline'} className='rounded size-6 p-0'><Pen className='size-3 inline' /></Button>)
                    : (<Button variant={'secondary'} ><Plus className='size-4' /></Button>)
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{modalType === "update" ? 'Update Category' : 'New Category'}</DialogTitle>
                </DialogHeader>
                <form className='mt-4' onSubmit={handleSaveCategory}>
                    <input type='hidden' value={defaultData?.id} name="category_id" />
                    <div className='w-full grid gap-3'>
                        <Label htmlFor='blog_category_name'>Category Name</Label>
                        <Input disabled={loading} id='blog_category_name' type='text' name='name' placeholder='Enter the category name' defaultValue={defaultData?.name} />
                        <p className='text-muted-foreground text-xs'>Enter your Category name and hit the {modalType === "update" ? 'update' : 'save'} button below .</p>
                    </div>
                    <DialogFooter className='mt-4'>
                        <Button
                            type='submit'
                            disabled={loading}
                            className='transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 min-w-[100px]'
                        >
                            {loading && (
                                <Loader className='w-4 h-4 animate-spin' />
                            )}
                            <span>{modalType === "update" ? 'Update' : 'Save'}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default NewCategoryModal