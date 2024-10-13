import { z } from "zod"
import { editUserSettings } from "~/server/db/db"

const bodySchema = z.object({
  remindDays: z.number(),
  remindOfferDays: z.number()
})

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, b => bodySchema.safeParse(b))
  if (!bodyData.success) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  } else if (!(
    Number.isInteger(bodyData.data.remindDays) &&
    Number.isInteger(bodyData.data.remindOfferDays)
  )) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  await editUserSettings(
    userId, 
    bodyData.data.remindDays, 
    bodyData.data.remindOfferDays
  )
})