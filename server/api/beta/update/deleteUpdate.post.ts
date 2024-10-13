import { z } from "zod"
import { checkJobOwner, deleteUpdate, getJobById, setJobLastUpdate } from "~/server/db/db"

const bodySchema = z.object({
  jobId: z.string(),
  updateId: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyData = await readValidatedBody(e, b => bodySchema.safeParse(b))
  if (!bodyData.success) {
    throw createError({
      status: 400,
      message: "Invalid data types."
    })
  }

  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))

  const jobData = await getJobById(bodyData.data.jobId, userId)
  if (jobData.length > 0) {
    const del = await deleteUpdate(bodyData.data.jobId, bodyData.data.updateId)
    if (del.length < 1) {
      throw createError({
        status: 400,
        message: "Unknown update ID."
      })
    }

    if (jobData.length === 1) {
      await setJobLastUpdate(
        bodyData.data.jobId,
        userId,
        updateTypes.NO_APPLICATION,
        -1
      )
    } else {
      await setJobLastUpdate(
        bodyData.data.jobId,
        userId,
        jobData[1].updateType || updateTypes.NO_APPLICATION,
        jobData[1].updateTime || -1
      )
    }
  } else {
    throw createError({
      status: 400,
      message: "Unknown job ID."
    })
  }
  
  if (await checkJobOwner(bodyData.data.jobId, userId)) {
    const del = await deleteUpdate(bodyData.data.jobId, bodyData.data.updateId)

    if (del.length < 1) {
      throw createError({
        status: 400,
        message: "Unknown update ID."
      })
    }
  }
  
  
})