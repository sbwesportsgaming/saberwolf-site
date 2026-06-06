(function () {
  window.SBWSupabaseConfig = {
    enabled: true,

    /*
      Use somente chave pública/publishable/anon.
      Nunca coloque service_role ou secret key no front-end.
    */

    url: "https://junuqclcrqrjxyxmfntk.supabase.co",
    publishableKey: "sb_publishable_0pZzBW9QvcDPkD4bnNycUQ_BwK9KBpR",

    mode: "supabase",

    tables: {
      profiles: "profiles",
      teams: "teams",
      teamInvites: "team_invites",
      teamMembers: "team_members",
      tournaments: "tournaments",
      tournamentParticipants: "tournament_participants",
      tournamentOrganizers: "tournament_organizers",
      tournamentOrganizerMembers: "tournament_organizer_members",
      tournamentMatches: "tournament_matches",
      tournamentResults: "tournament_results"
    }
  };
})();