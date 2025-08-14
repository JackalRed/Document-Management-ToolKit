import React from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useTheme } from '../ThemeProvider'

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  return (
    <Sonner
      theme={(theme as ToasterProps['theme']) || 'light'}
      className="toaster group"
      style={{
        // match original token usage
        ['--normal-bg' as any]: 'var(--popover)',
        ['--normal-text' as any]: 'var(--popover-foreground)',
        ['--normal-border' as any]: 'var(--border)',
      }}
      {...props}
    />
  )
}
