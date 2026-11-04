import type { FieldAccess, PayloadRequest } from 'payload'
import { isStaff } from './roles'

type Ref = number | string | { id: number | string } | null | undefined
const idOf = (r: Ref) => (r && typeof r === 'object' ? r.id : r)

type UserLike = {
  collection?: string
  role?: string
  allAccess?: boolean | null
  unlockedCourses?: Ref[] | null
} | null

export const userHasCourse = (user: UserLike, courseRef: Ref): boolean => {
  if (!user || user.collection !== 'users') return false
  if (user.role && user.role !== 'student') return true
  if (user.allAccess) return true
  const courseId = idOf(courseRef)
  return (user.unlockedCourses ?? []).some((c) => String(idOf(c)) === String(courseId))
}

export const canOpenLesson = (
  user: UserLike,
  lesson: { free?: boolean | null; course?: Ref } | null | undefined,
): boolean => {
  if (!lesson) return false
  if (lesson.free) return true
  return userHasCourse(user, lesson.course)
}

/** Field-level guard: lesson content is visible only if the lesson is free or unlocked. */
export const lessonContentAccess: FieldAccess = ({ req, doc }) => {
  if (isStaff(req as PayloadRequest)) return true
  // In list/queries without doc we stay safe
  if (!doc) return false
  return canOpenLesson(req.user as UserLike, doc as { free?: boolean; course?: Ref })
}
