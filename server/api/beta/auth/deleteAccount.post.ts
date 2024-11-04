import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  pass: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, b => bodySchema.safeParse(b))

  if (!bodyData.success) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  const db = useDB(e)

  const uname = await checkBetaTokenUname(db, getCookie(e, TOKEN_COOKIE))
  const passHash = await hashPassword(bodyData.data.pass)
  if (!(await db.checkLoginBeta(uname, passHash))) {
    throw createError({
      status: 400,
      message: "Password is incorrect."
    })
  }

  await db.deleteUserBeta(uname, passHash)
  deleteCookie(e, TOKEN_COOKIE)
})