import Document from "@/api/modules/Document";
import Tool from "@/api/modules/Tool";
import Print from "@/api/modules/Print";
import router from "@/router/router";
import store from "@/store";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export const getUserDocuments = ({ commit }, token) => {
  Document.allDocuments(token)
    .then((response) => commit("SET_DOCUMENTS", response.data))
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const getAuditTrail = ({ commit }, formData) => {
  Document.auditTrail(formData)
    .then((response) => { commit("SET_AUDIT_TRAIL", response.data.data); })
};

export const getStatistics = ({ commit }, token) => {
  Document.documentStatistics(token)
    .then((response) => commit("SET_DOCUMENT_STATISTICS", response.data))
};

export const getUserDocumentByStatus = ({ commit }, formData) => {
  Document.allDocumentByStatus(formData)
    .then((response) => {
      if (!['Received', 'Deleted', 'Sign'].includes(formData)) {
        commit("SET_DOCUMENTS_BY_STATUS", response.data.data)
      }
    })
};

export const getReceivedDocuments = ({ commit }, token) => {
  Document.allReceivedDocuments(token)
    .then((response) => commit("SET_DOCUMENTS_BY_STATUS", response.data.data))
};

export const getDeletedDocuments = ({ commit }, token) => {
  Document.allDeletedDocuments(token)
    .then((response) => commit("SET_DOCUMENTS_BY_STATUS", response.data.data))
};

export const finishAnnotation = ({ commit }, formData) => {
  Document.allCompletedDocuments(formData)
    .then((response) => commit("SET_MESSAGE", response.data.data))
};

export const getUserDocument = ({ commit }, docId) => {
  commit("SET_DOCUMENT_LOADER", true)
  Document.showDocument(docId)
    .then((response) => commit("SET_DOCUMENT", response.data.data))
    .then(() => setTimeout(() => commit("SET_DOCUMENT_LOADER", false), 500))
    .catch((error) => {
      commit("SET_DOCUMENT_LOADER", false)
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const fileUploads = ({ commit }, formData) => {
  Document.storeFileUpload(formData)
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);
      commit("SET_CANCEL", true);
      router.push({ name: "document.prepare" });
    })
    .catch((error) => {
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removeRecentUpload = ({ commit }) => commit("SET_CANCEL", false);

export const removeDocument = ({ commit }, formData) => {
  Document.deleteDocument(formData)
    .then((response) => {
      const token = store.getters["auth/token"];
      const status = router.currentRoute.value.query.status;

      if (status != undefined) {
        const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        Document.documentStatistics(token)
          .then((response) => commit("SET_DOCUMENT_STATISTICS", response.data))

        if (!['Received', 'Deleted', 'Sign'].includes(capitalizedStatus)) {
          Document.allDocumentByStatus(capitalizedStatus)
            .then((response) => commit("SET_DOCUMENTS_BY_STATUS", response.data.data))
        } else {
          if (capitalizedStatus == 'Received') {
            Document.allReceivedDocuments(token)
              .then((response) => commit("SET_DOCUMENTS_BY_STATUS", response.data.data))
          }
          if (capitalizedStatus == 'Deleted') {
            Document.allDeletedDocuments(token)
              .then((response) => commit("SET_DOCUMENTS_BY_STATUS", response.data.data))
          }
        }
      }

      toast.success(`${response.data.data.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const retrieveDocument = ({ commit }, formData) => {
  Document.restoreDocument(formData)
    .then((response) => {
      const token = store.getters["auth/token"];
      Document.allDeletedDocuments(token)
        .then((response) => commit("SET_DOCUMENTS_BY_STATUS", response.data.data))
        .then(() => {
          Document.documentStatistics(token)
            .then((response) => commit("SET_DOCUMENT_STATISTICS", response.data))
        })

      toast.success(`${response.data.data.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const addSelf = ({ commit }, formData) => {
  Document.storeSelf(formData)
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);

      toast.success("You added yourself as a signer", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.response.data.data.error}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const addParticipant = ({ commit }, formData) => {
  Document.storeParticipant({ participants: formData })
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);
      toast.success(`${response.data.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const doneEditing = ({ commit }, formData) => {
  commit("SET_DONE_LOADER", true);
  Document.participantDone(formData)
    .then((response) => {
      commit("SET_DONE_LOADER", false);
      commit("SET_DOCUMENT_DONE", response.data.data);
      toast.success("Document sent successfully", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      commit("SET_DONE_LOADER", false);
      if (error.response.status == 409) {
        toast.error(`${error.response.data.data.error}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};

export const editParticipant = ({ commit }, formData) => {
  Document.updateParticipant({ participants: formData })
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);

      toast.success("Participant updated successfully", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removeNotification = ({ commit }, closeModal) => { commit("SET_NOTIFICATION", closeModal); };

export const invitationMail = ({ commit }, formData) => {
  Document.mailToParticipant({ participants: formData, subject: formData.subject, message: formData.message })
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);
      commit("SET_NOTIFICATION", true);
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const removeParticipant = ({ commit }, formData) => {
  Document.deleteParticipant(formData)
    .then((response) => {
      commit("SET_DOCUMENT", response.data.data);

      toast.success("Participant removed successfully", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(`${error.message}`, {
        timeout: 5000,
        position: "top-right",
      });
    });
};

export const getTools = ({ commit }, formData) => {
  Tool.all(formData).then((response) => { commit("SET_RESOURCE_TOOLS", response.data.data); });
};

export const resourceTools = ({ commit }, formData) => {
  Document.storeTools(formData)
    .then((response) => {
      commit("SET_RESOURCE_TOOLS", response.data.data);
      commit("SET_LOADER", true)
    })
    .then(() => commit("SET_LOADER", false))
    .catch((error) => {
      console.log(error);
    });
};

export const editTools = ({ commit }, formData) => {
  if (['Signature', 'Initial', 'Photo']
    .includes(formData.payload.tool_name)) {
    commit("SET_TOOL_LOADER", { id: formData.id, active: true })
  }

  Document.updateTool(formData.id, formData.payload)
    .then((response) => {
      if (formData.payload.tool_name) {
        commit("SET_EDIT_RESOURCE_TOOL", response.data.data);
        setTimeout(() => {
          commit("SET_TOOL_LOADER", { id: '', active: false })
        }, 500);
      }
    })
};

export const removeTool = ({ commit, getters }, formData) => {
  const tools = getters.workingTools;
  const index = tools.findIndex((tool) => tool.id === formData.toolId)

  if (index !== -1) { tools.splice(index, 1) }
  commit("SET_RESOURCE_TOOLS", tools)

  Document.deleteTool(formData.toolId)
  if (formData.printId == undefined || formData.toolName != 'Textarea') return;
  Print.deletePrint(formData.printId)
};