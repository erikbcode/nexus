import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 text-base',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 dark:bg-base-800 text-zinc-100 hover:bg-zinc-800 dark:hover:bg-base-700',
        destructive: 'text-zinc-600 hover:text-white dark:text-white hover:bg-red-400 dark:hover:bg-red-600',
        outline: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 outline outline-1 outline-zinc-300',
        subtle: 'hover:bg-zinc-200 bg-zinc-100 text-zinc-900',
        ghost:
          'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-600 data-[state=open]:bg-transparent data-[state=open]:bg-transparent',
        link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
      },
      size: {
        default: 'h-10 py-2 px-2',
        sm: 'h-9 px-2 rounded-md',
        xs: 'h-8 px-1.5 rounded-sm',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({ isLoading, className, variant, size, ...props }: ButtonProps) {
  return <button disabled={isLoading} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
