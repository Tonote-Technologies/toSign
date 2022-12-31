export const SET_LINKS = (state, link) => {
  state.links = link;
};

export const SET_AUDIT_TRAIL = (state, trail) => {
  state.documentAuditTrail = trail;
};

export const SET_LINK = (state, link) => {
  state.link = link;
};

export const SET_RESPONSE_PREVIEW = (state, preview) => {
  state.resPreview = preview;
};

export const SET_SIGN_LINK_RESPONSES = (state, response) => {
  state.responses = response;
};

export const SET_CANCEL = (state, cancel) => {
  state.cancel = cancel;
};

export const SET_LINK_NOTIFICATION = (state, isSaved) => {
  state.isLinkSaved = isSaved;
};

export const SET_LINK_DONE = (state, done) => {
  state.doneEditing = done;
};

export const SET_LINK_COMPLETED = (state, done) => {
  state.doneSigning = done;
};

export const SET_NOTIFICATION = (state, modal) => {
  state.isOpenModal = modal;
};

export const SET_TOOLS = (state, tool) => {
  state.resourceTools = tool;
};

export const SET_EDIT_TOOL = (state, edit) => {
  const index = state.resourceTools.findIndex((tool) => tool.id === edit.id)
  if (index !== -1) { state.resourceTools.splice(index, 1, edit) }
};

export const SET_LOADER = (state, loader) => {
  state.isLoading = loader;
};

export const SET_TOOL_LOADER = (state, loader) => {
  state.isToolLoading = loader;
};