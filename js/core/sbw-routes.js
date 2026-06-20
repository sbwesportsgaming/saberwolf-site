(function () {
  "use strict";

  const KNOWN_FOLDERS = [
    "/admin/",
    "/auth/",
    "/beta/",
    "/blog/",
    "/comunidades/",
    "/creators/",
    "/equipes/",
    "/organizadores/",
    "/pages/",
    "/perfis/",
    "/rankings/",
    "/torneios/",
    "/transferencias/",
    "/atletas/"
  ];

  const ROUTES = {
    home: "index.html",
    login: "auth/login.html",
    resetPassword: "auth/redefinir-senha.html",
    forgotPassword: "auth/esqueci-senha.html",
    profiles: "perfis/perfis.html",
    profile: "perfis/perfil.html",
    myProfile: "perfis/meu-perfil.html",
    teams: "equipes/equipes.html",
    team: "equipes/equipe.html",
    myTeam: "equipes/minha-equipe.html",
    createTeam: "equipes/criar-equipe.html",
    createSubteam: "equipes/criar-subequipe.html",
    organizers: "organizadores/organizadores.html",
    tournaments: "torneios/torneios.html",
    tournament: "torneios/detalhe-torneio.html",
    createTournament: "torneios/create-tournament/criar-torneio.html",
    organizer: "torneios/organizador.html",
    rankings: "rankings/rankings.html",
    transfers: "transferencias/transferencias.html",
    communities: "comunidades/comunidades.html",
    creators: "creators/creators.html",
    news: "blog/noticias.html",
    about: "pages/sobre.html",
    shop: "pages/loja.html",
    terms: "pages/termos.html",
    privacy: "pages/privacidade.html",
    cookies: "pages/cookies.html",
    admin: "admin/admin.html"
  };

  function getBasePath() {
    const pathname = window.location.pathname || "/";
    const normalizedPathname = pathname.startsWith("/") ? pathname : "/" + pathname;

    for (const folder of KNOWN_FOLDERS) {
      const index = normalizedPathname.indexOf(folder);

      if (index >= 0) {
        return normalizedPathname.slice(0, index + 1) || "/";
      }
    }

    const lastSlash = normalizedPathname.lastIndexOf("/");
    const base = normalizedPathname.slice(0, lastSlash + 1) || "/";

    if (/\.[a-z0-9]+$/i.test(normalizedPathname)) {
      return base;
    }

    return normalizedPathname.endsWith("/") ? normalizedPathname : normalizedPathname + "/";
  }

  function normalizePath(routeOrPath) {
    const route = ROUTES[routeOrPath] || routeOrPath || ROUTES.home;
    return String(route).replace(/^\/+/, "");
  }

  function toUrl(routeOrPath, params, hash) {
    const path = normalizePath(routeOrPath);

    if (/^(https?:|mailto:|tel:|#)/i.test(path)) {
      return path;
    }

    const basePath = getBasePath();
    const baseUrl = window.location.origin + basePath;
    const url = new URL(path, baseUrl);

    if (params && typeof params === "object") {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, value);
        }
      });
    }

    if (hash) {
      url.hash = String(hash).startsWith("#") ? String(hash) : "#" + String(hash);
    }

    return url.pathname + url.search + url.hash;
  }

  function idParams(id) {
    return id ? { id: String(id) } : undefined;
  }

  function withRedirect(path, redirectUrl) {
    return toUrl(path, redirectUrl ? { redirect: redirectUrl } : undefined);
  }

  window.SBWRoutes = {
    routes: { ...ROUTES },
    getBasePath,
    url: toUrl,
    home: () => toUrl("home"),
    login: (redirectUrl) => withRedirect("login", redirectUrl),
    profile: (id) => toUrl("profile", idParams(id)),
    profiles: () => toUrl("profiles"),
    myProfile: (hash) => toUrl("myProfile", undefined, hash),
    team: (id) => toUrl("team", idParams(id)),
    teams: () => toUrl("teams"),
    myTeam: (id, tab) => toUrl("myTeam", { id, tab }),
    createTeam: () => toUrl("createTeam"),
    createSubteam: (parent) => toUrl("createSubteam", parent ? { parent } : undefined),
    tournament: (id) => toUrl("tournament", idParams(id)),
    organizers: () => toUrl("organizers"),
    tournaments: () => toUrl("tournaments"),
    organizer: (slug) => toUrl("organizer", slug ? { slug } : undefined),
    rankings: () => toUrl("rankings"),
    admin: () => toUrl("admin"),
    terms: () => toUrl("terms"),
    privacy: () => toUrl("privacy"),
    cookies: () => toUrl("cookies")
  };
})();
