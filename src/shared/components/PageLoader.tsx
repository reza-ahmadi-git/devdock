export function PageLoader() {
  return (
    <div
      aria-label="Loading page"
      className="flex min-h-[40vh] items-center justify-center gap-3 text-sm text-muted"
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-border border-t-accent"
      />
      Loading...
    </div>
  );
}
