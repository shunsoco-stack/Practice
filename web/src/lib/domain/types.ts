export type UserStatus = "active" | "suspended" | "deleted";
export type KycStatus = "pending" | "verified" | "rejected";
export type KycFlowStatus =
  | "not_started"
  | "in_progress"
  | "under_review"
  | "verified"
  | "rejected";
export type Gender = "male" | "female" | "other" | "not_specified";
export type KycSessionStatus =
  | "in_progress"
  | "under_review"
  | "verified"
  | "rejected";
export type ProfileVisibility = "visible" | "hidden";
export type ConsentValue = "allow" | "deny" | "discuss";
export type MatchStatus = "active" | "closed";
export type ReportCategory =
  | "harassment"
  | "impersonation"
  | "scam"
  | "illegal"
  | "other";
export type ReportSeverity = "low" | "medium" | "high" | "critical";
export type ReportStatus = "open" | "investigating" | "resolved" | "rejected";

export type TermsType = "tos" | "privacy" | "community_guideline";

export interface User {
  id: string;
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender | null;
  isGenderLocked: boolean;
  isBirthDateLocked: boolean;
  region: string;
  bio: string;
  topPhotoUrl: string | null;
  subPhotoUrls: string[];
  status: UserStatus;
  kycStatus: KycStatus;
  visibility: ProfileVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentItem {
  code: string;
  value: ConsentValue;
  updatedAt: string;
}

export interface BoundaryItem {
  key: string;
  value: string;
  updatedAt: string;
}

export interface TermsVersion {
  id: string;
  type: TermsType;
  version: string;
  contentUrl: string;
  isActive: boolean;
  publishedAt: string;
}

export interface TermsConsent {
  userId: string;
  termsVersionId: string;
  consentedAt: string;
}

export interface KycSession {
  id: string;
  userId: string;
  provider: "mock" | "external";
  status: KycSessionStatus;
  returnPath: string;
  redirectUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  score: number;
  status: MatchStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  matchId: string;
  userAId: string;
  userBId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderUserId: string;
  body: string;
  sentAt: string;
}

export interface Block {
  blockerUserId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterUserId: string;
  targetUserId: string;
  conversationId?: string;
  messageId?: string;
  category: ReportCategory;
  detail: string;
  severity: ReportSeverity;
  status: ReportStatus;
  createdAt: string;
}

export interface RoleBinding {
  userId: string;
  role: "user" | "admin";
}
