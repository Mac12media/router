"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { postSubmittedProfiles } from "@/lib/db/schema";
import { submitPostProfileSchema } from "@/lib/data/validations";

export type PostSubmissionInput = {
  fullName: string;
  email: string;
  position?: string;
  classYear?: string;
  height?: string;
  weight?: string;
  videoUrl?: string;
  message?: string;
};

function cleanValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function upsertPostSubmission(
  userId: string,
  postId: string,
  input: PostSubmissionInput
) {
  const parsed = submitPostProfileSchema.parse(input);

  const values = {
    postId,
    userId,
    fullName: parsed.fullName.trim(),
    email: parsed.email.trim(),
    phone: null,
    sport: null,
    position: cleanValue(parsed.position),
    classYear: cleanValue(parsed.classYear),
    height: cleanValue(parsed.height),
    weight: cleanValue(parsed.weight),
    highSchool: null,
    city: null,
    state: null,
    gpa: null,
    testScore: null,
    videoUrl: cleanValue(parsed.videoUrl),
    xUsername: null,
    instagramUsername: null,
    bio: null,
    message: cleanValue(parsed.message),
    updatedAt: new Date(),
  };

  await db
    .insert(postSubmittedProfiles)
    .values(values)
    .onConflictDoUpdate({
      target: [postSubmittedProfiles.userId, postSubmittedProfiles.postId],
      set: values,
    });
}

export async function getPostSubmissionForUser(postId: string, userId?: string) {
  if (!userId) return null;

  const result = await db
    .select()
    .from(postSubmittedProfiles)
    .where(
      and(
        eq(postSubmittedProfiles.postId, postId),
        eq(postSubmittedProfiles.userId, userId)
      )
    )
    .limit(1);

  return result[0] ?? null;
}

export async function getSubmittedPostIdsForUser(userId?: string, postIds?: string[]) {
  if (!userId || !postIds?.length) return new Set<string>();

  const rows = await db
    .select({ postId: postSubmittedProfiles.postId })
    .from(postSubmittedProfiles)
    .where(
      and(
        eq(postSubmittedProfiles.userId, userId),
        inArray(postSubmittedProfiles.postId, postIds)
      )
    );

  return new Set(rows.map((row) => row.postId));
}
