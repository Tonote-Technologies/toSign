import Api from "./Api";

const END_POINT = "document-resource-tools";
const END_POINT_TOOL = "user-document-resource-tool";

export default {
  all(documentId) {
    return Api.get(`${END_POINT_TOOL}/${documentId}`);
  },

  show(toolId) {
    return Api.get(`${END_POINT}/${toolId}`);
  },

  store(data) {
    return Api.post(END_POINT, data);
  },

  update(data) {
    return Api.put(`${END_POINT}/${data.id}`, data.payload);
  },

  delete(toolId) {
    return Api.delete(`${END_POINT}/${toolId}`);
  },
};

