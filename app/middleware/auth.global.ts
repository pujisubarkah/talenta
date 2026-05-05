export default defineNuxtRouteMiddleware((to) => {
  const authUser = useCookie<string | null>('auth_user')
  const isLoggedIn = Boolean(authUser.value)

  if (!isLoggedIn && to.path !== '/') {
    return navigateTo('/')
  }

  if (isLoggedIn && to.path === '/') {
    return navigateTo('/home')
  }
})
