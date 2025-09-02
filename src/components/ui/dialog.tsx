import * as React from "react"

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({ children, open = false, onOpenChange }: DialogProps) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onOpenChange) {
      onOpenChange(false);
    }
  };

  return <div onClick={handleBackdropClick}>{children}</div>;
};

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = ({ children, asChild, ...props }: DialogTriggerProps) => (
  asChild ? <>{children}</> : <button {...props}>{children}</button>
)

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

const DialogContent = ({ children, className = "" }: DialogContentProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className={`bg-white rounded-lg p-6 max-w-md w-full ${className}`}>
      {children}
    </div>
  </div>
)

const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>
const DialogFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex justify-end gap-2 mt-4 ${className}`}>{children}</div>
)
const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold">{children}</h2>
const DialogDescription = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-gray-600">{children}</p>

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
