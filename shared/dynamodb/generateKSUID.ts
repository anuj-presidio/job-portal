import crypto from 'crypto'
import KSUID from 'ksuid'

export const generateKSUID = (timestamp): string => {
  const payload = crypto.randomBytes(16)
  return KSUID.fromParts(timestamp.getTime(), payload).string
}
