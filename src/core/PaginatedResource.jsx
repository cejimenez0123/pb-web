import PaginatedList from "../components/page/PaginatedList";
import usePaginatedResource from "./usePaginatedResource";



export default function PaginatedResource({
  cacheKey,
  fetcher,
  pageSize = 20,
  params = {},
  search = "",
  enabled = true,
  select,
  pagination = "controls",
  ...listProps
}) {
  const resource = usePaginatedResource({
    cacheKey,
    fetcher,
    pageSize,
    params,
    search,
    enabled,
    select,
    infinite: pagination === "infinite",
  });

  const handleLoadMore = () => {
    if (
      resource.loading ||
      !resource.hasMore
    ) {
      return;
    }

    resource.setPage(resource.page + 1);
  };

  return (
    <PaginatedList
      {...listProps}
      items={resource.items}
      page={resource.page}
      setPage={resource.setPage}
      totalPages={resource.totalPages}
      loading={resource.loading}
      hasMore={resource.hasMore}
      pagination={pagination}
      onLoadMore={handleLoadMore}
    />
  );
}
