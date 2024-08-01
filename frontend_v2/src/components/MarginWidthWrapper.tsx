import { ReactNode } from 'react';

export default function MarginWidthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="col-span-5 md:col-span-4 sm:border-r sm:border-zinc-700 min-h-screen">
      {children}
    </div>
  );
}