import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  remindDays: z.number(),
  remindOfferDays: z.number(),
  remindFuture: z.boolean()
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

  const db = useDB(e)
  const userId = await checkBetaToken(db, getCookie(e, TOKEN_COOKIE))
  await db.editUserSettings(
    userId, 
    bodyData.data.remindDays, 
    bodyData.data.remindOfferDays,
    bodyData.data.remindFuture
  )
})