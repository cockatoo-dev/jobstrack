import { z } from "zod"
import { checkLoginBeta, deleteUserBeta } from "~/server/db/db"

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

  const uname = await checkBetaTokenUname(getCookie(e, TOKEN_COOKIE))
  const passHash = await hashPassword(bodyData.data.pass)
  if (!(await checkLoginBeta(uname, passHash))) {
    throw createError({
      status: 400,
      message: "Password is incorrect."
    })
  }

  await deleteUserBeta(uname, passHash)
  deleteCookie(e, TOKEN_COOKIE)
})