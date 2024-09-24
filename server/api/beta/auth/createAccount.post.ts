import { z } from 'zod'
import { createUserBeta } from '../../../db/db'
import { createToken, hashPassword, TOKEN_COOKIE, TOKEN_EXPIRY } from '../../../utils/utils'

const bodySchema = z.object({
  uname: z.string(),
  pass: z.string(),
  confirmPass: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, body => bodySchema.safeParse(body))

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

  const passHash = await hashPassword(bodyData.data.pass)
  if (!(await createUserBeta(bodyData.data.uname, passHash))) {
    throw createError({
      status: 400,
      message: "Username unavailable. Please try a differnt username."
    })
  }
  
  setCookie(e, TOKEN_COOKIE, await createToken(bodyData.data.uname), {
    httpOnly: true,
    maxAge: TOKEN_EXPIRY
  })

})
