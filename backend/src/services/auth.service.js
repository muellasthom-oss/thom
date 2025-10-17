import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authenticator } from 'otplib'
import { v4 as uuid } from 'uuid'
import { get, run } from '../utils/db-helpers.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const TOKEN_EXPIRATION = '12h'

export const createUser = ({ name, email, password, role = 'customer' }) => {
  const existing = get('SELECT * FROM users WHERE email = :email', { email })
  if (existing) {
    throw new Error('Email already registered')
  }
  const passwordHash = bcrypt.hashSync(password, 10)
  const id = uuid()
  run(
    `INSERT INTO users (id, name, email, password_hash, role)
     VALUES (:id, :name, :email, :password_hash, :role)`,
    { id, name, email, password_hash: passwordHash, role }
  )
  return get('SELECT id, name, email, role, created_at FROM users WHERE id = :id', { id })
}

export const authenticateUser = ({ email, password }) => {
  const user = get('SELECT * FROM users WHERE email = :email', { email })
  if (!user) {
    throw new Error('Invalid credentials')
  }
  const valid = bcrypt.compareSync(password, user.password_hash)
  if (!valid) {
    throw new Error('Invalid credentials')
  }
  const tokenPayload = { id: user.id, role: user.role, email: user.email, name: user.name }
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION })
  return {
    token,
    requires2FA: Boolean(user.two_factor_secret),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

export const enableTwoFactor = (userId) => {
  const secret = authenticator.generateSecret()
  run('UPDATE users SET two_factor_secret = :secret WHERE id = :id', { id: userId, secret })
  const otpauth = authenticator.keyuri(userId, 'Howstore Admin', secret)
  return { secret, otpauth }
}

export const verifyTwoFactor = (userId, token) => {
  const user = get('SELECT two_factor_secret FROM users WHERE id = :id', { id: userId })
  if (!user || !user.two_factor_secret) {
    throw new Error('2FA not enabled')
  }
  const verified = authenticator.verify({ token, secret: user.two_factor_secret })
  if (!verified) {
    throw new Error('Invalid 2FA code')
  }
  const jwtToken = jwt.sign({ id: userId, twoFactor: true }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION })
  return { token: jwtToken }
}

export const changePassword = (userId, password) => {
  const passwordHash = bcrypt.hashSync(password, 10)
  run('UPDATE users SET password_hash = :password_hash WHERE id = :id', { id: userId, password_hash: passwordHash })
}
