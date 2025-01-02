import { BookCopy, Building2, HandHelping, Home } from 'lucide-react';
import _404 from '@/pages/Error/404';
import { RouteType } from '@/types/route';
import LandingPage from '@/pages/Public/LandingPage/Index';
import { Dashboard } from '@/pages/Authenticated/DashboardPage';
import { AdminMenus } from './admin-menus';
import { community_menus } from './community-menus';
import { students_menus } from './students-menus';





export const routes: RouteType[] = [
	{
		isMenu: true,
		icon: Home,
		label: 'Dashboard',
		path: "/dashboard",
		component: <Dashboard />,
		middlewares: ['auth'],
		layout: 'main',
		users: ['admin','community','student','teacher'],
	},
	...AdminMenus,
	...community_menus,
	...students_menus,

	// Public Routes
	{
		isMenu: true,
		label: 'Home',
		icon: BookCopy,
		path: "/",
		component: <LandingPage />,
		layout: 'public',
		middlewares: ['guest'],
	},
	{
		isMenu: true,
		label: 'Privacy Policy',
		icon: Building2,
		path: "/privacy-policy",
		component: <LandingPage />,
		layout: 'public',
		middlewares: ['guest'],
	},
	{
		isMenu: true,
		label: 'Services',
		icon: HandHelping,
		path: "/services",
		component: <LandingPage />,
		layout: 'public',
		middlewares: ['guest'],
	},


	{
		path: "*",
		isMenu: false,
		component: <_404 />,
		layout: 'error',
	}
];



