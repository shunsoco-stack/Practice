import { randomUUID } from "node:crypto";
import type {
  Block,
  BoundaryItem,
  ConsentItem,
  Conversation,
  Gender,
  KycFlowStatus,
  KycSession,
  KycSessionStatus,
  KycStatus,
  Like,
  Match,
  Message,
  ProfileVisibility,
  Report,
  ReportCategory,
  ReportSeverity,
  RoleBinding,
  TermsConsent,
  TermsVersion,
  User,
} from "@/lib/domain/types";

type ProfilePatch = Partial<
  Pick<
    User,
    "nickname" | "region" | "bio" | "visibility" | "topPhotoUrl" | "subPhotoUrls"
  >
>;

interface LikeResult {
  matched: boolean;
  matchId: string | null;
}

interface MatchView {
  id: string;
  peerUserId: string;
  peerNickname: string;
  score: number;
}

interface ConversationView {
  id: string;
  matchId: string;
  peerUserId: string;
  peerNickname: string;
  lastMessage?: string;
}

interface KycSessionCreateResult {
  sessionId: string;
  status: KycSessionStatus;
  provider: KycSession["provider"];
  redirectUrl: string;
}

interface BasicProfileInput {
  nickname: string;
  gender: Gender;
  birthDate: string;
}

interface BasicProfileView {
  nickname: string;
  gender: Gender | null;
  birthDate: string;
  isGenderLocked: boolean;
  isBirthDateLocked: boolean;
  isCompleted: boolean;
}

const now = () => new Date().toISOString();
const DEFAULT_KYC_RETURN_PATH = "/kyc-status";

function isAdultByBirthDate(birthDate: string): boolean {
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) {
    return false;
  }
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  const dayDiff = today.getUTCDate() - dob.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age >= 18;
}

class InMemoryStore {
  private users = new Map<string, User>();
  private roles = new Map<string, RoleBinding["role"]>();
  private termsVersions = new Map<string, TermsVersion>();
  private termsConsents: TermsConsent[] = [];
  private kycSessions = new Map<string, KycSession>();
  private latestKycSessionByUser = new Map<string, string>();
  private consents = new Map<string, ConsentItem[]>();
  private boundaries = new Map<string, BoundaryItem[]>();
  private likes: Like[] = [];
  private matches: Match[] = [];
  private conversations: Conversation[] = [];
  private messages: Message[] = [];
  private blocks: Block[] = [];
  private reports: Report[] = [];

  constructor() {
    this.seed();
  }

