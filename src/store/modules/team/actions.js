import Team from "@/api/modules/Team";

export const getTeams = ({ commit }, token) => {
  Team.all(token)
    .then((response) => {
      commit("SET_TEAMS", response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

