import { cn } from "@/utils/cn";
import { View, type ViewProps } from "react-native";

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
  pressable?: boolean;
}

export function Card({
  children,
  padded = true,
  pressable = false,
  className,
  ...props
}: CardProps) {
  return (
    <View
      {...props}
      className={cn(
        "rounded-2xl border border-border/60 bg-surface dark:border-neutral-800 dark:bg-neutral-900",
        pressable ? "active:opacity-90" : "shadow-sm",
        padded && "p-4",
        className,
      )}
    >
      {children}
    </View>
  );
}
