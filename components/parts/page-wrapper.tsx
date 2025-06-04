export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-1 sm:p-6 border overflow-y-auto sm:overflow-y-scroll no-scrollbar w-full sm:max-w-[calc(100vw-272px)] rounded-lg bg-muted/50 h-full">
      {children}
    </div>
  );
}
