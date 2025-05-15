import { IconCheck, IconX, TablerIcon } from "@tabler/icons-react";
import React from "react";

interface BooleanDisplayProps {
  value: boolean;
  trueIcon?: TablerIcon;
  falseIcon?: TablerIcon;
  className?: string;
}

export default function BooleanDisplay({
  value,
  trueIcon,
  falseIcon,
  className,
}: BooleanDisplayProps) {
  const defaultTrueIcon = trueIcon || IconCheck;
  const defaultFalseIcon = falseIcon || IconX;

  return (
    <div className={className}>
      {value
        ? React.createElement(defaultTrueIcon)
        : React.createElement(defaultFalseIcon)}
    </div>
  );
}
