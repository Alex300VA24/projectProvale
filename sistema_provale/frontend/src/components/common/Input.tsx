import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-[var(--charcoal)]">
          {label}
          {props.required && <span className="text-[var(--clay)] ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200',
          'bg-white text-[var(--charcoal)] placeholder:text-[var(--earth)]/50',
          'focus:outline-none focus:ring-2 focus:ring-[var(--leaf)] focus:ring-offset-1',
          error
            ? 'border-[var(--clay)] focus:border-[var(--clay)]'
            : 'border-[var(--wheat)] hover:border-[var(--earth)]/30 focus:border-[var(--leaf)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-[var(--clay)] font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-[var(--earth)]">{helperText}</p>
      )}
    </div>
  );
}