  private seed(): void {
    const baseTime = now();
    const users: User[] = [
      {
        id: "u1",
        nickname: "new_user",
        birthDate: "2000-01-01",
        gender: null,
        isGenderLocked: false,
        isBirthDateLocked: false,
        region: "tokyo",
        bio: "",
        topPhotoUrl: null,
        subPhotoUrls: [],
        status: "active",
        kycStatus: "pending",
        visibility: "visible",
        createdAt: baseTime,
        updatedAt: baseTime,
      },
      {
        id: "u2",
        nickname: "mio",
        birthDate: "1994-08-02",
        gender: "female",
        isGenderLocked: true,
        isBirthDateLocked: true,
        region: "kanagawa",
        bio: "Consent first. Looking for respectful chat.",
        topPhotoUrl: null,
        subPhotoUrls: [],
        status: "active",
        kycStatus: "verified",
        visibility: "visible",
        createdAt: baseTime,
        updatedAt: baseTime,
      },
      {
        id: "u3",
        nickname: "rei",
        birthDate: "2002-02-11",
        gender: "other",
        isGenderLocked: true,
        isBirthDateLocked: true,
        region: "chiba",
        bio: "KYC pending example account.",
        topPhotoUrl: null,
        subPhotoUrls: [],
        status: "active",
        kycStatus: "pending",
        visibility: "visible",
        createdAt: baseTime,
        updatedAt: baseTime,
      },
      {
        id: "u4",
        nickname: "hana",
        birthDate: "1991-11-28",
        gender: "female",
        isGenderLocked: true,
        isBirthDateLocked: true,
        region: "saitama",
        bio: "Quiet style and transparent expectations.",
        topPhotoUrl: null,
        subPhotoUrls: [],
        status: "active",
        kycStatus: "verified",
        visibility: "visible",
        createdAt: baseTime,
        updatedAt: baseTime,
      },
      {
        id: "u_admin",
        nickname: "moderator",
        birthDate: "1990-01-01",
        gender: "not_specified",
        isGenderLocked: true,
        isBirthDateLocked: true,
        region: "tokyo",
        bio: "internal moderation account",
        topPhotoUrl: null,
        subPhotoUrls: [],
        status: "active",
        kycStatus: "verified",
        visibility: "hidden",
        createdAt: baseTime,
        updatedAt: baseTime,
      },
    ];

    for (const user of users) {
      this.users.set(user.id, user);
      this.consents.set(user.id, []);
      this.boundaries.set(user.id, []);
      this.roles.set(user.id, user.id === "u_admin" ? "admin" : "user");
    }

    const tos: TermsVersion = {
      id: "terms-tos-v1",
      type: "tos",
      version: "1.0.0",
      contentUrl: "/docs/tos-v1",
      isActive: true,
      publishedAt: baseTime,
    };
    const privacy: TermsVersion = {
      id: "terms-privacy-v1",
      type: "privacy",
      version: "1.0.0",
      contentUrl: "/docs/privacy-v1",
      isActive: true,
      publishedAt: baseTime,
    };
    const guideline: TermsVersion = {
      id: "terms-guideline-v1",
      type: "community_guideline",
      version: "1.0.0",
      contentUrl: "/docs/community-guideline-v1",
      isActive: true,
      publishedAt: baseTime,
    };

    this.termsVersions.set(tos.id, tos);
    this.termsVersions.set(privacy.id, privacy);
    this.termsVersions.set(guideline.id, guideline);

    this.termsConsents.push(
      {
        userId: "u2",
        termsVersionId: tos.id,
        consentedAt: baseTime,
      },
      {
        userId: "u2",
        termsVersionId: privacy.id,
        consentedAt: baseTime,
      },
      {
        userId: "u2",
        termsVersionId: guideline.id,
        consentedAt: baseTime,
      },
    );

    this.consents.set("u1", [
      { code: "chat_style_direct", value: "allow", updatedAt: baseTime },
      { code: "voice_call_allowed", value: "discuss", updatedAt: baseTime },
    ]);
    this.consents.set("u2", [
      { code: "chat_style_direct", value: "allow", updatedAt: baseTime },
      { code: "voice_call_allowed", value: "allow", updatedAt: baseTime },
    ]);
    this.consents.set("u4", [
      { code: "chat_style_direct", value: "deny", updatedAt: baseTime },
      { code: "voice_call_allowed", value: "deny", updatedAt: baseTime },
    ]);

    this.boundaries.set("u1", [
      { key: "first_meeting_public_place", value: "required", updatedAt: baseTime },
    ]);
    this.boundaries.set("u2", [
      { key: "photo_exchange", value: "optional", updatedAt: baseTime },
    ]);

    this.likes.push({
      id: randomUUID(),
      fromUserId: "u2",
      toUserId: "u1",
      createdAt: baseTime,
    });
  }

  getRole(userId: string): "user" | "admin" {
    return this.roles.get(userId) ?? "user";
  }

