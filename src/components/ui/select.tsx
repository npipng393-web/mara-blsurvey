import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

const SelectContent = ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ className, ...props }, ref) => (
    <option
      ref={ref}
      className={cn("px-2 py-1", className)}
      {...props}
    />
  )
)
SelectItem.displayName = "SelectItem"

const SelectTrigger = Select
const SelectValue = ({ placeholder, ...props }: { placeholder?: string } & React.HTMLProps<HTMLDivElement>) => (
  <div {...props}>{placeholder}</div>
)

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
