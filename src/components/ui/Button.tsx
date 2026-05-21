import React from 'react'

type Props = React.ComponentProps<'button'> & { as?: any; href?: string; variant?: 'solid' | 'ghost' }

export const Button = ({ as: Comp = 'button', variant = 'solid', children, ...props }: Props) => {
  const classes = variant === 'solid' ? 'bg-gradient-to-r from-[#7C3AED] to-[#39FF14] text-black px-4 py-2 rounded' : 'text-gray-300 px-4 py-2 rounded border'
  if (Comp === 'a') return <a {...(props as any)} className={classes as any}>{children}</a>
  return (
    <button {...props} className={classes as any}>
      {children}
    </button>
  )
}
