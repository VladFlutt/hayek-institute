import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'translator' | 'student'

export const hasRole = (req: PayloadRequest, ...roles: Role[]): boolean => {
  const user = req.user as { role?: Role; collection?: string } | null
  return Boolean(user && user.collection === 'users' && user.role && roles.includes(user.role))
}

export const isStaff = (req: PayloadRequest) => hasRole(req, 'admin', 'editor', 'translator')

export const anyone: Access = () => true
export const adminOnly: Access = ({ req }) => hasRole(req, 'admin')
export const staffOnly: Access = ({ req }) => isStaff(req)
export const editors: Access = ({ req }) => hasRole(req, 'admin', 'editor')

/** Published content for everyone, drafts for staff. */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaff(req)) return true
  return { _status: { equals: 'published' } }
}

export const adminField: FieldAccess = ({ req }) => hasRole(req, 'admin')
