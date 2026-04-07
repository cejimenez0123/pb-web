export default function HorizontalScroll({ children }) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      {children}
    </div>
  );
}