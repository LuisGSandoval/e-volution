export const initialState = {
  notes: [],

  // Utils
  toastMsg: null,
  loaderActivation: false,
  modalOpen: {
    section: '',
    open: false
  },
  updateMode: false,

  // Notes state
  sortBy: 'all',
  noteId: '',
  noteDetails: null,
  todoForm: {
    executionDate: '',
    title: '',
    description: '',
    priority: 1,
    errors: {}
  }
};
