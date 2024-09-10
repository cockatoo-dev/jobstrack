export default defineEventHandler(async (e) => {
  const uname = await checkToken(getCookie(e, TOKEN_COOKIE))
  return {uname}
})
