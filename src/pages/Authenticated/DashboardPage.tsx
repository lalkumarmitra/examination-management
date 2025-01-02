import { useAppDispatch } from "@/redux/hooks"
import { setBreadcrumb } from "@/redux/Features/uiSlice"
import { useEffect } from "react"
import { useAuth } from "@/Auth/AuthProvider";
import { LandingPageSkeleton } from "../Public/LandingPage/Index";
import { admins, managers, participators } from "@/lib/utils";



export const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setBreadcrumb([{ label: 'Dashboard', type: 'page' }]))
    }, []);
    const {user} = useAuth();

    if(user === undefined) return <LandingPageSkeleton />
    if ( user?.role_type === undefined) return (
        <div className="w-full text-center">
            <h1> Something went </h1>
            <p>Please contact support</p>
        </div>
    )
    if(admins.includes(user?.role_type?.toLowerCase())) return <h1>Role based Dashboard (admin)</h1>
    if(managers.includes(user?.role_type?.toLowerCase())) return <h1>Role based Dashboard (manager)</h1>
    if(participators.includes(user?.role_type?.toLowerCase())) return <h1>Role based Dashboard (participators etc...)</h1>
    return (
        <div className="w-full text-center my-8 text-red-600">
            <h1> {user?.role_type} users do not have access to dashboard </h1>
            <p>Please contact support</p>
        </div>
    )
}
