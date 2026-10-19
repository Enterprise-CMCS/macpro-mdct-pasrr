export enum UserRoles {
  ADMIN = "mdctpasrr-bor", // "MDCT PASRR Business Owner Representative"
  APPROVER = "mdctpasrr-approver", // "MDCT PASRR Approver"
  HELP_DESK = "mdctpasrr-help-desk", // "MDCT PASRR Help Desk"
  INTERNAL = "mdctpasrr-internal-user", // "MDCT PASRR Internal User"
  STATE_USER = "mdctpasrr-state-user", // "MDCT PASRR State User",
  PROJECT_OFFICER = "mdctpasrr-project-officer", // "MDCT PASRR Project Officer"
}
export const isUserRole = (role: string): role is UserRoles => {
  return Object.values(UserRoles).includes(role as UserRoles);
};
