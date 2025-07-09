"use server";

import { z } from "zod";
import { db } from "../db";
import {
  updateUserProfileSchema,
} from "./validations";
import { users, endpoints } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { authenticatedAction } from "./safe-action";

/**
 * Increments the lead count for a user
 *
 * Used to track the number of leads a user has received
 */
export const incrementLeadCount = async (endpointId: string) => {
  await db
    .update(users)
    .set({ leadCount: sql`${users.leadCount} + 1` })
    .where(
      eq(
        users.id,
        db
          .select({ userId: endpoints.userId })
          .from(endpoints)
          .where(eq(endpoints.id, endpointId))
          .limit(1)
      )
    );
};

export const decreaseCampaignCount = async (userId: string) => {
  await db
    .update(users)
    .set({ campaigncount: sql`${users.campaigncount} - 1` })
    .where(eq(users.id, userId));
};

export const decreaseBoostCount = async (userId: string) => {
  await db
    .update(users)
    .set({ boostcount: sql`${users.boostcount} - 1` })
    .where(eq(users.id, userId));
};

/**
 * Retrieves the lead count for a specific endpoint
 *
 * @returns The lead count associated with the endpoint's user
 * @throws Error if the endpoint is not found or not associated with a user
 */
export const getLeadCount = async (endpointId: string) => {
  const result = await db
    .select({ leadCount: users.leadCount })
    .from(users)
    .innerJoin(endpoints, eq(users.id, endpoints.userId))
    .where(eq(endpoints.id, endpointId))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Endpoint not found or not associated with a user");
  }

  return result[0].leadCount;
};

/**
 * Retrieves the user's plan for a specific endpoint
 *
 * @returns The user's plan associated with the endpoint's user
 * @throws Error if the endpoint is not found or not associated with a user
 */
export const getUserPlan = async (endpointId: string) => {
  const result = await db
    .select({ plan: users.plan })
    .from(users)
    .innerJoin(endpoints, eq(users.id, endpoints.userId))
    .where(eq(endpoints.id, endpointId))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Endpoint not found or not associated with a user");
  }

  return result[0].plan;
};

/**
 * Clears the lead count for all users
 *
 * Runs once a month on a CRON trigger
 */
export const clearLeadCount = async () => {
  await db.update(users).set({ leadCount: 0 });
};

/**
 * Retrieves the lead count for specific user
 *
 * Authenticated action
 */

export const getUsageForUser = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const result = await db
      .select({ leadCount: users.leadCount,  boostcount: users.boostcount,     campaigncount: users.campaigncount,
 id: users.id, plan: users.plan })
      .from(users)
      .where(eq(users.id, userId));

    if (result.length === 0) {
      throw new Error("User not found");
    }

    return result[0];
  }
);


export const getUser = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const result = await db
      .select({ leadCount: users.leadCount, height: users.height, 
        weight: users.weight,
        campaigncount: users.campaigncount,
        position: users.position, grad_year: users.grad_year, id: users.id, name: users.name, last_name: users.last_name, plan: users.plan })
      .from(users)
      .where(eq(users.id, userId));

    if (result.length === 0) {
      throw new Error("User not found");
    }

    return result[0];
  }
);

export const getUserFull = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const result = await db
      .select({
        name: users.name,
        id: users.id,
        last_name: users.last_name,
        grad_year: users.grad_year,
        bio: users.bio,
                        image: users.image,

        test_score: users.test_score,
        height: users.height,
        weight: users.weight,
        position: users.position,
        sport: users.sport,
        video: users.video,
        high_school: users.high_school,
        city: users.city,
        state: users.state,
        x_username: users.x_username,
        ig_username: users.ig_username,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (result.length === 0) {
      throw new Error("User not found");
    }

    return result[0];
  }
);


export const getUserFullById = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const result = await db
      .select({
        name: users.name,
        last_name: users.last_name,
        grad_year: users.grad_year,
        bio: users.bio,
                image: users.image,

        test_score: users.test_score,
        height: users.height,
        weight: users.weight,
        position: users.position,
        sport: users.sport,
        video: users.video,
        high_school: users.high_school,
        city: users.city,
        state: users.state,
        x_username: users.x_username,
        ig_username: users.ig_username,
      })
      .from(users)
      .where(eq(users.id, id));

    if (result.length === 0) {
      throw new Error("User not found");
    }

    return result[0];
  }
);

const schema = z.object({ id: z.string() });


export async function getPublicUserById(formData: FormData | { id: string }) {
  // Allow usage from client or internal call
  const parsed =
    formData instanceof FormData
      ? schema.parse({ id: formData.get("id") })
      : schema.parse(formData);

  const result = await db
    .select({
      name: users.name,
      last_name: users.last_name,
      grad_year: users.grad_year,
      bio: users.bio,
      image: users.image,
      test_score: users.test_score,
      height: users.height,
      weight: users.weight,
      position: users.position,
      sport: users.sport,
      video: users.video,
      high_school: users.high_school,
      city: users.city,
      state: users.state,
      x_username: users.x_username,
      ig_username: users.ig_username,
    })
    .from(users)
    .where(eq(users.id, parsed.id));

  if (result.length === 0) {
    throw new Error("User not found");
  }

  return result[0];
}




export const updateUserProfile = authenticatedAction
  .schema(updateUserProfileSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await db
      .update(users)
      .set({
        name: parsedInput.name,
        grad_year: parsedInput.grad_year,
        bio: parsedInput.bio,
        test_score: parsedInput.test_score,
        height: parsedInput.height,
                        image: parsedInput.image,

        weight: parsedInput.weight,
        position: parsedInput.position,
        sport: parsedInput.sport,
        video: parsedInput.video,
        high_school: parsedInput.high_school,
        city: parsedInput.city,
        state: parsedInput.state,
        x_username: parsedInput.x_username,
        ig_username: parsedInput.ig_username,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  });
