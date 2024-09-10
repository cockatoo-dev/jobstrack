import { z } from "zod"
import { getJobByIdBeta } from "~/server/db/db"
import type { updateItem } from "~/server/utils/utils"

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

  const uname = await checkToken(getCookie(e, TOKEN_COOKIE))

  const dbData = await getJobByIdBeta(queryData.data.jobId, uname)
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