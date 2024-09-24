import { z } from "zod"
import { addUpdateBeta, createJobBeta } from "~/server/db/db"

const bodySchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string(),
  hasApplied: z.boolean(),
  dayTimestamp: z.number()
})

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, body => bodySchema.safeParse(body))
  if (!bodyData.success) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  if (
    bodyData.data.companyName === "" || 
    bodyData.data.jobTitle === "" ||
    (!Number.isInteger(bodyData.data.dayTimestamp))
  ) {
    throw createError({
      status: 400,
      message: "Some required fields are empty,"
    })
  }
  
  const uname = await checkToken(getCookie(e, TOKEN_COOKIE))
  const time = await processTime(bodyData.data.dayTimestamp, uname)
  let jobId: string = ""

  console.log(uname)
  
  if (bodyData.data.hasApplied) {
    jobId = await createJobBeta(
      uname,
      bodyData.data.companyName,
      bodyData.data.jobTitle,
      bodyData.data.jobDescription,
      updateTypes.APPLICATION_SENT,
      time
    )
    console.log(jobId)
    await addUpdateBeta(
      jobId,
      updateTypes.APPLICATION_SENT,
      time
    )
  } else {
    jobId = await createJobBeta(
      uname,
      bodyData.data.companyName,
      bodyData.data.jobTitle,
      bodyData.data.jobDescription,
      updateTypes.NO_APPLICATION,
      1
    )
  }
  return {jobId}
})
