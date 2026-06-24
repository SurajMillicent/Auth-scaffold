import { cn } from "@/utils/cn";

interface AlertProps {
  type: "error" | "success" | "info";
  message: string;
  className?: string;
}

const styles = {
  error: "bg-red-50 border-red-300 text-red-700",
  success: "bg-green-50 border-green-300 text-green-700",
  info: "bg-blue-50 border-blue-300 text-blue-700",
};

export function Alert({ type, message, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "px-4 py-3 rounded-lg border text-sm",
        styles[type],
        className
      )}
    >
      {message}
    </div>
  );
}
