import { ReactNode } from 'react';

interface FlexProps {
  children?: ReactNode;
  direction?: 'row' | 'column';
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Flex({
  children,
  direction = 'row',
  justify = 'start',
  alignItems = 'start',
  className = '',
  onClick,
  style = {},
}: FlexProps) {
  return (
    <div
      className={`flex ${className}`}
      style={{
        flexDirection: direction,
        justifyContent: justify,
        alignItems,
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 