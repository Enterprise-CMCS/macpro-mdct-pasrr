import { User } from "../types/types";
import {
  StateAbbr,
  UserRoles,
  ZipRequestBody,
  ZipRequestTypes,
} from "@pasrr/shared";

/** These roles are allowed to read data for any state */
const statelessRoles = [
  UserRoles.ADMIN,
  UserRoles.APPROVER,
  UserRoles.HELP_DESK,
  UserRoles.INTERNAL,
  UserRoles.PROJECT_OFFICER,
];

const adminRoles = [
  UserRoles.ADMIN,
  UserRoles.APPROVER,
  UserRoles.PROJECT_OFFICER,
];

export const canReadState = (user: User, state: StateAbbr) => {
  if (statelessRoles.includes(user.role)) {
    return true;
  }
  if (user.role == UserRoles.STATE_USER && user.state === state) {
    return true;
  }
  return false;
};

export const canWriteState = (user: User, state: StateAbbr) => {
  // TODO: For the first year, Admins will be entering data manually for the states
  // Remove the bottom line to stop allowing Admins to create/edit reports.
  if (adminRoles.includes(user.role)) return true;

  if (user.role == UserRoles.STATE_USER && user.state === state) {
    return true;
  }
  return false;
};

export const canWriteInitiatives = (user: User) => {
  return adminRoles.includes(user.role);
};

export const canWriteBanner = (user: User) => {
  return user.role == UserRoles.ADMIN;
};

export const canReleaseReport = (user: User) => {
  return adminRoles.includes(user.role);
};

export const canWriteComments = (user: User, state: StateAbbr) => {
  if (adminRoles.includes(user.role)) return true;

  if (user.role == UserRoles.STATE_USER && user.state === state) {
    return true;
  }
  return false;
};

export const canReadInternalComments = (user: User) => {
  return adminRoles.includes(user.role);
};

export const canReadAnyReport = (user: User) => {
  return statelessRoles.includes(user.role);
};

export const canModifyNotificationRecipients = (user: User) => {
  return user.role === UserRoles.APPROVER;
};

export const canRequestZip = (body: ZipRequestBody, user: User) => {
  // TODO: add authorization rules for any additional PASRR zip request types
  if (body.type === ZipRequestTypes.REPORT) {
    if (user.role === UserRoles.STATE_USER) {
      return body.report?.state === user.state;
    } else {
      return true;
    }
  }
  return false;
};
