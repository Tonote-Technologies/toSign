export const SET_DOCUMENTS = (state, docs) => {
  state.documents = docs;
};

export const SET_AUDIT_TRAIL = (state, trail) => {
  state.documentAuditTrail = trail;
};

export const SET_DOCUMENT_STATISTICS = (state, docStats) => {
  state.statistics = docStats;
};

export const SET_DOCUMENTS_BY_STATUS = (state, docs) => {
  state.documentsByStatus = docs;
};

export const SET_DOCUMENT = (state, doc) => {
  state.document = doc;
};

export const SET_CANCEL = (state, cancel) => {
  state.cancel = cancel;
};

export const SET_DOCUMENT_DONE = (state, done) => {
  state.doneEditing = done;
};

export const SET_NOTIFICATION = (state, modal) => {
  state.isOpenModal = modal;
};

export const SET_RESOURCE_TOOLS = (state, tool) => {
  state.resourceTools = tool;
};

export const SET_EDIT_RESOURCE_TOOL = (state, edit) => {
  const index = state.resourceTools.findIndex((tool) => tool.id === edit.id)
  if (index !== -1) { state.resourceTools.splice(index, 1, edit) }
};

export const SET_MESSAGE = (state, msg) => {
  state.message = msg;
};

export const SET_DONE_LOADER = (state, done) => {
  state.isDoneLoading = done;
};

export const SET_LOADER = (state, loader) => {
  state.isLoading = loader;
};

export const SET_DOCUMENT_LOADER = (state, loader) => {
  state.isDocLoading = loader;
};

export const SET_TOOL_LOADER = (state, loader) => {
  state.isToolLoading = loader;
};