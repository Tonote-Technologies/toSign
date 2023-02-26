import Tool from "@/api/Tool";
import router from "@/router/router";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export const getTools = ({ commit }, formData) => {
  Tool.all(formData)
    .then((response) => {
      commit("SET_RESOURCE_TOOLS", response.data.data);
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const getTool = ({ commit }, docId) => {
  Tool.show(docId)
    .then((response) => {
      commit("SET_RESOURCE_TOOL", response.data.data);
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const createTool = ({ commit }, formData) => {
  Tool.store(formData)
    .then(() => {
      Tool.all(router.currentRoute.value.params.document_id).then((response) => {
        commit("SET_RESOURCE_TOOLS", response.data.data);
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const editTool = ({ commit }, formData) => {
  let check = JSON.parse(localStorage.getItem("vuex"));
  let parsedData = check.document.resourceTools;

  const index = parsedData.findIndex((tool) => tool.id === formData.id)
  if (index !== -1) { parsedData.splice(index, 1, formData.toLocal) }

  commit("SET_RESOURCE_TOOLS", parsedData)

  Tool.update(formData)
    .then((response) => {
      commit("SET_EDIT_RESOURCE_TOOL", response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const removeTool = ({ commit }, formData) => {
  let check = JSON.parse(localStorage.getItem("vuex"));
  let parsedData = check.document.resourceTools;

  const index = parsedData.findIndex((tool) => tool.id === formData)

  if (index !== -1) { parsedData.splice(index, 1) }
  commit("SET_RESOURCE_TOOLS", parsedData)
  commit("SET_RESOURCE_TOOL_WITH_ASSET", parsedData)

  Tool.delete(formData)
};

