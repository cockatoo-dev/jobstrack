import { useDB } from "~/server/db/db"
import { checkBetaToken } from "~/server/utils/serverUtils"

export default defineEventHandler(async (e) => {
  const db = useDB(e)
  const userId = await checkBetaToken(db, getCookie(e, TOKEN_COOKIE))
  return {userId}
})
