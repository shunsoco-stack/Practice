import type { User } from "@/lib/domain/types";

function calculateAge(birthDate: string): number {
  const dob = new Date(birthDate);
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  const dayDiff = today.getUTCDate() - dob.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return Math.max(0, age);
}

export function toUserProfileDto(user: User): {
  id: string;
  nickname: string;
  age: number;
  birthDate: string;
  gender: User["gender"];
  isGenderLocked: boolean;
  isBirthDateLocked: boolean;
  region: string;
  bio: string;
  topPhotoUrl: string | null;
  subPhotoUrls: string[];
  kycStatus: User["kycStatus"];
  visibility: User["visibility"];
} {
  return {
    id: user.id,
    nickname: user.nickname,
    age: calculateAge(user.birthDate),
    birthDate: user.birthDate,
    gender: user.gender,
    isGenderLocked: user.isGenderLocked,
    isBirthDateLocked: user.isBirthDateLocked,
    region: user.region,
    bio: user.bio,
    topPhotoUrl: user.topPhotoUrl,
    subPhotoUrls: user.subPhotoUrls,
    kycStatus: user.kycStatus,
    visibility: user.visibility,
  };
}
