export default function LoadingBar({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent overflow-hidden">
      <div className="h-full bg-primary w-1/3 animate-[indeterminate_1.25s_infinite_linear]" />
    </div>
  );
}
