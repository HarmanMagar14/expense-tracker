export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6 px-4 py-20">
      <div className="h-10 w-64 rounded-lg bg-border" />
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="h-72 rounded-2xl bg-border" />
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="h-24 rounded-2xl bg-border" />
            <div className="h-24 rounded-2xl bg-border" />
            <div className="h-24 rounded-2xl bg-border" />
          </div>
          <div className="h-64 rounded-2xl bg-border" />
        </div>
      </div>
    </div>
  );
}
