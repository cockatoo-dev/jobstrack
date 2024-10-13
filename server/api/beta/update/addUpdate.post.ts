import { z } from "zod"
import { addUpdate, getJobData, setJobLastUpdate } from "~/server/db/db"

const bodySchema = z.object({
  jobId: z.string(),
  updateType: z.string(),
  isFuture: z.boolean(),
  updateTime: z.number(),
  updateNotes: z.string()
})

const isValidUpdate = (lastUpdate: string, newUpdate: string) => {
  if (lastUpdate === updateTypes.ACCEPT_OFFER) {
    return false
  } else if (
    lastUpdate === updateTypes.APPLICATION_SENT ||
    lastUpdate === updateTypes.ONLINE_ASSESS ||
    lastUpdate === updateTypes.TAKE_HOME ||
    lastUpdate === updateTypes.INTERVIEW ||
    lastUpdate === updateTypes.TECH_INTERVIEW ||
    lastUpdate === updateTypes.BEHAVE_INTERVIEW ||
    lastUpdate === updateTypes.ASSESS_CENTER ||
    lastUpdate === updateTypes.FINAL_INTERVIEW
  ) {
    return (
      newUpdate !== updateTypes.NO_APPLICATION && 
      newUpdate !== updateTypes.APPLICATION_SENT
    )
  } else if (lastUpdate === updateTypes.RECEIVE_OFFER) {
    return (
      newUpdate === updateTypes.ACCEPT_OFFER ||
      newUpdate === updateTypes.DECLINE_OFFER ||
      newUpdate === updateTypes.REJECT ||
      newUpdate === updateTypes.WAITLIST
    )
  } else {
    return newUpdate !== updateTypes.NO_APPLICATION
  }
}

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, b => bodySchema.safeParse(b))
  if (!bodyData.success) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  if (
    bodyData.data.jobId === "" || 
    bodyData.data.updateType === "" ||
    (!Number.isInteger(bodyData.data.updateTime))
  ) {
    throw createError({
      status: 400,
      message: "Some required fields are empty."
    })
  }

  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))

  let checkedTime = 0

  if (bodyData.data.isFuture && (Date.now() - bodyData.data.updateTime < 86400000)) {
    checkedTime = bodyData.data.updateTime
  } else if (checkTime(bodyData.data.updateTime)) {
    checkedTime = bodyData.data.updateTime
  } else {
    checkedTime = dayTimestamp()
  }

  const jobData = await getJobData(bodyData.data.jobId, userId)

  if (jobData.length === 1) {
    if (isValidUpdate(jobData[0].lastUpdateType, bodyData.data.updateType)) {
      await addUpdate(
        bodyData.data.jobId, 
        bodyData.data.updateType, 
        checkedTime,
        bodyData.data.updateNotes
      )
      await setJobLastUpdate(
        bodyData.data.jobId,
        userId,
        bodyData.data.updateType,
        checkedTime
      )
    } else {
      throw createError({
        status: 400,
        message: "Invalid update type for this job."
      })
    }
  } else {
    throw createError({
      status: 400,
      message: "Unknown job ID."
    })
  }
})