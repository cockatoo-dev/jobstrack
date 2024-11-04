import { z } from "zod"
import { useDB } from "~/server/db/db"

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

  const db = useDB(e)
  const userId = await checkBetaToken(db, getCookie(e, TOKEN_COOKIE))

  if (await db.checkJobOwner(bodyData.data.jobId, userId)) {
    await db.editJob(
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