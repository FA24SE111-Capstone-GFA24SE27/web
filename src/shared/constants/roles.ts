export const roles = {
  STUDENT: 'STUDENT',
  ACADEMIC_COUNSELOR: 'ACADEMIC_COUNSELOR',
  NON_ACADEMIC_COUNSELOR: 'NON_ACADEMIC_COUNSELOR',
  SUPPORT_STAFF: 'SUPPORT_STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMINISTRATOR',
}

export type Role = keyof typeof roles