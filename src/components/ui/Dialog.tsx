"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type DialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </DialogPrimitive.Root>
    );
}

export function DialogTrigger({ children }: { children: ReactNode }) {
    return <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>;
}

export function DialogContent({ className, children, ...props }: { className?: string; children: ReactNode }) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
            <DialogPrimitive.Content
                className={cn(
                    "fixed left-[50%] top-[50%] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}

export function DialogTitle({ className, children, ...props }: { className?: string; children: ReactNode }) {
    return (
        <DialogPrimitive.Title
            className={cn("text-lg font-semibold", className)}
            {...props}
        >
            {children}
        </DialogPrimitive.Title>
    );
}

export function DialogFooter({ className, children, ...props }: { className?: string; children: ReactNode }) {
    return (
        <div className={cn("mt-4 flex justify-end space-x-2", className)} {...props}>
            {children}
        </div>
    );
}
