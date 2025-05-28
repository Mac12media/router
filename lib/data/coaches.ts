"use server";

import { logs, endpoints, fbcoaches } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { authenticatedAction } from "./safe-action";
import { z } from "zod";

/**
 * Creates a log entry
 *
 * Helper function used in dynamic route for creating a log
 * User does not need to be authenticated for this to happen
 */
export async function createLog(
  type: "success" | "error",
  postType: LogPostType,
  message: string,
  endpointId: string
): Promise<void> {
  await db.insert(logs).values({
    type,
    postType,
    message:
      type === "success" ? { success: true, id: message } : { error: message },
    createdAt: new Date(),
    endpointId,
  });

  revalidatePath("/activity");
}

/**
 * Gets all logs for the user
 *
 * Protected by authenticatedAction wrapper
 */
export const getCoaches = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    // Fetch the coach data from the database
    const coachData = await db
      .select()
      .from(fbcoaches)
      .orderBy(desc(fbcoaches.created_at));

    // Map the coach data to the desired shape
    const data: CoachRow[] = coachData.map((coach) => ({
      id: coach.id,
      school: coach.school,
      photo_url: coach.photo_url,
      division: coach.division,
      head_coach: coach.head_coach,
      program_bio: coach.program_bio,
      email: coach.email,
      phone: coach.phone,
      website: coach.website,
      created_at: coach.created_at,
      updated_at: coach.updated_at,
    }));

    // Log the data to the console

    // Return the formatted data
    return data;
  }
);



export const getCoach = authenticatedAction
  .schema(z.object({ coachid: z.number() }))
  .action(async ({ parsedInput: { coachid }, ctx: { userId } }) => {
    const [data] = await db
      .select()
      .from(fbcoaches)
      .where(eq(fbcoaches.id, coachid));
    return data;
  });



/**
 * Deletes a log
 *
 * Protected by authenticatedAction wrapper
 */
export const deleteLog = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const logWithEndpoint = await db
      .select({
        endpointUserId: endpoints.userId,
      })
      .from(logs)
      .innerJoin(endpoints, eq(logs.endpointId, endpoints.id))
      .where(eq(logs.id, id));

    if (
      !logWithEndpoint.length ||
      logWithEndpoint[0].endpointUserId !== userId
    ) {
      throw new Error("You are not authorized for this action.");
    }

    await db.delete(logs).where(eq(logs.id, id));
    revalidatePath("/activity");
  });
