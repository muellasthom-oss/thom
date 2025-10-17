import db from '../config/database.js'

export const run = (sql, params = {}) => {
  const stmt = db.prepare(sql)
  return stmt.run(params)
}

export const get = (sql, params = {}) => {
  const stmt = db.prepare(sql)
  return stmt.get(params)
}

export const all = (sql, params = {}) => {
  const stmt = db.prepare(sql)
  return stmt.all(params)
}

export const transaction = (fn) => db.transaction(fn)

export default {
  run,
  get,
  all,
  transaction
}
