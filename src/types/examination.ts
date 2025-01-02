
export type Question = {
    id: string;
    school_code: string;
    question: string;
    course_id: string;
    subject: string;
    topic: string;
    difficulty: string;
    type: string;
    options?: string[] | null;
    answer?: string | null;
    explanation?: string | null;
}

export type Paper = {
    id: string;
    school_code: string;
    examination_id: string | number ;
    course_id: string | number;
    subject_code: string;
    sitting?: string;
    starts_at?: string;
    ends_at?: string;
    full_marks?: number;
    pass_marks?: number;
    description?: string | null;
    session?: string;
    examination: Examination;
    questions?: Question[];
}

export type Examination = {
    id: string;
    school_code: string;
    exam_code: string;
    name: string;
    fees: number;
    description: string | null;
    session: string;
    papers: any[];
    papers_count: number;
    start_date: string;
    end_date: string;
}