function grabId(pathname) {
  return (
    pathname
      .split("/")
      .find((segment) =>
        /^\d+$/.test(segment) ||
        /^[a-f\d]{24}$/i.test(segment)
      ) || null
  );
}

export default grabId;