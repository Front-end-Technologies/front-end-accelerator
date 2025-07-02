import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';
export type Loadable = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function withLoadable() {
  return signalStoreFeature(
    withState<Loadable>({
      loading: false,
      error: null,
      success: false,
    }),
    withComputed(({ loading, error, success }) => ({
      isLoading: computed(() => loading()),
      error: computed(() => error()),
      isSuccess: computed(() => success()),
    })),
  );
}
export function setLoading(): Loadable {
  return {
    loading: true,
    error: null,
    success: false,
  };
}
export function setError(error: string): Loadable {
  return {
    loading: false,
    error,
    success: false,
  };
}
export function setSuccess(): Loadable {
  return {
    loading: false,
    error: null,
    success: true,
  };
}

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export function withPagination() {
  return signalStoreFeature(
    withState<Pagination>({
      page: 1,
      pageSize: 10,
      total: 0,
    }),
    withComputed(({ page, pageSize, total }) => ({
      currentPage: computed(() => page()),
      itemsPerPage: computed(() => pageSize()),
      totalItems: computed(() => total()),
      totalPages: computed(() => Math.ceil(total() / pageSize())),
    })),
  );
}
export function setPagination(
  page: number,
  pageSize: number,
  total: number,
): Pagination {
  return {
    page,
    pageSize,
    total,
  };
}
export function resetPagination(): Pagination {
  return {
    page: 1,
    pageSize: 10,
    total: 0,
  };
}
export function nextPage(
  pagination: Pagination,
  totalPages: number,
): Pagination {
  const nextPage = pagination.page + 1;
  return {
    ...pagination,
    page: nextPage > totalPages ? totalPages : nextPage,
  };
}
export function previousPage(pagination: Pagination): Pagination {
  const previousPage = pagination.page - 1;
  return {
    ...pagination,
    page: previousPage < 1 ? 1 : previousPage,
  };
}
export function setPage(
  pagination: Pagination,
  page: number,
  totalPages: number,
): Pagination {
  return {
    ...pagination,
    page: Math.max(1, Math.min(page, totalPages)),
  };
}
export function setPageSize(
  pagination: Pagination,
  pageSize: number,
): Pagination {
  return {
    ...pagination,
    pageSize: Math.max(1, pageSize),
    page: 1, // Reset to first page when changing page size
  };
}
