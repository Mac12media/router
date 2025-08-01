"use server";

import { leads, endpoints } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { authenticatedAction } from "./safe-action";
import { z } from "zod";

/**
 * Creates a new lead in the database
 *
 * Helper function used in dynamic route for creating a new lead
 * User does not need to be authenticated for this to happen
 */
export async function createLead(
  userId: string,

): Promise<string> {
  const [{ leadId }] = await db
    .insert(leads)
    .values({
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId,
    })
    .returning({ leadId: leads.id });

  return leadId;
}

/**
 * Gets all leads for a user
 *
 * Protected by authenticatedAction wrapper
 */
export const getLeads = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const leadsData = await db
      .select()
      .from(leads)
      .where(eq(leads.userId, userId))
      .orderBy(desc(leads.createdAt));

    const data: LeadRow[] = leadsData.map((lead) => ({
      id: lead.id,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      userId: lead.userId as string,
    }));

    return data;
  }
);

/**
 * Get lead data for one specific lead
 *
 * Protected by authenticatedAction wrapper
 */
export const getLeadData = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const leadWithEndpoint = await db
      .select({
        endpointUserId: endpoints.userId,
      })
      .from(leads)
      .innerJoin(endpoints, eq(leads.userId, endpoints.id))
      .where(eq(leads.id, id));

    if (
      !leadWithEndpoint.length ||
      leadWithEndpoint[0].endpointUserId !== userId
    ) {
      throw new Error("You are not authorized for this action.");
    }

    const leadData = await db.select().from(leads).where(eq(leads.id, id));
    return leadData[0];
  });

/**
 * Get all leads by an endpoint id
 *
 * Protected by authenticatedAction wrapper
 */
export const getLeadsByEndpoint = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const endpoint = await db
      .select({
        id: endpoints.id,
        schema: endpoints.schema,
      })
      .from(endpoints)
      .where(and(eq(endpoints.id, id), eq(endpoints.userId, userId)))
      .limit(1);

    if (!endpoint.length) {
      throw new Error("You are not authorized for this action");
    }

    const leadData = await db
      .select()
      .from(leads)
      .where(eq(leads.userId, id));

    return { leadData, schema: endpoint[0].schema };
  });

/**
 * Delete a lead by id
 *
 * Protected by authenticatedAction wrapper
 */
export const deleteLead = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const leadWithEndpoint = await db
      .select({ endpointUserId: endpoints.userId })
      .from(leads)
      .innerJoin(endpoints, eq(leads.userId, endpoints.id))
      .where(eq(leads.id, id));

    if (
      !leadWithEndpoint.length ||
      leadWithEndpoint[0].endpointUserId !== userId
    ) {
      throw new Error("You are not authorized for this action.");
    }

    await db.delete(leads).where(eq(leads.id, id));
    revalidatePath("/leads");
  });
