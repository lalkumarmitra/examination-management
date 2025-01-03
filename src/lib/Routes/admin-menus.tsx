
import CreatePaperPage from "@/pages/Authenticated/Admin/Examinations/create-paper-page";
import ExaminationPage from "@/pages/Authenticated/Admin/Examinations/Examination-page";
import { RouteType } from "@/types/route";
import { BookCopy } from "lucide-react";


const users = ['admin'];

export const AdminMenus: RouteType[] = [
    {
        isMenu: true,
        label: 'Examination',
        icon: BookCopy,
        path: "/examination",
        component: <ExaminationPage />,
        users: users,
        layout: 'main',
        middlewares: ['auth'],
    },
    {
        isMenu: false,
        path: "/examination/create-paper/:examinationId",
        component: <CreatePaperPage />,
        users: users,
        layout: 'main',
        middlewares: ['auth'],
    }
]