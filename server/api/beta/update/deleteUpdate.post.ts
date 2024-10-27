import { z } from "zod"
import { checkJobOwner, deleteUpdate } from "~/server/db/db"

const bodySchema = z.object({
  jobId: z.string(),
  updateId: z.string()
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

  if (await checkJobOwner(bodyData.data.jobId, userId)) {
    const del = await deleteUpdate(bodyData.data.jobId, bodyData.data.updateId)
    if (del.length < 1) {
      throw createError({
        status: 400,
        message: "Unknown update ID."
      })
    }
  } else {
    throw createError({
      status: 400,
      message: "Unknown job ID."
    })
  }
})
