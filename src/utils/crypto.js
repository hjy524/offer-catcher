/**
 * 密码加密工具 - 使用 Web Crypto API (SHA-256)
 */

/**
 * 将字符串转换为 ArrayBuffer
 */
function stringToBuffer(str) {
  return new TextEncoder().encode(str)
}

/**
 * 将 ArrayBuffer 转换为十六进制字符串
 */
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 使用 SHA-256 哈希密码
 */
export async function hashPassword(password) {
  const buffer = stringToBuffer(password)
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  return bufferToHex(hash)
}

/**
 * 验证密码是否匹配
 */
export async function verifyPassword(password, hash) {
  const computedHash = await hashPassword(password)
  return computedHash === hash
}
