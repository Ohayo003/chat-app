const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SIGNING_IN":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "SIGN_IN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "SIGN_IN_FAILED":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case "SIGN_OUT":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default AuthReducer;
