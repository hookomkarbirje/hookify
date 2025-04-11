
import React from "react";
import * as LucideIcons from "lucide-react";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => {
  // @ts-ignore - Dynamic access to Lucide icons
  const LucideIcon = LucideIcons[name] || LucideIcons.Music;

  return <LucideIcon size={size} className={className} color={color} />;
};
