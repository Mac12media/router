import { z } from "zod";

export const deleteLogSchema = z.object({
  id: z.string(),
});

export const getLeadDataSchema = z.object({
  id: z.string(),
});

const ValidationType = z.enum(
  ["phone", "email", "string", "number", "date", "boolean", "url", "zip_code"],
  {
    errorMap: () => ({ message: "Please select a valid field type." }),
  }
);

export const createCampaignSchema = z.object({
    name: z.string().min(1, "Campaign name is required"),
  segments: z.array(z.enum(["fbs", "fcs", "d2", "d3"])),
  status: z.string().optional().default("pending"),
});

export const createEndpointFormSchema = z.object({
  name: z.string().min(1, "Not a valid name."),
  schema: z.array(
    z.object({
      key: z.string().min(1, { message: "Please enter a valid field name." }),
      value: ValidationType,
    })
  ),
  formEnabled: z.boolean(),
  successUrl: z.string().url().optional(),
  failUrl: z.string().url().optional(),
  webhookEnabled: z.boolean(),
  webhook: z.string().url().optional(),
});

export const updateEndpointFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Not a valid name."),
  schema: z.array(
    z.object({
      key: z.string().min(1, { message: "Please enter a valid field name." }),
      value: ValidationType,
    })
  ),
  formEnabled: z.boolean(),
  successUrl: z.string().url().optional(),
  failUrl: z.string().url().optional(),
  webhookEnabled: z.boolean(),
  webhook: z.string().url().optional(),
});

export const updateUserProfileSchema = z.object({
  name: z.string().optional(),
  grad_year: z.string().optional(),
  bio: z.string().optional(), // if you added it manually
  test_score: z.string().optional(),
  height: z.string().optional(),
    image: z.string().optional(),

  weight: z.string().optional(),
  position: z.string().optional(),
  sport: z.string().optional(),
  video: z.string().optional(),
  high_school: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  x_username: z.string().optional(),
  ig_username: z.string().optional(),
});
