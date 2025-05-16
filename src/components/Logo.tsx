
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Car } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  showText?: boolean;
}

export function Logo({
  className,
  size = 'md',
  color = 'primary',
  showText = true,
}: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 36, text: 'text-3xl' },
  };

  const colors = {
    primary: 'text-primary',
    white: 'text-white',
  };

  return (
    <Link to="/" className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex items-center justify-center p-1 rounded-md', color === 'white' ? 'bg-white/10' : 'bg-secondary')}>
        <Car size={sizes[size].icon} className="text-white" />
      </div>
      {showText && (
        <span className={cn('font-bold', sizes[size].text, colors[color])}>
          Lets Park It
        </span>
      )}
    </Link>
  );
}
