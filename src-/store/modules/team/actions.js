import Team from "@/api/Team";

export const getTeams = ({ commit }, token) => {
  commit("SET_TEAM_LOADER", true);
  Team.all(token)
    .then((response) => {
      commit("SET_TEAMS", response.data.data);
      setTimeout(() => {
        commit("SET_TEAM_LOADER", false);
      }, 1000);
    })
    .catch((error) => {
      console.log(error);
    });
};

