import Api from "./Api";

const END_POINT = "user";

export default {
  login(data) {
    return Api.post(`${END_POINT}/login`, data);
  },

  logout(data) {
    return Api.post(`${END_POINT}/logout`, data);
  },

  show() {
    return Api.get(`${END_POINT}/profile`);
  },

  verifyOTP(data) {
    return Api.post(`${END_POINT}/document/verify`, data);
  },

  changePassword(data) {
    return Api.post(`${END_POINT}/change/password`, data);
  },

  resendVerifyOTP(data) {
    return Api.post(`${END_POINT}/document/resend/otp`, data);
  },
};

