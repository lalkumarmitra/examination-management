import { useAuth } from "@/Auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRoundIcon } from "lucide-react"
import { PropsWithChildren } from "react"
import { Link } from "react-router-dom"

interface LoginFormDialogProps extends PropsWithChildren {
    
}

const LoginFormDialog: React.FC<LoginFormDialogProps> = ({children}) => {
    const {handleLogin} = useAuth();
    const handleLoginFormSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const client_code = formData.get('client_code') as string;
        handleLogin({email,password,client_code:parseInt(client_code)});
    }
    return (
        <Dialog>
            <DialogTrigger>
                {children ?? (
                    <Button size="lg" className="mr-4">Log In</Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log In</DialogTitle>
                    <DialogDescription>Log in to your account to continue.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLoginFormSubmit}>
                    <input type="hidden" name="client_code" value={1113} />
                    <div className="flex justify-center">
                        <span className="border border-gray-300 rounded-full p-2">
                            <UserRoundIcon className="h-10 w-10" />
                        </span>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" name="email" placeholder="Email" required />
                            <p className="text-sm text-muted-foreground">Enter your email which you used to login to https://skicst.org</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" name="password" placeholder="Password" required />
                            <p className="text-sm text-muted-foreground">Forgot password? <Link to="/forgot-password">Reset Password</Link></p>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit">Log In</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default LoginFormDialog