const jwt = require('jsonwebtoken')


const COOKIE_NAME = 'auth_token'
const VALID_ROLES = ['tenant', 'owner']

const normalizeRole = (role) => {
    if (Array.isArray(role)) {
        return role.find(item => VALID_ROLES.includes(item)) || role[0] || 'tenant'
    }

    return VALID_ROLES.includes(role) ? role : 'tenant'
}

const normalizeRoles = (role) => {
    if (Array.isArray(role)) {
        return role.filter(item => VALID_ROLES.includes(item))
    }

    return [normalizeRole(role)]
}

const resolveActiveRole = (user, preferredRole) => {
    const availableRoles = normalizeRoles(user?.role || user?.roles)

    if (preferredRole && availableRoles.includes(preferredRole)) {
        return preferredRole
    }

    if (availableRoles.includes('owner')) {
        return 'owner'
    }

    return availableRoles[0] || 'tenant'
}

const buildUserResponse = (user, activeRole) => ({
    id: user?._id || user?.id,
    name: user?.name,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    location: user?.location,
    profileImage: user?.profileImage,
    role: normalizeRoles(user?.role || activeRole),
    currentActiveRole: activeRole,
    isOtpVerified: user?.isOtpVerified,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
})

const cookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production'
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1 * 60 * 60 * 1000,
        path: '/',
    }
}

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE || '1h',
        algorithm: 'HS256',
    })
}

const sendUserTokenCookie = (res, statusCode, message, user, preferredRole) => {
    const activeRole = resolveActiveRole(user, preferredRole)
    const token = generateToken(user._id || user.id, activeRole)

    res.status(statusCode)
        .cookie(COOKIE_NAME, token, cookieOptions())
        .json({
            success: true,
            message,
            user: buildUserResponse(user, activeRole),
        })
}

const sendOwnerTokenCookie = (res, statusCode, message, user, preferredRole = 'owner') => {
    const activeRole = resolveActiveRole(user, preferredRole)
    const token = generateToken(user._id || user.id, activeRole)

    res.status(statusCode)
        .cookie(COOKIE_NAME, token, cookieOptions())
        .json({
            success: true,
            message,
            user: buildUserResponse(user, activeRole),
        })
}

const sendToggleTokenCookie = (res, statusCode, message, user, preferredRole) => {
    const activeRole = resolveActiveRole(user, preferredRole)
    const token = generateToken(user._id || user.id, activeRole)

    res.status(statusCode)
        .cookie(COOKIE_NAME, token, cookieOptions())
        .json({
            success: true,
            message,
            user: buildUserResponse(user, activeRole),
        })
}

const destroyCookie = (res) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            ...cookieOptions(),
            expires: new Date(0),
            maxAge: 0,
        })
        return true
    } catch (error) {
        console.error('Error clearing cookie:', error.message)
        return false
    }
}

module.exports = {
    COOKIE_NAME,
    cookieOptions,
    generateToken,
    normalizeRole,
    normalizeRoles,
    resolveActiveRole,
    buildUserResponse,
    sendUserTokenCookie,
    sendOwnerTokenCookie,
    sendToggleTokenCookie,
    destroyCookie,
}