import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

export function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (err) {
    return null
  }
}

export function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers?.authorization
  if (!header) return res.status(401).json({ success: false, message: 'No token' })
  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: 'No token' })
  const data = verifyToken(token)
  if (!data) return res.status(401).json({ success: false, message: 'Invalid token' })
  ;(req as any).userId = data.userId
  next()
}
