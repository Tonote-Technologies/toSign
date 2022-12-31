import Api from "../axios/Api";

const END_POINT = "teams";

export default {
  all(token) {
    return Api.get(`${END_POINT}`, token);
  },
};

