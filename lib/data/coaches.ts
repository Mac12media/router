"use server";

import { logs, endpoints, programs, bbprograms } from "../db/schema";
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

  revalidatePath("/campaigns");
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
      .from(programs)
      .orderBy((programs.id));

    // Map the coach data to the desired shape
const data: CoachRow[] = coachData.map((coach) => ({
  id: coach.id,
  school: coach.school,
  image: coach.image,  // Assuming 'image' in coachData is the photo URL
  location: coach.location,  // Added location field
  division: coach.division,
  conference: coach.conference,  // Added conference field
  head_coach: coach.head_coach,
  bio: coach.bio,  // Renamed bio to program_bio
  email: coach.email,
  phone: coach.phone,
  full_staff: coach.full_staff,  // Added full_staff field
  website: coach.website,
  gpa: coach.gpa,  // Added GPA field
  act_sat: coach.act_sat,  // Added ACT field
  camps: coach.camps,  // Added camps field
  expo_score: coach.expo_score,  // Added expo_score field
  // Assuming 'updated_at' is a string or timestamp
}));



    // Log the data to the console

    // Return the formatted data
    return data;
  }
);

export const getBBCoaches = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    // Fetch the coach data from the database
    const coachData = await db
      .select()
      .from(bbprograms)
      .orderBy((bbprograms.id));

   const data: BBCoachRow[] = coachData.map((coach) => ({
  id: coach.id,
  school: coach.school,
  image: coach.image,
  location: coach.location,
  division: coach.division,
  conference: coach.conference,
  gpa: coach.gpa,
  act_sat: coach.act_sat,

  m_head_coach: coach.m_coach,
  m_bio: coach.m_bio,
  m_email: coach.m_email,
  m_phone: coach.m_phone,
  m_twitter: coach.m_twitter,
  m_full_staff: coach.m_full_staff,
  m_website: coach.m_website,
  m_camp: coach.m_camp,

  w_head_coach: coach.w_coach,
  w_bio: coach.w_bio,
  w_email: coach.w_email,
  w_phone: coach.w_phone,
  w_twitter: coach.w_twitter,
  w_full_staff: coach.w_full_staff,
  w_website: coach.w_website,
  w_camps: coach.w_camps,
}));




    // Return the formatted data
    return data;
  }
);


export const getCoach = authenticatedAction
  .schema(z.object({ coachid: z.number() }))
  .action(async ({ parsedInput: { coachid }, ctx: { userId } }) => {
    const [data] = await db
      .select()
      .from(programs)
      .where(eq(programs.id, coachid));
    return data;
  });


  export const getBBCoach = authenticatedAction
  .schema(z.object({ coachid: z.number() }))
  .action(async ({ parsedInput: { coachid }, ctx: { userId } }) => {
    const [data] = await db
      .select()
      .from(bbprograms)
      .where(eq(bbprograms.id, coachid));
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
    revalidatePath("/campaigns");
  });
