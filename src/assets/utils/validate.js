/**
 * 邮箱
 * @param {string} email
 * @returns {Boolean}
 */
export function isEmail(email) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^1[0-9]{10}$/.test(s)
}
