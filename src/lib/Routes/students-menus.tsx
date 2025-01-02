import ExaminationPaper from "@/pages/Authenticated/Students/examination-paper";
import { RouteType } from "@/types/route";
import { BookOpen } from "lucide-react";

const users = ['student'];


export const students_menus: RouteType[] = [
    {
        isMenu: false,
        label: 'Examination Paper',
        icon: BookOpen,
        path: "/examination-paper/:paperId",
        component: <ExaminationPaper />,
        middlewares: ['auth'],
        layout: 'main',
        users: users,
    }
]