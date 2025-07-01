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
