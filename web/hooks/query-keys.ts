export const queryKeys = {
  // ── Clinics ──────────────────────────────────────────────
  clinics: {
    all: ["clinics"] as const,
    lists: () => [...queryKeys.clinics.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.clinics.lists(), filters] as const,
    details: () => [...queryKeys.clinics.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.clinics.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.clinics.all, "search", query] as const,
  },
};
