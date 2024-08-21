import { FC } from 'react';
import { CardTypes } from './type';
import { cn } from '@/lib/cn';

export const Card: FC<CardTypes> = (
    {
        children,
        className

    }) => {
  return (
    <div className={cn(`bg-white shadow rounded-lg p-4`, className)}>
      {children}
    </div>
  );
};
