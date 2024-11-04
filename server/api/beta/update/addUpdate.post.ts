import { z } from "zod"
import { useDB } from "~/server/db/db"

const bodySchema = z.object({
  jobId: z.string(),
  hasDismissRemind: z.boolean(),
  updateType: z.string(),
  isFuture: z.boolean(),
  updateTime: z.number(),
  updateDay: z.number(),
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
    lastUpdate === updateTypes.PHONE_INTERVIEW ||
    lastUpdate === updateTypes.VIRTUAL_INTERVIEW ||
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

const isValidFuture = (updateType: string) => {
  if (
    updateType === updateTypes.TAKE_HOME ||
    updateType === updateTypes.INTERVIEW ||
    updateType === updateTypes.PHONE_INTERVIEW ||
    updateType === updateTypes.VIRTUAL_INTERVIEW ||
    updateType === updateTypes.TECH_INTERVIEW ||
    updateType === updateTypes.BEHAVE_INTERVIEW ||
    updateType === updateTypes.FINAL_INTERVIEW ||
    updateType === updateTypes.ASSESS_CENTER
  ) {
    return true
  } else {
    return false
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

  if (bodyData.data.updateNotes.length > 1000) {
    throw createError({
      status: 400,
      message: "Text in some fields is too long."
    })
  }

  if (bodyData.data.isFuture && !isValidFuture(bodyData.data.updateType)) {
    throw createError({
      status: 400,
      message: "Future update time is not allowed for this update type."
    })
  }

  const db = useDB(e)
  const userId = await checkBetaToken(db, getCookie(e, TOKEN_COOKIE))

  let checkedTime = -1
  let checkedDay = -1

  if (bodyData.data.isFuture) {
    if (Date.now() - bodyData.data.updateTime > DAY) {
      checkedTime = Date.now()
    } else {
      checkedTime = bodyData.data.updateTime
    }
    if (dayTimestamp() - bodyData.data.updateDay > DAY) {
      checkedDay = dayTimestamp()
    } else {
      checkedDay = bodyData.data.updateDay
    }
  } else {
    checkedTime = getCheckedTime(bodyData.data.updateTime)
    checkedDay = getCheckedDay(bodyData.data.updateDay)
  }

  if (!await db.checkJobOwner(bodyData.data.jobId, userId)) {
    throw createError({
      status: 400,
      message: "Unknown job ID"
    })
  }

  const updatesData = await db.getJobUpdates(bodyData.data.jobId)

  for (const update of updatesData) {
    if (update.updateType === updateTypes.ACCEPT_OFFER) {
      throw createError({
        status: 400,
        message: "Invalid update type for this job."
      })
    }
  }
  
  if (updatesData.length >= limits.UPDATE_LIMIT) {
    await db.deleteUpdate(bodyData.data.jobId, updatesData[9].updateId)
  }

  if (updatesData.length >= 1) {
    if (isValidUpdate(updatesData[0].updateType, bodyData.data.updateType)) {
      await db.addUpdate(
        bodyData.data.jobId, 
        bodyData.data.updateType, 
        checkedTime,
        checkedDay,
        bodyData.data.updateNotes
      )
      
    } else {
      throw createError({
        status: 400,
        message: "Invalid update type for this job."
      })
    }
  } else {
    if (isValidUpdate(updateTypes.NO_APPLICATION, bodyData.data.updateType)) {
      await db.addUpdate(
        bodyData.data.jobId, 
        bodyData.data.updateType, 
        checkedTime,
        checkedDay,
        bodyData.data.updateNotes
      )
      if (bodyData.data.hasDismissRemind) {
        await db.setJobReminder(bodyData.data.jobId, userId, false)
      }
    } else {
      throw createError({
        status: 400,
        message: "Invalid update type for this job."
      })
    }
  }
})