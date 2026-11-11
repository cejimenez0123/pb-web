
function HomeSection({ profile }) {
  const displayName = profile?.username ||
    "there";

  return (
    <section
      aria-labelledby="home-heading"
      className="space-y-8"
    >
      <div>
        <p className="text-sm font-medium text-plumb-muted dark:text-plumb-dark-muted">
          Your space
        </p>

        <h2
          id="home-heading"
          className="mt-2 font-serif text-3xl text-plumb-ink dark:text-plumb-dark-ink sm:text-4xl"
        >
          Welcome, {displayName}.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-plumb-muted dark:text-plumb-dark-muted sm:text-base">
          A place to return to what you're making,
          what you're discovering, and the people
          you're connecting with.
        </p>
      </div>
    </section>
  );
}

export default HomeSection;
