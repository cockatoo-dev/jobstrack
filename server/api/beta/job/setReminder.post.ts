import { z } from "zod"
import { checkJobOwner, setJobReminder } from "~/server/db/db"

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

  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))

  if (await checkJobOwner(bodyData.data.jobId, userId)) {
    await setJobReminder(
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