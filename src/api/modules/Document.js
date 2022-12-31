import Api from "../axios/Api";

const END_POINT = "documents";
const DOCUMENT_AUDIT_TRAIL = "document-audit-trail";
const DOCUMENT_STATISTICS = "document-statistics";
const DOCUMENT_DELETE = "document-multiple-delete";
const DOCUMENT_RESTORE = "document-multiple-restore";
const DOCUMENT_COMPLETE = "document-complete";
const DOCUMENT_RECEIVED = "documents-received";
const DOCUMENT_TEMPORAL_DELETED = "documents-temporal-deleted";

const DOCUMENT_PARTICIPANT_ADD_SELF = "document-participant-add-self";
const DOCUMENT_PARTICIPANTS = "document-participants";
const DOCUMENT_PARTICIPANTS_DONE = "document-participants-done";
const DOCUMENT_PARTICIPANTS_SEND_MAIL = "document-participants-send-email";

const DOCUMENT_RESOURCE_TOOLS = "document-resource-tools";

export default {
  allDocuments(token) {
    return Api.get(`${END_POINT}`, token);
  },

  auditTrail(documentId) {
    return Api.get(`${DOCUMENT_AUDIT_TRAIL}/${documentId}`);
  },

  documentStatistics(token) {
    return Api.get(`${DOCUMENT_STATISTICS}`, token);
  },

  allDocumentByStatus(status) {
    return Api.get(`${END_POINT}?status=${status}`);
  },

  allCompletedDocuments(documentId) {
    return Api.get(`${DOCUMENT_COMPLETE}/${documentId}`);
  },

  allReceivedDocuments(token) {
    return Api.get(`${DOCUMENT_RECEIVED}`, token);
  },

  allDeletedDocuments(token) {
    return Api.get(`${DOCUMENT_TEMPORAL_DELETED}`, token);
  },

  showDocument(documentId) {
    return Api.get(`${END_POINT}/${documentId}`);
  },

  storeFileUpload(data) {
    return Api.post(END_POINT, data);
  },

  storeSelf(documentId) {
    return Api.get(`${DOCUMENT_PARTICIPANT_ADD_SELF}/${documentId}`);
  },

  deleteDocument(data) {
    return Api.post(DOCUMENT_DELETE, data);
  },

  restoreDocument(data) {
    return Api.post(DOCUMENT_RESTORE, data);
  },

  storeParticipant(data) {
    return Api.post(DOCUMENT_PARTICIPANTS, data);
  },

  updateParticipant(data) {
    return Api.put(`${DOCUMENT_PARTICIPANTS}/${data.participants[0].document_id}`, data);
  },

  mailToParticipant(data) {
    return Api.post(DOCUMENT_PARTICIPANTS_SEND_MAIL, data);
  },

  participantDone(data) {
    return Api.post(DOCUMENT_PARTICIPANTS_DONE, data);
  },

  deleteParticipant(participantId) {
    return Api.delete(`${DOCUMENT_PARTICIPANTS}/${participantId}`);
  },

  storeTools(data) {
    return Api.post(DOCUMENT_RESOURCE_TOOLS, data);
  },

  updateTool(id, data) {
    return Api.put(`${DOCUMENT_RESOURCE_TOOLS}/${id}`, data);
  },

  deleteTool(toolId) {
    return Api.delete(`${DOCUMENT_RESOURCE_TOOLS}/${toolId}`);
  },
};

