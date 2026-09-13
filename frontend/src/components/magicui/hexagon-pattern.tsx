"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface HexagonPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
}

export function HexagonPattern({
  width = 56,
  height = 96,
  className,
  strokeColor = "rgba(255, 107, 44, 0.15)",
  ...props
}: HexagonPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1)"
        >
          <path
            d={`M${width / 2} 0 L${width} ${height / 4} L${width} ${(3 * height) / 4} L${width / 2} ${height} L0 ${(3 * height) / 4} L0 ${height / 4} Z`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
          />
          <path
            d={`M0 0 L${width / 2} ${height / 4}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
          />
          <path
            d={`M${width} 0 L${width / 2} ${height / 4}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
    </svg>
  );
}
