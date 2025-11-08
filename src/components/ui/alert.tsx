import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "warning"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "border-border bg-surface",
    success: "border-success/30 bg-success/10",
    error: "border-error/30 bg-error/10",
    warning: "border-warning/30 bg-warning/10",
  }

  return <div ref={ref} className={`rounded-lg border p-4 ${variantStyles[variant]} ${className || ""}`} {...props} />
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={`font-medium leading-none tracking-tight ${className || ""}`} {...props} />
  ),
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`text-sm [&_p]:leading-relaxed mt-2 ${className || ""}`} {...props} />
  ),
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
