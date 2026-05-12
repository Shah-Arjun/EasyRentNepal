const VALID_ROLES = ['tenant', 'owner']

export const normalizeRole = (role) => {
  if (Array.isArray(role)) {
    return role.find(item => VALID_ROLES.includes(item)) || role[0] || 'tenant'
  }

  return VALID_ROLES.includes(role) ? role : 'tenant'
}

export const normalizeRoles = (role) => {
  if (Array.isArray(role)) {
    return [...new Set(role.filter(item => VALID_ROLES.includes(item)))]
  }

  return [normalizeRole(role)]
}

export const getActiveRole = (user) => {
  return normalizeRole(user?.currentActiveRole || user?.role)
}

export const hasRole = (user, role) => {
  return normalizeRoles(user?.role).includes(role)
}
