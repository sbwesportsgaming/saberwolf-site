const SBW_TOURNAMENTS_CONFIG = {
  storageKey: "sbw_tournaments",
  registrationKey: "sbw_demo_registrations",
  appMode: "local-demo",

  routes: {
    list: "torneios.html",
    detail: "detalhe-torneio.html",
    admin: "criar-torneio.html"
  },

  futureSupabase: {
    enabled: false,
    note: "Preparado para trocar localStorage por Supabase futuramente."
  }
};