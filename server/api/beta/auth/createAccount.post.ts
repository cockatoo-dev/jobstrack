import { z } from 'zod'
import { useDB } from '../../../db/db'

const bodySchema = z.object({
  uname: z.string(),
  pass: z.string(),
  confirmPass: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, b => bodySchema.safeParse(b))

  if (!bodyData.success) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  if (
    bodyData.data.uname === "" ||
    bodyData.data.pass === "" ||
    bodyData.data.confirmPass === ""
  ) {
    throw createError({
      status: 400,
      message:"Some required fields are empty."
    })
  }

  if (bodyData.data.pass !== bodyData.data.confirmPass) {
    throw createError({
      status: 400,
      message: "Passwords do not match."
    })
  }

  const db = useDB(e)

  const passHash = await hashPassword(bodyData.data.pass)
  if (!(await db.createUserBeta(bodyData.data.uname, passHash))) {
    throw createError({
      status: 400,
      message: "Username unavailable. Please try a differnt username."
    })
  }
  
  setCookie(e, TOKEN_COOKIE, await createBetaToken(bodyData.data.uname), {
    httpOnly: true,
    maxAge: TOKEN_EXPIRY
  })

})
