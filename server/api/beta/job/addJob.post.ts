import { z } from "zod"
import { addUpdate, createJob } from "~/server/db/db"
import { checkBetaToken } from "~/server/utils/utils"

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
  
  const uname = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  // const time = await processTime(bodyData.data.dayTimestamp, uname)
  let jobId = ""

  console.log(uname)
  
  if (bodyData.data.hasApplied) {
    jobId = await createJob(
      uname,
      bodyData.data.companyName,
      bodyData.data.jobTitle,
      bodyData.data.jobDescription,
      updateTypes.APPLICATION_SENT,
      bodyData.data.dayTimestamp
    )
    console.log(jobId)
    await addUpdate(
      jobId,
      updateTypes.APPLICATION_SENT,
      bodyData.data.dayTimestamp
    )
  } else {
    jobId = await createJob(
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
