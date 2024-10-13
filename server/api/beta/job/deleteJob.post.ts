import { z } from "zod"
import { deleteJob } from "~/server/db/db"

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

  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))

  const del = await deleteJob(bodyData.data.jobId, userId)

  if (del.length < 1) {
    throw createError({
      status: 400,
      message: "Unknown job ID."
    })
  }
})