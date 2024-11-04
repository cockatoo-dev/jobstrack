import { getUserInfo } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  return await getUserInfo(userId)
})