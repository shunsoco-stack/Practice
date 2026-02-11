interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '',
  padding = 'md',
  onClick 
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const clickableClass = onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 ${paddings[padding]} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}