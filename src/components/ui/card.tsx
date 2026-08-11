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
        "rounded-[28px] border border-black/5 bg-surface dark:border-white/5 dark:bg-surface-dark",
        pressable ? "active:opacity-90 active:scale-[0.98]" : "shadow-md shadow-black/5 dark:shadow-none",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </View>
  );
}
