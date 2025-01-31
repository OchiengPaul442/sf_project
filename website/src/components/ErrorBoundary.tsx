// components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-4">
            <h2 className="text-xl mb-4">Something went wrong</h2>
            <p className="text-red-500">{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
