import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  jobId: z.string(),
  dismissRemind: z.boolean()
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
  const userId = await checkBetaToken(db, getCookie(e, TOKEN_COOKIE))

  if (await db.checkJobOwner(bodyData.data.jobId, userId)) {
    await db.setJobReminder(
      bodyData.data.jobId,
      userId,
      bodyData.data.dismissRemind
    )
  } else {
    throw createError({
      status: 400,
      message: "Unknown job ID."
    })
  }
})