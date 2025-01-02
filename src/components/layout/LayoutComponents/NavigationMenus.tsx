import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard, Menu } from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from '@/assets/logo_sm_transparent.png'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useAuth } from "@/Auth/AuthProvider";
import { RouteType } from "@/types/route";
import { routes } from "@/lib/Routes";
import LoginFormDialog from "@/pages/Public/login-form-dialog";


export const generateTooltipRoute: React.FC<RouteType> = (route, index) => {
    const Icon = route.icon;
    return route.isMenu && (
        <Tooltip key={index}>
            <TooltipTrigger>
                <NavLink
                    to={route.path}
                    className={({ isActive }) => `flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className="sr-only">{route.label}</span>
                </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">{route.label}</TooltipContent>
        </Tooltip>
    )
}

export const VerticalCompactSideBar: React.FC<{ type?: string }> = () => {
    const { user } = useAuth();
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link to={'/'} className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                    <img src={logo} className="w-56 aspect-square object-contain dark:invert" />
                    <span className="sr-only">Fittestwarrior</span>
                </Link>
                {
                    routes.filter(r => r.users ? (user?.role_type && r.users.includes(user?.role_type.toLowerCase())) : true)
                        .filter(r => r.isMenu && r.middlewares?.includes('auth'))
                        .map((r, i) => generateTooltipRoute(r, i))
                }
            </nav>
            {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <Tooltip>
                    <TooltipTrigger>
                        <NavLink
                            to={'/settings'}
                            className={({ isActive }) => `flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav> */}
        </aside>
    )
}


export const VerticalFullSideBar: React.FC<{ type?: string }> = ({ type }) => {
    const { user, authToken } = useAuth();
    const generateNavLink = (route: RouteType, index?: number) => {
        const RouteIcon = route.icon;
        return route.isMenu && (
            <NavLink
                key={index}
                to={route.path}
                className={({ isActive }) => `flex items-center gap-4 px-2.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
            >
                {RouteIcon && <RouteIcon className="size-5" />}
                {route.label}
            </NavLink>
        )
    }
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <DialogTitle className="invisible"></DialogTitle>
                <SheetContent side="left" className="sm:max-w-xs">
                    {type === 'public' ? (
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link to={'/'} className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base">
                                <img src={logo} className={`w-[62px] aspect-square object-contain dark:invert`} />
                            </Link>
                            {routes.filter(r => r.isMenu && (r.middlewares?.includes('public') || r.middlewares?.includes('guest'))).map((route: RouteType, index: number) => generateNavLink(route, index))}
                            {authToken !== null ? generateNavLink({
                                isMenu: true,
                                component: <LayoutDashboard />,
                                icon: LayoutDashboard,
                                label: 'Dashboard',
                                path: '/dashboard',
                            }, 0) : (
                                <LoginFormDialog />
                            )}
                        </nav>
                    ) : (
                        <div className="flex flex-col h-full justify-between">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link to={'/'}
                                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
                                >
                                    <img src={logo} className={`w-[62px] aspect-square object-contain dark:invert`} />
                                </Link>
                                {
                                    routes.filter(r => r.users ? (user?.role_type && r.users.includes(user?.role_type.toLowerCase())) : true)
                                        .filter(r => r.isMenu && r.middlewares?.includes('auth'))
                                        .map((r, i) => generateNavLink(r, i))
                                }

                            </nav>
                            {/* <NavLink
                                to={'/settings'}
                                className={({ isActive }) => `flex items-center gap-4 px-2.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
                            >
                                <Cog className="h-5 w-5" />
                                Settings
                            </NavLink> */}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export const HorizontalNavigation: React.FC<{ type?: string }> = ({ type }) => {
    const { authToken, user } = useAuth();
    return type === 'public' || type === 'guest' ? (
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link to={'/'} className="w-12 overflow-hidden">
                <img src={logo} className={`w-full aspect-square object-contain dark:invert`} alt={type} />
            </Link>
            {routes.filter(r => r.isMenu && (r.middlewares?.includes('public') || r.middlewares?.includes('guest'))).map((route, index) => (
                <NavLink
                    key={index}
                    to={route.path}
                    className={({ isActive }) => `${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground whitespace-nowrap`}
                >
                    {route.label}
                </NavLink>
            ))}
            {authToken !== null ? (
                <NavLink
                    to={'/dashboard'}
                    className={({ isActive }) => `${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground whitespace-nowrap`}
                >
                    Dashboard
                </NavLink>
            ) : (
                <LoginFormDialog>
                    <Button size="sm" variant={'link'} className="text-muted-foreground hover:text-foreground">Log In</Button>
                </LoginFormDialog>
            )}
        </nav>
    ) : (
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link to={'/'} className="w-12 overflow-hidden">
                <img src={logo} className={`w-full aspect-square object-contain dark:invert`} alt={type} />
            </Link>
            {routes
            .filter(r => r.users ? (user?.role_type && r.users.includes(user?.role_type.toLowerCase())) : true)
            .filter(r => r.isMenu && r.middlewares?.includes('auth')).map((route, index) => (
                <NavLink
                    key={index}
                    to={route.path}
                    className={({ isActive }) => `${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground whitespace-nowrap`}
                >
                    {route.label}
                </NavLink>
            ))}
            {/* <NavLink
                to={'/settings'}
                className={({ isActive }) => `${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground whitespace-nowrap`}
            >
                Settings
            </NavLink> */}
        </nav>
    );
}