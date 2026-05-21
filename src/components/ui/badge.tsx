import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-stone-200 text-stone-800",
        variant === "success" && "bg-sage/20 text-sage-dark",
        variant === "warning" && "bg-terracotta/20 text-terracotta-dark",
        variant === "danger" && "bg-red-100 text-red-700",
        variant === "outline" && "border border-stone-300 text-stone-600",
        className
      )}
      {...props}
    />
  );
}
