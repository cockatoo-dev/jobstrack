import { z } from "zod"
import { addUpdate, createJob, getUserJobs } from "~/server/db/db"

const bodySchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string(),
  hasApplied: z.boolean(),
  applicationNotes: z.string(),
  timestamp: z.number(),
  dayTimestamp: z.number()
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
    bodyData.data.jobTitle === "" ||
    (!Number.isInteger(bodyData.data.dayTimestamp))
  ) {
    throw createError({
      status: 400,
      message: "Some required fields are empty,"
    })
  } else if (
    bodyData.data.companyName.length > 100 ||
    bodyData.data.jobTitle.length > 100 ||
    bodyData.data.jobDescription.length > 10000 ||
    bodyData.data.applicationNotes.length > 1000
  ) {
    throw createError({
      status: 400,
      message: "Text in some fields is too long."
    })
  }
  
  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))

  const userJobs = await getUserJobs(userId)
  if (userJobs.length > limits.JOB_LIMIT) {
    throw createError({
      status: 400,
      message: "User's job limit reached."
    })
  }
  
  const checkedTime = getCheckedTime(bodyData.data.timestamp)
  const checkedDay = getCheckedDay(bodyData.data.dayTimestamp)
  let jobId = ""
  
  if (bodyData.data.hasApplied) {
    jobId = await createJob(
      userId,
      bodyData.data.companyName,
      bodyData.data.jobTitle,
      bodyData.data.jobDescription,
    )
    await addUpdate(
      jobId,
      updateTypes.APPLICATION_SENT,
      checkedTime,
      checkedDay,
      bodyData.data.applicationNotes
    )
  } else {
    jobId = await createJob(
      userId,
      bodyData.data.companyName,
      bodyData.data.jobTitle,
      bodyData.data.jobDescription,
    )
  }
  return {jobId}
})
