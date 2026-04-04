export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-16 h-16 rounded-full bg-surface animate-pulse" />
            <div className="w-[200px] h-6 rounded-md bg-surface animate-pulse" />
            <div className="w-[300px] h-4 rounded-md bg-surface-hover animate-pulse" />
          </div>

          <div className="flex flex-col gap-3 w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-[120px] rounded-lg bg-surface animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
