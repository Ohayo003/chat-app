export const SignIn = (userInfo) => ({
  type: "SIGNING_IN"
});
export const SignInSuccess = (userInfo) => ({
    type: "SIGN_IN_SUCCESS",
    payload: userInfo
});
export const SignInFail = (err) => ({
    type: "SIGN_IN_FAILED",
    payload: err
})
export const SignOut = () => ({
  type: "SIGN_OUT"
})