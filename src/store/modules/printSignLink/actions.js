import Print from "@/api/modules/Print";
import { useToast } from "vue-toast-notification";
const toast = useToast();


export const clearPrint = ({ commit }) => {
  commit("SET_PRINTS", []);
  commit("SET_PRINT", null);
  commit("SET_PRINT_NOTIFICATION", false);

};

export const getUserPrints = ({ commit }) => {
  commit("SET_PRINTS", []);
};

export const getUserPrint = ({ commit }, formData) => {
  Print.show(formData)
    .then((response) => {
      commit("SET_PRINT", response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const savePrint = ({ commit }, formData) => {
  commit("SET_PRINT_NOTIFICATION", false);
  commit("SET_PRINTS", formData);
  commit("SET_PRINT_NOTIFICATION", true);

  toast.success("Saved successfully", {
    timeout: 5000,
    position: "top-right",
  });
};

export const editPrint = ({ commit }, formData) => {
  Print.update(formData)
    .then((response) => {
      commit("SET_PRINTS", response.data.data);
    })
    .catch((error) => {
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removePrint = ({ commit }, formData) => {
  commit("SET_DELETE", formData);
};

export const emptyPrint = ({ commit }, formData) => {
  if (formData) {
    commit("SET_PRINTS", []);
  }
};