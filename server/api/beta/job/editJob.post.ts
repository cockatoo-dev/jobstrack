import { z } from "zod"
import { checkJobOwner, editJob } from "~/server/db/db"

const bodySchema = z.object({
  jobId: z.string(),
  companyName: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string()
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
    bodyData.data.companyName === "" || 
    bodyData.data.jobTitle === ""
  ) {
    throw createError({
      status: 400,
      message: "Some required fields are empty,"
    })
  }

  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))

  if (await checkJobOwner(bodyData.data.jobId, userId)) {
    await editJob(
      bodyData.data.jobId,
      userId,
      bodyData.data.companyName,
      bodyData.data.jobTitle,
      bodyData.data.jobDescription
    )
  } else {
    throw createError({
      status: 400,
      message: "Unknown job ID."
    })
  }
})