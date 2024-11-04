import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  jobId: z.string(),
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

  const del = await db.deleteJob(bodyData.data.jobId, userId)

  if (del.length < 1) {
    throw createError({
      status: 400,
      message: "Unknown job ID."
    })
  }
})