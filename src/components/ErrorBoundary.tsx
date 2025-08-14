import * as React from 'react'

type State = { hasError: boolean; error?: any }
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(error: any) { return { hasError: true, error } }
  componentDidCatch(error: any, info: any) { console.error('UI crashed:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="m-4 rounded-lg border bg-card p-4 text-card-foreground">
          <div className="text-red-600 font-semibold mb-2">Something went wrong while rendering.</div>
          <pre className="text-xs whitespace-pre-wrap">{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
