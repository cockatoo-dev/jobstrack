import { useDB } from "~/server/db/db"

export default defineEventHandler(async (e) => {
  const db = useDB(e)
  const userId = await checkBetaToken(db, getCookie(e, TOKEN_COOKIE))
  return await db.getUserInfo(userId)
})