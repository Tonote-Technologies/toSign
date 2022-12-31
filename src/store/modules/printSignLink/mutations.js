export const SET_PRINTS = (state, print) => {
  const existsAtIndex = state.prints.findIndex(p => p.category === print.category);
  (existsAtIndex !== -1) ?
    state.prints[existsAtIndex] = print
    : state.prints.push(print);

  state.prints = [...state.prints]
}

export const SET_DELETE = (state, index) => {
  state.prints.splice(index, 1);
};

export const SET_PRINT = (state, print) => {
  state.print = print;
};

export const SET_PRINT_NOTIFICATION = (state, isSaved) => {
  state.isPrintSaved = isSaved;
};
