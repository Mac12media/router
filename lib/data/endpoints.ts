"use server";

import { revalidatePath } from "next/cache";
import { db, Endpoint } from "../db";
import { endpoints, campaigns } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getErrorMessage } from "@/lib/helpers/error-message";
import { authenticatedAction } from "./safe-action";
import { z } from "zod";
import {
  createCampaignSchema,
  createEndpointFormSchema,
  updateEndpointFormSchema,
} from "./validations";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

/**
 * Gets all endpoints for a user
 *
 * Protected by authenticatedAction wrapper
 */
export const getEndpoints = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const data = await db
      .select()
      .from(endpoints)
      .where(eq(endpoints.userId, userId))
      .orderBy(desc(endpoints.updatedAt));

    return data;
  }
);

/**
 * Gets a specific endpoint by id
 *
 * Protected by authenticatedAction wrapper
 */
export const getEndpointById = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    const [data] = await db
      .select()
      .from(endpoints)
      .where(and(eq(endpoints.id, id), eq(endpoints.userId, userId)));
    return data;
  });

/**
 * Gets a specific endpoint to post to
 *
 * Does not need to be authenticated
 * Used in the posting route
 */
export const getPostingEndpointById = async (id: string) => {
  const [data] = await db.select().from(endpoints).where(eq(endpoints.id, id));
  return data;
};

/**
 * Deletes a specific endpoint by id
 *
 * Protected by authenticatedAction wrapper
 */
export const deleteEndpoint = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    await db
      .delete(endpoints)
      .where(and(eq(endpoints.id, id), eq(endpoints.userId, userId)));
    revalidatePath("/campaigns");
  });

/**
 * Disables a specific endpoint by id
 *
 * Protected by authenticatedAction wrapper
 */
export const disableEndpoint = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    await db
      .update(endpoints)
      .set({ enabled: false, updatedAt: new Date() })
      .where(and(eq(endpoints.id, id), eq(endpoints.userId, userId)));
    revalidatePath("/campaigns");
  });

/**
 * Enables a specific endpoint by id
 *
 * Protected by authenticatedAction wrapper
 */
export const enableEndpoint = authenticatedAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
    await db
      .update(endpoints)
      .set({ enabled: true, updatedAt: new Date() })
      .where(and(eq(endpoints.id, id), eq(endpoints.userId, userId)));
    revalidatePath("/campaigns");
  });

/**
 * Creates an endpoint
 *
 * Protected by authenticationAction wrapper
 * Shares a zod schema with react-hook-form in ./validations.ts
 */
export const createEndpoint = authenticatedAction
  .schema(createEndpointFormSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const token = randomBytes(32).toString("hex");
    await db.insert(endpoints).values({
      userId,
      name: parsedInput.name,
      schema: parsedInput.schema,
      // TODO: add this to form
      // enabled: parsedInput.enabled,
      formEnabled: parsedInput.formEnabled,
      successUrl: parsedInput.successUrl,
      failUrl: parsedInput.failUrl,
      webhookEnabled: parsedInput.webhookEnabled,
      webhook: parsedInput.webhook,
      token: token,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/campaigns");
    redirect("/campaigns");
  });

  
export const createCampaign = authenticatedAction
  .schema(createCampaignSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const campaignId = randomBytes(16).toString("hex");

    await db.insert(campaigns).values({
      id: campaignId,
      userId, // overrides parsedInput.userId if needed
      name: parsedInput.name,
      segments: parsedInput.segments,
      types: parsedInput.types ?? [],
      material: parsedInput.material,
      bio: parsedInput.bio,
      filmLink: parsedInput.filmLink,
      classYear: parsedInput.classYear,
      height: parsedInput.height,
      weight: parsedInput.weight,
      status: parsedInput.status ?? "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Optional: Return the campaignId or confirmation
    return { success: true, id: campaignId };
  });



export const getCampaigns = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const result = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId));

    // Ensure data matches CampaignRow structure
    const data: CampaignRow[] = result.map((row) => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      segments: row.segments,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return data;
  }
);
/**
 * Updates an endpoint
 *
 * Protected by authenticationAction wrapper
 * Shares a zod schema with react-hook-form in ./validations.ts
 */
export const updateEndpoint = authenticatedAction
  .schema(updateEndpointFormSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    await db
      .update(endpoints)
      .set({
        name: parsedInput.name,
        schema: parsedInput.schema,
        // TODO: add this to form
        // enabled: parsedInput.enabled,
        formEnabled: parsedInput.formEnabled,
        successUrl: parsedInput.successUrl,
        failUrl: parsedInput.failUrl,
        webhookEnabled: parsedInput.webhookEnabled,
        webhook: parsedInput.webhook,
        updatedAt: new Date(),
      })
      .where(
        and(eq(endpoints.id, parsedInput.id), eq(endpoints.userId, userId))
      );

    revalidatePath("/campaigns");
    redirect("/campaigns");
  });
