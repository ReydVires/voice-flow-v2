import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  ...props
}) => {
  const variantClass = styles[`btn${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles];
  const sizeClass = styles[`btn${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles];

  return (
    <button
      className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
};