  getUser(userId: string): User {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("user_not_found");
    }
    return user;
  }

  isAdult(birthDate: string): boolean {
    return isAdultByBirthDate(birthDate);
  }

  getActiveTerms(): TermsVersion[] {
    return [...this.termsVersions.values()].filter((t) => t.isActive);
  }

  saveTermsConsent(userId: string, termsVersionId: string): void {
    this.getUser(userId);
    if (!this.termsVersions.has(termsVersionId)) {
      throw new Error("terms_version_not_found");
    }
    const exists = this.termsConsents.some(
      (c) => c.userId === userId && c.termsVersionId === termsVersionId,
    );
    if (!exists) {
      this.termsConsents.push({
        userId,
        termsVersionId,
        consentedAt: now(),
      });
    }
  }

  private sanitizeReturnPath(returnPath?: string): string {
    if (!returnPath || !returnPath.startsWith("/")) {
      return DEFAULT_KYC_RETURN_PATH;
    }
    return returnPath;
  }

  private resolveKycProvider(): KycSession["provider"] {
    if (
      process.env.KYC_PROVIDER_MODE === "external" &&
      process.env.KYC_EXTERNAL_BASE_URL
    ) {
      return "external";
    }
    return "mock";
  }

  private buildKycRedirectUrl(input: {
    provider: KycSession["provider"];
    sessionId: string;
    userId: string;
    returnPath: string;
  }): string {
    if (input.provider === "external") {
      const externalUrl = new URL(process.env.KYC_EXTERNAL_BASE_URL!);
      externalUrl.searchParams.set("session_id", input.sessionId);
      externalUrl.searchParams.set("user_id", input.userId);
      externalUrl.searchParams.set("return_path", input.returnPath);
      return externalUrl.toString();
    }
    const local = new URLSearchParams();
    local.set("sessionId", input.sessionId);
    local.set("returnPath", input.returnPath);
    return `/ekyc/mock?${local.toString()}`;
  }

  private getLatestKycSession(userId: string): KycSession | null {
    const sessionId = this.latestKycSessionByUser.get(userId);
    if (!sessionId) {
      return null;
    }
    return this.kycSessions.get(sessionId) ?? null;
  }

  private setUserKycStatus(userId: string, status: KycStatus): void {
    const user = this.getUser(userId);
    this.users.set(userId, {
      ...user,
      kycStatus: status,
      updatedAt: now(),
    });
  }

  createKycSession(
    userId: string,
    options?: { returnPath?: string },
  ): KycSessionCreateResult {
    const user = this.getUser(userId);
    if (!this.isAdult(user.birthDate)) {
      throw new Error("underage_not_allowed");
    }
    if (!this.hasAcceptedAllActiveTerms(userId)) {
      throw new Error("terms_not_accepted");
    }
    if (!user.isGenderLocked || !user.isBirthDateLocked) {
      throw new Error("onboarding_profile_incomplete");
    }
    if (user.kycStatus === "verified") {
      throw new Error("kyc_already_verified");
    }

    const existing = this.getLatestKycSession(userId);
    if (existing && existing.status === "in_progress") {
      return {
        sessionId: existing.id,
        status: existing.status,
        provider: existing.provider,
        redirectUrl: existing.redirectUrl,
      };
    }

    const returnPath = this.sanitizeReturnPath(options?.returnPath);
    const sessionId = randomUUID();
    const provider = this.resolveKycProvider();
    const redirectUrl = this.buildKycRedirectUrl({
      provider,
      sessionId,
      userId,
      returnPath,
    });
    const timestamp = now();
    const session: KycSession = {
      id: sessionId,
      userId,
      provider,
      status: "in_progress",
      returnPath,
      redirectUrl,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.kycSessions.set(sessionId, session);
    this.latestKycSessionByUser.set(userId, sessionId);
    this.setUserKycStatus(userId, "pending");
    return {
      sessionId: session.id,
      status: session.status,
      provider: session.provider,
      redirectUrl: session.redirectUrl,
    };
  }

  getKycSessionForUser(userId: string, sessionId: string): KycSession {
    this.getUser(userId);
    const session = this.kycSessions.get(sessionId);
    if (!session) {
      throw new Error("kyc_session_not_found");
    }
    if (session.userId !== userId) {
      throw new Error("forbidden");
    }
    return session;
  }

  markKycSessionUnderReview(userId: string, sessionId: string): KycSession {
    const session = this.getKycSessionForUser(userId, sessionId);
    if (session.status !== "in_progress") {
      throw new Error("invalid_kyc_session_state");
    }
    const next: KycSession = {
      ...session,
      status: "under_review",
      updatedAt: now(),
    };
    this.kycSessions.set(sessionId, next);
    this.setUserKycStatus(userId, "pending");
    return next;
  }

  applyKycWebhook(input: {
    sessionId: string;
    status: KycSessionStatus;
  }): KycSession {
    const session = this.kycSessions.get(input.sessionId);
    if (!session) {
      throw new Error("kyc_session_not_found");
    }
    const next: KycSession = {
      ...session,
      status: input.status,
      updatedAt: now(),
    };
    this.kycSessions.set(next.id, next);

    if (input.status === "verified") {
      this.setUserKycStatus(next.userId, "verified");
    } else if (input.status === "rejected") {
      this.setUserKycStatus(next.userId, "rejected");
    } else {
      this.setUserKycStatus(next.userId, "pending");
    }
    return next;
  }

  getKycFlowStatus(userId: string): KycFlowStatus {
    const user = this.getUser(userId);
    if (user.kycStatus === "verified") {
      return "verified";
    }
    if (user.kycStatus === "rejected") {
      return "rejected";
    }

    const session = this.getLatestKycSession(userId);
    if (!session) {
      return "not_started";
    }
    return session.status;
  }

  hasAcceptedAllActiveTerms(userId: string): boolean {
    const active = this.getActiveTerms();
    return active.every((version) =>
      this.termsConsents.some(
        (consent) =>
          consent.userId === userId && consent.termsVersionId === version.id,
      ),
    );
  }

  getBasicProfile(userId: string): BasicProfileView {
    const user = this.getUser(userId);
    return {
      nickname: user.nickname,
      gender: user.gender,
      birthDate: user.birthDate,
      isGenderLocked: user.isGenderLocked,
      isBirthDateLocked: user.isBirthDateLocked,
      isCompleted: user.isGenderLocked && user.isBirthDateLocked,
    };
  }

  completeBasicProfile(userId: string, input: BasicProfileInput): BasicProfileView {
    const user = this.getUser(userId);
    if (!this.hasAcceptedAllActiveTerms(userId)) {
      throw new Error("terms_not_accepted");
    }
    if (!this.isAdult(input.birthDate)) {
      throw new Error("underage_not_allowed");
    }

    if (user.isGenderLocked && user.gender !== input.gender) {
      throw new Error("immutable_gender");
    }
    if (user.isBirthDateLocked && user.birthDate !== input.birthDate) {
      throw new Error("immutable_birth_date");
    }

    const nextUser: User = {
      ...user,
      nickname: input.nickname,
      gender: user.isGenderLocked ? user.gender : input.gender,
      birthDate: user.isBirthDateLocked ? user.birthDate : input.birthDate,
      isGenderLocked: true,
      isBirthDateLocked: true,
      updatedAt: now(),
    };
    this.users.set(userId, nextUser);
    return this.getBasicProfile(userId);
  }

  getOnboardingStatus(userId: string): {
    hasAcceptedTerms: boolean;
    isAdult: boolean;
    kycStatus: KycStatus;
    kycFlowStatus: KycFlowStatus;
    isBasicProfileCompleted: boolean;
  } {
    const user = this.getUser(userId);
    return {
      hasAcceptedTerms: this.hasAcceptedAllActiveTerms(userId),
      isAdult: this.isAdult(user.birthDate),
      kycStatus: user.kycStatus,
      kycFlowStatus: this.getKycFlowStatus(userId),
      isBasicProfileCompleted: user.isGenderLocked && user.isBirthDateLocked,
    };
  }

  getProfile(userId: string): User {
    return this.getUser(userId);
  }

  updateProfile(userId: string, patch: ProfilePatch): User {
    const user = this.getUser(userId);
    const nextVisibility: ProfileVisibility =
      patch.visibility ?? user.visibility;
    const nextSubPhotoUrls = Array.isArray(patch.subPhotoUrls)
      ? patch.subPhotoUrls.filter((url) => url.trim().length > 0).slice(0, 3)
      : user.subPhotoUrls;
    const nextUser: User = {
      ...user,
      nickname: patch.nickname ?? user.nickname,
      region: patch.region ?? user.region,
      bio: patch.bio ?? user.bio,
      visibility: nextVisibility,
      topPhotoUrl: patch.topPhotoUrl ?? user.topPhotoUrl,
      subPhotoUrls: nextSubPhotoUrls,
      updatedAt: now(),
    };
    this.users.set(userId, nextUser);
    return nextUser;
  }

  getConsents(userId: string): ConsentItem[] {
    this.getUser(userId);
    return this.consents.get(userId) ?? [];
  }

  replaceConsents(
    userId: string,
    items: Array<Pick<ConsentItem, "code" | "value">>,
  ): ConsentItem[] {
    this.getUser(userId);
    const ts = now();
    const dedup = new Map<string, ConsentItem>();
    for (const item of items) {
      dedup.set(item.code, {
        code: item.code,
        value: item.value,
        updatedAt: ts,
      });
    }
    const normalized = [...dedup.values()];
    this.consents.set(userId, normalized);
    return normalized;
  }

  getBoundaries(userId: string): BoundaryItem[] {
    this.getUser(userId);
    return this.boundaries.get(userId) ?? [];
  }

  replaceBoundaries(
    userId: string,
    items: Array<Pick<BoundaryItem, "key" | "value">>,
  ): BoundaryItem[] {
    this.getUser(userId);
    const ts = now();
    const dedup = new Map<string, BoundaryItem>();
    for (const item of items) {
      dedup.set(item.key, { key: item.key, value: item.value, updatedAt: ts });
    }
    const normalized = [...dedup.values()];
    this.boundaries.set(userId, normalized);
    return normalized;
  }

  private isBlockedEitherSide(a: string, b: string): boolean {
    return this.blocks.some(
      (block) =>
        (block.blockerUserId === a && block.blockedUserId === b) ||
        (block.blockerUserId === b && block.blockedUserId === a),
    );
  }

  private isEligibleDiscoveryTarget(currentUserId: string, user: User): boolean {
    if (user.id === currentUserId) {
      return false;
    }
    if (user.status !== "active") {
      return false;
    }
    if (user.kycStatus !== "verified") {
      return false;
    }
    if (user.visibility !== "visible") {
      return false;
    }
    if (this.isBlockedEitherSide(currentUserId, user.id)) {
      return false;
    }
    return true;
  }

  discovery(userId: string): User[] {
    this.getUser(userId);
    return [...this.users.values()].filter((candidate) =>
      this.isEligibleDiscoveryTarget(userId, candidate),
    );
  }

  likeUser(fromUserId: string, toUserId: string): LikeResult {
    this.getUser(fromUserId);
    this.getUser(toUserId);
    if (fromUserId === toUserId) {
      throw new Error("invalid_target");
    }
    if (this.isBlockedEitherSide(fromUserId, toUserId)) {
      throw new Error("blocked_relationship");
    }

    const hasLike = this.likes.some(
      (like) => like.fromUserId === fromUserId && like.toUserId === toUserId,
    );
    if (!hasLike) {
      this.likes.push({
        id: randomUUID(),
        fromUserId,
        toUserId,
        createdAt: now(),
      });
    }

    const reciprocal = this.likes.some(
      (like) => like.fromUserId === toUserId && like.toUserId === fromUserId,
    );
    if (!reciprocal) {
      return { matched: false, matchId: null };
    }

    const [userAId, userBId] =
      fromUserId < toUserId
        ? [fromUserId, toUserId]
        : ([toUserId, fromUserId] as const);
    const existing = this.matches.find(
      (match) => match.userAId === userAId && match.userBId === userBId,
    );
    if (existing) {
      return { matched: true, matchId: existing.id };
    }

    const matchId = randomUUID();
    const score = Math.round((70 + Math.random() * 30) * 100) / 100;
    this.matches.push({
      id: matchId,
      userAId,
      userBId,
      score,
      status: "active",
      createdAt: now(),
    });
    this.conversations.push({
      id: randomUUID(),
      matchId,
      userAId,
      userBId,
      createdAt: now(),
    });

    return { matched: true, matchId };
  }

  unlikeUser(fromUserId: string, toUserId: string): void {
    this.getUser(fromUserId);
    this.getUser(toUserId);
    this.likes = this.likes.filter(
      (like) =>
        !(like.fromUserId === fromUserId && like.toUserId === toUserId),
    );
  }

  private toMatchView(userId: string, match: Match): MatchView {
    const peerUserId = match.userAId === userId ? match.userBId : match.userAId;
    const peer = this.getUser(peerUserId);
    return {
      id: match.id,
      peerUserId,
      peerNickname: peer.nickname,
      score: match.score,
    };
  }

  getMatches(userId: string): MatchView[] {
    this.getUser(userId);
    return this.matches
      .filter(
        (match) =>
          match.status === "active" &&
          (match.userAId === userId || match.userBId === userId),
      )
      .map((match) => this.toMatchView(userId, match));
  }

  private getConversationInternal(conversationId: string): Conversation {
    const conversation = this.conversations.find((item) => item.id === conversationId);
    if (!conversation) {
      throw new Error("conversation_not_found");
    }
    return conversation;
  }

  private assertConversationParticipant(userId: string, conversation: Conversation): void {
    if (conversation.userAId !== userId && conversation.userBId !== userId) {
      throw new Error("forbidden");
    }
  }

  getConversations(userId: string): ConversationView[] {
    this.getUser(userId);
    return this.conversations
      .filter((conv) => conv.userAId === userId || conv.userBId === userId)
      .map((conv) => {
        const peerUserId = conv.userAId === userId ? conv.userBId : conv.userAId;
        const peer = this.getUser(peerUserId);
        const lastMessage = this.messages
          .filter((msg) => msg.conversationId === conv.id)
          .sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];
        return {
          id: conv.id,
          matchId: conv.matchId,
          peerUserId,
          peerNickname: peer.nickname,
          lastMessage: lastMessage?.body,
        };
      });
  }

  getMessages(userId: string, conversationId: string): Message[] {
    this.getUser(userId);
    const conversation = this.getConversationInternal(conversationId);
    this.assertConversationParticipant(userId, conversation);
    if (this.isBlockedEitherSide(conversation.userAId, conversation.userBId)) {
      return [];
    }
    return this.messages
      .filter((item) => item.conversationId === conversationId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
  }

  sendMessage(userId: string, conversationId: string, body: string): Message {
    this.getUser(userId);
    const conversation = this.getConversationInternal(conversationId);
    this.assertConversationParticipant(userId, conversation);
    if (this.isBlockedEitherSide(conversation.userAId, conversation.userBId)) {
      throw new Error("blocked_relationship");
    }
    const trimmed = body.trim();
    if (trimmed.length < 1 || trimmed.length > 3000) {
      throw new Error("invalid_message_length");
    }
    const message: Message = {
      id: randomUUID(),
      conversationId,
      senderUserId: userId,
      body: trimmed,
      sentAt: now(),
    };
    this.messages.push(message);
    return message;
  }

  blockUser(blockerUserId: string, blockedUserId: string, reason?: string): void {
    this.getUser(blockerUserId);
    this.getUser(blockedUserId);
    if (blockerUserId === blockedUserId) {
      throw new Error("invalid_target");
    }
    const exists = this.blocks.some(
      (block) =>
        block.blockerUserId === blockerUserId &&
        block.blockedUserId === blockedUserId,
    );
    if (!exists) {
      this.blocks.push({
        blockerUserId,
        blockedUserId,
        reason,
        createdAt: now(),
      });
    }
  }

  unblockUser(blockerUserId: string, blockedUserId: string): void {
    this.getUser(blockerUserId);
    this.getUser(blockedUserId);
    this.blocks = this.blocks.filter(
      (block) =>
        !(
          block.blockerUserId === blockerUserId &&
          block.blockedUserId === blockedUserId
        ),
    );
  }

  createReport(input: {
    reporterUserId: string;
    targetUserId: string;
    category: ReportCategory;
    detail: string;
    severity?: ReportSeverity;
    conversationId?: string;
    messageId?: string;
  }): Report {
    this.getUser(input.reporterUserId);
    this.getUser(input.targetUserId);
    if (input.reporterUserId === input.targetUserId) {
      throw new Error("invalid_target");
    }
    if (input.detail.trim().length < 10) {
      throw new Error("report_detail_too_short");
    }
    const report: Report = {
      id: randomUUID(),
      reporterUserId: input.reporterUserId,
      targetUserId: input.targetUserId,
      category: input.category,
      detail: input.detail.trim(),
      severity: input.severity ?? "medium",
      status: "open",
      conversationId: input.conversationId,
      messageId: input.messageId,
      createdAt: now(),
    };
    this.reports.push(report);
    return report;
  }

  getReports(): Report[] {
    return [...this.reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

declare global {
  var __inMemoryStore: InMemoryStore | undefined;
}

export const store = globalThis.__inMemoryStore ?? new InMemoryStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__inMemoryStore = store;
}
