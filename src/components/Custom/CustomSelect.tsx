import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SelectOptionType = {
    label:string | undefined | number
    value: string | number | boolean | null
}
interface CustomSelectProps extends React.ComponentPropsWithoutRef<typeof Select>{
    options?: SelectOptionType[],
    placeholder?:string,
    id?:string,
    className?:string,
}

export const CustomSelect: React.FC<CustomSelectProps> = ({options=[],placeholder="Select An Option",id="select", className, ...props}) => {
    return (
        <Select {...props}>
            <SelectTrigger className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder}  />
            </SelectTrigger>
            <SelectContent >
                {options.map((o,i)=>(
                    <SelectItem key={i} id={id} value={o.value?.toString() as string}>{o.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
