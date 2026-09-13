function Placeholder({ title }) {
  return (
    <div className="mx-auto max-w-[1120px] px-7 py-20 md:px-12 xl:px-16">
      <h1 className="font-display text-5xl font-semibold">{title}</h1>
      <p className="mt-4 text-lg text-plumb-muted">
        This route is ready for its own modular page components.
      </p>
    </div>
  );
}
export default Placeholder