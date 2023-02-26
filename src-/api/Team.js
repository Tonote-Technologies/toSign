import Api from "./Api";

const END_POINT = "teams";

export default {
  all(token) {
    return Api.get(`${END_POINT}`, token);
  },
};

