import { checkBetaToken } from "~/server/utils/serverUtils"

export default defineEventHandler(async (e) => {
  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  return {userId}
})
