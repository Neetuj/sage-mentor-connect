import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  variant?: 'default' | 'tutor' | 'seminar' | 'testimonial';
}

export const SkeletonCard = ({ className, variant = 'default' }: SkeletonCardProps) => {
  const baseClass = "animate-pulse rounded-lg bg-muted overflow-hidden";
  
  if (variant === 'tutor') {
    return (
      <div className={cn(baseClass, "p-6 space-y-4", className)}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-muted-foreground/20" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded" />
          <div className="h-3 bg-muted-foreground/20 rounded w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
          <div className="h-6 w-20 bg-muted-foreground/20 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === 'seminar') {
    return (
      <div className={cn(baseClass, "p-4 space-y-3", className)}>
        <div className="h-32 bg-muted-foreground/20 rounded-md" />
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
          <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
          <div className="h-3 bg-muted-foreground/20 rounded w-2/3" />
        </div>
        <div className="h-9 bg-muted-foreground/20 rounded" />
      </div>
    );
  }

  if (variant === 'testimonial') {
    return (
      <div className={cn(baseClass, "p-4 space-y-3", className)}>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-muted-foreground/20 rounded" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded" />
          <div className="h-3 bg-muted-foreground/20 rounded w-5/6" />
          <div className="h-3 bg-muted-foreground/20 rounded w-4/6" />
        </div>
        <div className="pt-2 border-t border-muted-foreground/10">
          <div className="h-3 bg-muted-foreground/20 rounded w-1/3 mb-1" />
          <div className="h-2 bg-muted-foreground/20 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(baseClass, "p-6 space-y-4", className)}>
      <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
      <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
      <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
    </div>
  );
};

export const SkeletonShimmer = ({ className }: { className?: string }) => (
  <div className={cn("relative overflow-hidden bg-muted rounded-lg", className)}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
  </div>
);

export default SkeletonCard;
