const initalState = parseInt(0);

  const pageReducer = (state = initalState, action) => {
    const { type, payload } = action;

    switch (type) {

    case 'GET_PAGENUM':
        console.log('payload', payload);
        return parseInt(payload.pageNum);

    default:
      return state;
  }
};

export default pageReducer;