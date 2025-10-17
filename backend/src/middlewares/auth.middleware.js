import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  const token = header.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (header) {
    const token = header.replace('Bearer ', '')
    try {
      const payload = jwt.verify(token, JWT_SECRET)
      req.user = payload
    } catch (error) {
      console.warn('Invalid optional token', error.message)
    }
  }
  next()
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}
