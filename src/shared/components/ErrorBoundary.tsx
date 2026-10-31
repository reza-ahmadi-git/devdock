import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("DevDock encountered an unexpected error.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-frame flex min-h-screen items-center justify-center p-5">
          <section className="content-card w-full max-w-lg text-center">
            <h1 className="text-lg font-semibold text-foreground">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Reload DevDock to continue using your workspace.
            </p>
            <button
              className="primary-button mt-5"
              onClick={() => window.location.reload()}
              type="button"
            >
              Reload
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
