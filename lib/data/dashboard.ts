"use server";

import { sql } from "drizzle-orm";
import { db } from "../db";
import { authenticatedAction } from "./safe-action";

/**
 * Get lead and error counts in proper format for shadcn/ui charts
 *
 * Protected by authenticatedAction wrapper
 * example row: { date: "2024-08-01", leads: 7, errors: 2 }
 */
export const getLeadAndErrorCounts = authenticatedAction.action(
  async ({ ctx: { userId } }) => {
    const data = await db.execute(sql`
    WITH date_series AS (
        SELECT generate_series(
            date_trunc('day', now() - interval '1 month'),
            date_trunc('day', now()),
            '1 day'::interval
        ) AS date
    ),
    user_endpoints AS (
        SELECT "id"
        FROM endpoint
        WHERE "userId" = ${userId}
    ),
lead_counts AS (
    SELECT
        date_trunc('day', lead."createdAt") AS date,
        COUNT(*)::int AS leads
    FROM
        lead
    WHERE
        lead."createdAt" >= now() - interval '1 month'
        AND lead."userId" = ${userId}
    GROUP BY
        date
),

    error_counts AS (
        SELECT
            date_trunc('day', campaigns."created_at") AS date,
            COUNT(*)::int AS errors
        FROM
            campaigns
        WHERE
            campaigns."user_id" = ${userId}
            AND campaigns."created_at" >= now() - interval '1 month'
        GROUP BY
            date
    )
    SELECT
        to_char(ds.date, 'YYYY-MM-DD') AS date,
        COALESCE(lc.leads, 0)::int AS leads,
        COALESCE(ec.errors, 0)::int AS errors
    FROM
        date_series ds
    LEFT JOIN
        lead_counts lc ON ds.date = lc.date
    LEFT JOIN
        error_counts ec ON ds.date = ec.date
    ORDER BY
        ds.date;
    `);

    return data.rows as LeadAndErrorCountResults;
  }
);


