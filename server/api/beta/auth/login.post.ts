import { z } from "zod"
import { useDB } from "../../../db/db"

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
  const db = useDB(e)
  const passHash = await hashPassword(bodyData.data.pass)

  if (await db.checkLoginBeta(bodyData.data.uname, passHash)) {
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
