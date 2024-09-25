import { z } from "zod"
import { getJobById } from "~/server/db/db"
import { checkBetaToken, type updateItem } from "~/server/utils/utils"

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
    updates: [] as updateItem[]
  }

  for (const item of dbData) {
    result.updates.push({
      updateId: item.updateId,
      updateType: item.updateType,
      updateTime: item.updateTime
    })
  }

  return result
})