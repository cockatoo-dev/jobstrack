import { z } from "zod"
import { changePasswordBeta, checkLoginBeta } from "~/server/db/db"

const bodySchema = z.object({
  oldPass: z.string(),
  newPass: z.string(),
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
    bodyData.data.newPass === "" ||
    bodyData.data.confirmPass === ""
  ) {
    throw createError({
      status: 400,
      message:"Some required fields are empty."
    })
  }

  if (bodyData.data.newPass !== bodyData.data.confirmPass) {
    throw createError({
      status: 400,
      message: "New passwords do not match."
    })
  }

  
  const uname = await checkBetaTokenUname(getCookie(e, TOKEN_COOKIE))
  const oldPassHash = await hashPassword(bodyData.data.oldPass)
  if (!(await checkLoginBeta(uname, oldPassHash))) {
    throw createError({
      status: 400,
      message: "Old password is incorrect."
    })
  }
  
  const newPassHash = await hashPassword(bodyData.data.newPass)
  await changePasswordBeta(uname, newPassHash)
  setCookie(e, TOKEN_COOKIE, await createBetaToken(uname), {
    httpOnly: true,
    maxAge: TOKEN_EXPIRY
  })
})