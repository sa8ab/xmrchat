export interface UseFilterParams {
  initialPage?: number;
  queryToData?: () => any;
  getAll?: () => any;
  onQueryChange?: () => any;
}
export default ({
  initialPage = 1,
  queryToData,
  getAll,
  onQueryChange,
}: UseFilterParams = {}) => {
  const route = useRoute();
  const page = ref<number>(initialPage);

  const limit = 2;

  const offset = computed(() => {
    if (typeof page.value === "undefined") return undefined;
    return (page.value - 1) * limit;
  });

  onMounted(() => {
    queryToData?.();
    page.value = parseInt(route.query.page as string) || 1;
  });

  watch(
    () => route.query,
    () => {
      getAll?.();
      queryToData?.();
      onQueryChange?.();
      page.value = parseInt(route.query.page as string) || 1;
    }
  );

  watch(page, (page) => {
    if (parseInt(route.query.page as string) == page) return;
    navigateTo({
      query: {
        ...route.query,
        page,
      },
    });
  });

  const clearFilters = () => {
    navigateTo({
      query: {},
    });
  };

  const hasFilters = computed(() => Object.values(route.query).some((v) => v));

  return {
    page,
    clearFilters,
    hasFilters,
    limit,
    offset,
  };
};
