export const SET_PRINTS = (state, print) => {
  state.prints = print;
};

export const SET_PRINT = (state, print) => {
  state.print = print;
};

export const SET_PRINT_NOTIFICATION = (state, isSaved) => {
  state.isPrintSaved = isSaved;
};
