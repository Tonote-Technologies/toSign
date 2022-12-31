import Api from "../axios/Api";

const DOCUMENT_STATISTICS = "document-statistics";
const SIGN_LINK = "signlink-documents";
const SIGN_LINK_TOOL = "signlink-annotations";
const SIGN_LINK_TOOLS = "signlink-annotation-tools";

const DOCUMENT_AUDIT_TRAIL = "document-audit-trail";

const SIGN_LINK_PUBLIC = "signlink-public-sign";
const SIGN_LINK_PUBLIC_STATE = "signlink-public-state";
const SIGN_LINK_PUBLIC_TOOL = "signlink-public-annotation";

const SIGN_LINK_COMPLETED = "signlink-complete";
const SIGN_LINK_RESPONSE = "signlink-responses";

const DOCUMENT_DELETE = "document-multiple-delete";
const SIGN_LINK_DONE = "document-participants-done";

export default {
  all(token) {
    return Api.get(`${SIGN_LINK}`, token);
  },

  auditTrail(documentId) {
    return Api.get(`${DOCUMENT_AUDIT_TRAIL}/${documentId}`);
  },

  documentStatistics(token) {
    return Api.get(`${DOCUMENT_STATISTICS}`, token);
  },

  show(id) {
    return Api.get(`${SIGN_LINK}/${id}`);
  },

  showPublic(docId) {
    return Api.get(`${SIGN_LINK_PUBLIC}/${docId}`);
  },

  showPublicState(newDocInstanceId) {
    return Api.get(`${SIGN_LINK_PUBLIC_STATE}/${newDocInstanceId}`);
  },

  updatePublicTool(id, data) {
    return Api.put(`${SIGN_LINK_PUBLIC_TOOL}/${id}`, data);
  },

  linkCompleted(id, data) {
    return Api.put(`${SIGN_LINK_COMPLETED}/${id}`, data);
  },

  allSignLinkResponses(id) {
    return Api.get(`${SIGN_LINK_RESPONSE}/${id}`);
  },

  store(data) {
    return Api.post(SIGN_LINK, data);
  },

  storeFileUpload(data) {
    return Api.post(SIGN_LINK, data);
  },

  update(data) {
    return Api.put(`${SIGN_LINK}/${data.id}`, data.payload);
  },

  deleteDocument(data) {
    return Api.post(DOCUMENT_DELETE, data);
  },

  deleteLink(linkId) {
    return Api.delete(`${SIGN_LINK}/${linkId}`);
  },

  allTools(docId) {
    return Api.get(`${SIGN_LINK_TOOLS}/${docId}`);
  },

  storeTools(data) {
    return Api.post(SIGN_LINK_TOOL, data);
  },

  updateTool(id, data) {
    return Api.put(`${SIGN_LINK_TOOL}/${id}`, data);
  },

  deleteTool(toolId) {
    return Api.delete(`${SIGN_LINK_TOOL}/${toolId}`);
  },

  participantDone(data) {
    return Api.post(SIGN_LINK_DONE, data);
  },
};

