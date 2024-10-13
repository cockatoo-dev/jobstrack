import { z } from "zod"
import { getJobById, getUserInfo } from "~/server/db/db"
import { checkBetaToken, checkRemind, type updateItem } from "~/server/utils/serverUtils"

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

  const dbData = await getJobById(queryData.data.jobId, userId)
  if (dbData.length === 0) {
    throw createError({
      status: 400,
      message: "Invalid job ID."
    })
  }
  const result = {
    companyName: dbData[0].companyName,
    jobTitle: dbData[0].jobTitle,
    jobDescription: dbData[0].jobDescription,
    dismissRemind: dbData[0].dismissRemind,
    updates: [] as updateItem[]
  }

  for (const item of dbData) {
    result.updates.push({
      updateId: item.updateId == null ?  "" : item.updateId,
      updateType: item.updateType == null ? "" : item.updateType,
      updateTime: item.updateTime == null ? -1 : item.updateTime
    })
  }

  if (result.updates[0].updateTime > Date.now()) {
    isFuture = true
  } else if (result.dismissRemind) {
    isRemind = false
  } else if (checkRemind(
    result.updates[0].updateType,
    result.updates[0].updateTime,
    userInfo.remindDays,
    userInfo.remindOfferDays
  )) {
    isRemind = true
  }

  return {
    timestamp: Date.now(),
    isFuture,
    isRemind,
    ...result
  }
})