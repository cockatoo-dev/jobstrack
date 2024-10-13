import { z } from "zod"
import { checkLoginBeta } from "../../../db/db"
import { createBetaToken, hashPassword, TOKEN_COOKIE, TOKEN_EXPIRY } from "../../../utils/serverUtils"

const bodySchema = z.object({
  uname: z.string(),
  pass: z.string(),
})

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, b => bodySchema.safeParse(b))

  if (!bodyData.success) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  const passHash = await hashPassword(bodyData.data.pass)

  if (await checkLoginBeta(bodyData.data.uname, passHash)) {
    setCookie(e, TOKEN_COOKIE, await createBetaToken(bodyData.data.uname), {
      httpOnly: true,
      maxAge: TOKEN_EXPIRY
    })
  } else {
    throw createError({
      status: 400,
      message: "Invalid login details."
    })
  }
})
