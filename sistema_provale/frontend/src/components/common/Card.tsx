import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function Card({ children, className, title, icon, action }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-[20px] border-2 border-[var(--wheat)]',
        'overflow-hidden transition-all duration-300',
        'hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5',
        className
      )}
    >
      {(title || action) && (
        <div className="px-6 py-5 border-b-2 border-[var(--wheat)] bg-gradient-to-r from-white to-[var(--cream)] flex justify-between items-center">
          {title && (
            <div className="flex items-center gap-3">
              {icon && <span className="text-[var(--leaf)]">{icon}</span>}
              <h3 className="font-extrabold text-base text-[var(--charcoal)]">
                {title}
              </h3>
            </div>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-7">{children}</div>
    </div>
  );
}
