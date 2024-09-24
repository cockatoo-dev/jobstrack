# A few shorthands for common commands used during development
#
# To add these to your terminal:
#
# $ source .aliases.sh
#

alias prepare='npx nuxt prepare'
alias dev='npx nuxt dev'
alias build='npx nuxt build'
alias preview='npx nuxt build && npx nuxt preview'
alias generatedb='npx drizzle-kit generate'
alias updatedb='npx drizzle-kit generate && npx drizzle-kit migrate'
