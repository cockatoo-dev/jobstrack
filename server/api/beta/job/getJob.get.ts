import { z } from "zod"
import { getJobData, getUserInfo } from "~/server/db/db"

const querySchema = z.object({
  jobId: z.string()
})

export default defineEventHandler(async (e) => {
  const queryData = await getValidatedQuery(e, query => querySchema.safeParse(query))
  if (queryData.error) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  const userInfo = await getUserInfo(userId)

  let isFuture = false
  let isRemind = false
  let futureCount = 0
  let hasAcceptOffer = false

  const dbData = await getJobData(queryData.data.jobId, userId)
  if (!dbData) {
    throw createError({
      status: 400,
      message: "Invalid job ID."
    })
  }
  const result = {
    companyName: dbData.companyName,
    jobTitle: dbData.jobTitle,
    jobDescription: dbData.jobDescription,
    dismissRemind: dbData.dismissRemind,
    updates: dbData.updates
  }

  if (result.updates.length === 0) {
    isRemind = !result.dismissRemind
  } else {
    for (const update of dbData.updates) {
      if (update.updateType === updateTypes.ACCEPT_OFFER) {
        hasAcceptOffer = true
      } else if (update.updateTime > Date.now()) {
        futureCount += 1
      }
    }
  }
  
  if (futureCount > 0 && !hasAcceptOffer) {
    isFuture = userInfo.remindFuture
  } else if (result.dismissRemind) {
    isRemind = false
  } else if (result.updates.length === 0) {
    isRemind = !result.dismissRemind
  } else if (checkRemind(
    result.updates[0].updateType,
    result.updates[0].updateTime,
    userInfo.remindDays,
    userInfo.remindOfferDays
  ) && !hasAcceptOffer) {
    isRemind = !result.dismissRemind
  }

  return {
    timestamp: Date.now(),
    isFuture,
    isRemind,
    futureCount,
    hasAcceptOffer,
    ...result
  }
})