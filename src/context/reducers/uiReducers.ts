
// Add this at the end of your file
export const setSyncStatus = (state, action) => {
  return {
    ...state,
    syncStatus: action.payload
  };
};
