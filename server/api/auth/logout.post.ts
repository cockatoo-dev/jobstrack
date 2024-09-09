import { TOKEN_COOKIE } from "~/server/utils/utils"

export default defineEventHandler((e) => {
  deleteCookie(e, TOKEN_COOKIE)
})
