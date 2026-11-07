function formatStatus(status) {
  const labels = {
    draft: "Draft",
    fragment: "Fragment",
    workshop: "Workshop",
    finished: "Finished",
    published: "Finished",
  };

  return labels[String(status).toLowerCase()] || status;
}
export default formatStatus