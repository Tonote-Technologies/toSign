import Company from "@/api/Company";
// import { useToast } from "vue-toast-notification";
// const toast = useToast();

export const getCompanies = ({ commit }, token) => {
  Company.all(token)
    .then((response) => {
      commit("SET_COMPANIES", response.data.data);
    })
  // .catch((error) => {
  //   toast.error(error.response.data.data.error, {
  //     timeout: 5000,
  //     position: "top-right",
  //   });
  // });
};

