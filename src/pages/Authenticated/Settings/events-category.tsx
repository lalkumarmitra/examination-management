import SettingSideLinks from '@/components/Custom/SideLinks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { eventCategoryApis } from '@/lib/helpers/api_urls'
import { setBreadcrumb } from '@/redux/Features/uiSlice'
import { useAppDispatch } from '@/redux/hooks'
import { ChevronLeft, Search, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import NewCategoryModal from './Modals/NewCategoryModal'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export type MasterCategoryType = {
    id: number,
    name: string,
    value:string,
    type:string,
}
const EventsCategoryManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const [categories, setCategories] = useState<MasterCategoryType[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    useEffect(() => {
        setCategoriesLoading(true);
        dispatch(setBreadcrumb([
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Settings', link: '/settings' },
            { label: 'Event Category', type: 'page' }
        ]));
        eventCategoryApis.list().then(res => setCategories(res.data.category))
            .catch(err => console.log(err.response ? err.response.data.message : err.message))
            .finally(() => setCategoriesLoading(false))
    }, []);
    const handleCategoryDelete = (id: number) => {
        setCategoriesLoading(true);
        toast.promise(
            eventCategoryApis.delete(id),
            {
                loading:'Deleting Event category',
                success: (res:any) => {
                    setCategories(state => state.filter(s => s.id !== id))
                    return res.message;
                },
                error: (e:any)=> e.response?e.response.data.message:e.message,
                finally:()=>setCategoriesLoading(false),
                cancel:{
                    label: 'Close',
                    onClick: () => console.log('Cancel!'),
                }
            }
        );
    }
    const handleAfterSaveNewCategory = (category: MasterCategoryType) => setCategories(state => [category, ...state]);
    const handleAfterUpdateCategory = (category: MasterCategoryType) => setCategories(state => state.map(s => s.id === category.id ? category : s));
    return (
        <div className='px-6 pt-6'>
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-4 items-center">
                    <Button onClick={handleGoBack} variant={'outline'} size={'icon'}><ChevronLeft className='size-4' /></Button>
                    <h1 className='font-bold capitalize'>Category Settings</h1>
                </div>
                <div className="grid grid-cols-2 gap-4">

                </div>
            </div>
            <main className="grid flex-1 items-start gap-4 p-4 mt-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4" >
                <SettingSideLinks />
                <div className="grid gap-4 lg:col-span-3 lg:relative">
                    <Card x-chunk="dashboard-04-chunk-1" className='max-h-screen'>
                        {categoriesLoading && (
                            <div className='flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 z-10 bg-muted/50'>
                                <lord-icon
                                    src="https://cdn.lordicon.com/rqptwppx.json"
                                    trigger="loop"
                                    state="loop-cycle"
                                    colors="primary:#fafafa,secondary:#171717"
                                    style={{ width: '150px', height: '150px' }}
                                >
                                </lord-icon>
                                <h1 className='absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2'>Loading</h1>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className='mb-2'>Your Event Categories</CardTitle>
                            <CardDescription>
                                Event Category settings. These are the categories which appears in the drop-down of Event-category when creating a new Event post.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='relative'>
                            <div className="relative flex md:grow-0">
                                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    type="search"
                                    placeholder="Search"
                                    className="w-full rounded-lg bg-background pl-8 me-3"
                                />
                                <NewCategoryModal afterSave={handleAfterSaveNewCategory} />
                            </div>
                            <ul className='mt-4'>
                                {categories?.filter((b: any) => b.name.toLowerCase().includes(searchText.toLowerCase())).map((blc: any, i: number) => (
                                    <li key={i} className="flex justify-between text-foreground bg-muted/20 hover:bg-muted/30 px-2 py-3 rounded mb-3" >
                                        <p className='ps-2'>{blc?.name}</p>
                                        <div className="">
                                            <Button onClick={() => handleCategoryDelete(blc.id)} variant={'destructive'} className='rounded size-6 p-0 me-2 hover:bg-destructive/50'><Trash className='size-3 inline' /></Button>
                                            <NewCategoryModal afterSave={handleAfterUpdateCategory} modalType='update' defaultData={blc} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default EventsCategoryManager