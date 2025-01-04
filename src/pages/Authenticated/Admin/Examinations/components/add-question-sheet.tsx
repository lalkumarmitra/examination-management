import { CustomSelect } from "@/components/Custom/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { question_difficulty, question_types } from "@/lib/constants";
import { admin_apis } from "@/lib/helpers/api_urls";
import Swal from "sweetalert2";
import { CourseType } from "@/types/client";
import { Examination } from "@/types/examination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
interface AddQuestionSheetProps {
  examination?: Examination;
  course?: CourseType;
  subject?: string;
  disabled?: boolean;
}

const AddQuestionSheet = ({ examination, course, subject, disabled = false }: AddQuestionSheetProps) => {
  const [open, setOpen] = useState(false);
  const [questionType, setQuestionType] = useState<string>("multiple_choice");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => admin_apis.question.create(formData),
    onSuccess: (res) => {
      queryClient.setQueryData(["question"], (oldData: any) => {
        if (!oldData?.data?.questions) {
          return { ...oldData, data: { ...oldData?.data, questions: [res.data.question] } };
        }
        return {
          ...oldData,
          data: { ...oldData.data, questions: [res.data.question, ...oldData.data.questions] },
        };
      });
      Swal.fire("Success", res.message, "success");
      setOpen(false);
    },
    onError: (err: any) => {
        Swal.fire("Error", err.response ? err.response.data.message : err.message, "error");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    mutation.mutate(formData)
  };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button 
                    disabled={disabled}
                    size="icon" 
                    variant="default" 
                    className="animate-in slide-in-from-bottom-10 absolute bottom-10 right-10 rounded-full"
                >
                    <PlusIcon className="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="">
                <SheetHeader>
                    <SheetTitle>{examination?.name || 'Create a new question'}</SheetTitle>
                    <SheetDescription>{examination ? 'Add a question to the examination' : 'Fill up the form to create a new question'}</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="course_id" value={course?.id} />
                    <input type="hidden" name="subject" value={subject} />
                    <div className="grid gap-4 py-4 h-[calc(100svh-10rem)] overflow-y-auto px-2">
                        <div className="grid gap-4 grid-cols-2 h-fit">
                            <div className="grid gap-2">
                                <Label>Course</Label>
                                <Input value={course?.name} disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label>Subject</Label>
                                <Input value={subject} disabled />
                            </div>
                            <div className="grid gap-2 col-span-2">
                                <Label>Topic / Chapter</Label>
                                <Input name="topic" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Question Type</Label>
                                <CustomSelect 
                                    defaultValue="multiple_choice" 
                                    options={Object.entries(question_types).map(([key,value])=>({label:key,value}))} 
                                    onValueChange={(value)=>setQuestionType(value)}
                                    name="type"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Question Difficulty</Label>
                                <CustomSelect 
                                    defaultValue="medium" 
                                    options={Object.entries(question_difficulty).map(([key,value])=>({label:key,value}))} 
                                    name="difficulty"
                                />
                            </div>
                            <div className="grid gap-2 col-span-2">
                                <Label>Question</Label>
                                <Textarea name="question" placeholder="Question" />
                            </div>
                            {questionType === 'multiple_choice' && (
                                <>
                                    <Input name="option[]" placeholder="Option 1/A" />
                                    <Input name="option[]" placeholder="Option 2/B" />
                                    <Input name="option[]" placeholder="Option 3/C" />
                                    <Input name="option[]" placeholder="Option 4/D" />
                                    <div className="grid gap-2 col-span-2 h-fit">
                                        <Label>Answer</Label>
                                        <Input name="answer" placeholder="Answer" />
                                    </div>
                                </>
                            )}
                            {questionType === 'true_false' && (
                                <div className="grid gap-2 col-span-2">
                                    <Label>Answer</Label>
                                    <CustomSelect 
                                        defaultValue="true" 
                                        options={[{label:'True',value:'true'},{label:'False',value:'false'}]} 
                                        name="answer"
                                    />
                                </div>
                            )}
                            {questionType === 'short_answer' && (
                                <div className="grid gap-2 col-span-2 h-fit">
                                    <Label>Answer</Label>
                                    <Input name="answer" placeholder="Answer" />
                                </div>
                            )}
                        </div>
                    </div>
                    <SheetFooter className="absolute bottom-0 left-0 w-full p-4">
                        <Button type="submit">Add Question</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default AddQuestionSheet