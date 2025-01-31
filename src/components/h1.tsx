import { cn } from "@/lib/utils";

export default function H1({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1 className={cn("font-medium text-2xl leading-6", className)}>
      {children}
    </h1>
  );
}
