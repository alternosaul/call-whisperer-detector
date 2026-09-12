import { cn } from "@/lib/utils";
import { Bot, Loader2, User } from "lucide-react";

type State = "loading" | "ai" | "human" | "idle";

export function ResultBadge({ state }: { state: State }) {
  const config = {
    loading: {
      label: "Loading",
      icon: Loader2,
      className: "bg-muted text-muted-foreground border-border",
      spin: true,
    },
    idle: {
      label: "Loading",
      icon: Loader2,
      className: "bg-muted text-muted-foreground border-border",
      spin: false,
    },
    ai: {
      label: "AI",
      icon: Bot,
      className: "bg-destructive text-destructive-foreground border-destructive",
      spin: false,
    },
    human: {
      label: "Human",
      icon: User,
      className: "bg-success text-success-foreground border-success",
      spin: false,
    },
  }[state];

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-lg border-2 px-6 py-8 transition-colors",
        config.className,
      )}
    >
      <Icon className={cn("h-8 w-8", config.spin && "animate-spin")} />
      <span className="text-3xl font-bold tracking-tight">{config.label}</span>
    </div>
  );
}
