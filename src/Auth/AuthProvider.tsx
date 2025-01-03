import { auth } from "@/lib/helpers/api_urls";
import { UserType } from "@/types/user";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { removeAuthToken, setAuthToken } from "@/lib/helpers/cookie_helper";
import { useAppDispatch } from "@/redux/hooks";
import { hideLoader, showLoader } from "@/redux/Features/uiSlice";
import { ClientType, CourseType } from "@/types/client";


type AuthContext = {
    authToken?: string | null;
    user?: UserType | null;
    client?: ClientType | null;
    relatedCourse?: CourseType | null;
    handleLogin:(data:{email:string,password:string,client_code:number})=>void;
    handleLogout:()=>void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);
type AuthProviderProps = PropsWithChildren;
const AuthProvider =  ({children}:AuthProviderProps) => {
    const [token,setToken] = useState<string | null>();
    const [user,setUser] = useState<UserType | null>();
    const [client,setClient] = useState<ClientType | null>();
    const [relatedCourse,setRelatedCourse] = useState<CourseType | null>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(()=>{
        auth.validate().then((res:any)=>{
            setUser(res.data.user);
            setClient(res.data.client);
            setToken(Cookies.get('_token'));
            setRelatedCourse(res.data.course);
        }).catch(e=>{
            console.error(e);
            setUser(null);
            setClient(null);
            setToken(null);
        })
    },[])
    const handleLogin = ({email,password,client_code}:{email:string,password:string,client_code:number}) => {
        dispatch(showLoader('Logging in Please wait ...'));
        const formData = new FormData();
        formData.append('email',email);
        formData.append('password',password);
        formData.append('client_code',client_code.toString());
        auth.login(formData).then((res:any)=>{
            console.log(res);
            setUser(res.data.user);
            setClient(res.data.client);
            setToken(res._token);
            setAuthToken(res._token);
            setRelatedCourse(res.data.course);
        }).catch((e:any)=>console.log(e)).finally(()=>dispatch(hideLoader()));
    };
    const handleLogout = () => {
        dispatch(showLoader('Logging out Please wait ...'));
        auth.logout().then(():any=>{
            removeAuthToken();
            setUser(null);
            setClient(null);
            setToken(null);
            setRelatedCourse(null);
            navigate('/');
        }).catch(e=>console.log(e)).finally(()=>dispatch(hideLoader()));
    }
    return <AuthContext.Provider value={{authToken:token, user,client,relatedCourse,handleLogin,handleLogout}}>{children}</AuthContext.Provider>
}
export default AuthProvider;
export const useAuth = () => {
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("useAuth Hook must be used inside AuthProvider")
    }
    return context
}