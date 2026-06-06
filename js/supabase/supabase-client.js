(function () {
  const config = window.SBWSupabaseConfig || {};

  function isConfigured() {
    return Boolean(
      config.enabled &&
      config.url &&
      config.publishableKey &&
      window.supabase &&
      typeof window.supabase.createClient === "function"
    );
  }

  function createClient() {
    if (!isConfigured()) {
      console.warn("[SaberWolf Supabase] Supabase não configurado. Usando modo local-demo.");

      return null;
    }

    return window.supabase.createClient(config.url, config.publishableKey);
  }

  const client = createClient();

  window.SBWSupabase = {
    config: config,
    client: client,
    isConfigured: isConfigured,
    isEnabled: function () {
      return Boolean(client);
    }
  };
})();