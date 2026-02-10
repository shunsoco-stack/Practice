import { z } from "zod";

export const ageGateSchema = z.object({
  birthDate: z.iso.date(),
});

export const termsConsentSchema = z.object({
  termsVersionId: z.string().min(3),
});

export const profilePatchSchema = z
  .object({
    nickname: z.string().trim().min(2).max(32).optional(),
    region: z.string().trim().min(2).max(32).optional(),
    bio: z.string().trim().max(300).optional(),
    visibility: z.enum(["visible", "hidden"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });

export const consentUpdateSchema = z.object({
  items: z
    .array(
      z.object({
        code: z.string().trim().min(1).max(64),
        value: z.enum(["allow", "deny", "discuss"]),
      }),
    )
    .min(1),
});

export const boundaryUpdateSchema = z.object({
  items: z
    .array(
      z.object({
        key: z.string().trim().min(1).max(64),
        value: z.string().trim().min(1).max(200),
      }),
    )
    .min(1),
});

export const sendMessageSchema = z.object({
  body: z.string().trim().min(1).max(3000),
});

export const blockSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export const reportSchema = z.object({
  targetUserId: z.string().trim().min(1),
  category: z.enum(["harassment", "impersonation", "scam", "illegal", "other"]),
  detail: z.string().trim().min(10).max(4000),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
  conversationId: z.string().trim().min(1).optional(),
  messageId: z.string().trim().min(1).optional(),
});
