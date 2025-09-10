import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressCircle({ percentage, size = "md", className }: ProgressCircleProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-24 h-24"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl"
  };

  const strokeDasharray = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
     
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-bold text-foreground", textSizeClasses[size])}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}
