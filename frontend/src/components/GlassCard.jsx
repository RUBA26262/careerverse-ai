export default function GlassCard({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`glass-panel rounded-2xl ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
