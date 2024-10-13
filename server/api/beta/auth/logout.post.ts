import { TOKEN_COOKIE } from "~/server/utils/serverUtils"

export default defineEventHandler((e) => {
  deleteCookie(e, TOKEN_COOKIE)
})
