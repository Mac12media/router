import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { STRIPE_PLANS } from "@/lib/constants/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    const priceIdToPlan = {
      // ROOKIE
      [STRIPE_PLANS.rookie.monthlyPriceId.dev]: "rookie",
      [STRIPE_PLANS.rookie.monthlyPriceId.prod]: "rookie",
      [STRIPE_PLANS.rookie.yearlyPriceId.dev]: "rookie",
      [STRIPE_PLANS.rookie.yearlyPriceId.prod]: "rookie",

      // MVP
      [STRIPE_PLANS.mvp.monthlyPriceId.dev]: "mvp",
      [STRIPE_PLANS.mvp.monthlyPriceId.prod]: "mvp",
      [STRIPE_PLANS.mvp.yearlyPriceId.dev]: "mvp",
      [STRIPE_PLANS.mvp.yearlyPriceId.prod]: "mvp",

      // ELITE+ (one-time)
      [STRIPE_PLANS.elite.monthlyPriceId.dev]: "elite",
      [STRIPE_PLANS.elite.monthlyPriceId.prod]: "elite",
      [STRIPE_PLANS.elite.yearlyPriceId.dev]: "elite",
      [STRIPE_PLANS.elite.yearlyPriceId.prod]: "elite",
    } as const;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0].price?.id;

      const plan = priceIdToPlan[priceId as keyof typeof priceIdToPlan];

      if (!plan) {
        console.error(`Invalid price ID: ${priceId}`);
        throw new Error(`Invalid price ID: ${priceId}`);
      }

      const customerEmail = session.customer_email;
      if (!customerEmail) {
        throw new Error("No customer email found in session");
      }

      await db
        .update(users)
        .set({
          plan,
          stripeCustomerId: session.customer as string,
        })
        .where(eq(users.email, customerEmail));
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;

      const plan = priceIdToPlan[priceId as keyof typeof priceIdToPlan];

      if (!plan) {
        console.error(`Invalid price ID: ${priceId}`);
        throw new Error(`Invalid price ID: ${priceId}`);
      }

      await db
        .update(users)
        .set({ plan })
        .where(eq(users.stripeCustomerId, subscription.customer as string));
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(users)
        .set({ plan: "free" })
        .where(eq(users.stripeCustomerId, subscription.customer as string));
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      console.error(`Payment failed for customer ${invoice.customer}`);
    }

    if (event.type === "customer.deleted") {
      const customer = event.data.object as Stripe.Customer;

      await db
        .update(users)
        .set({
          plan: "free",
          stripeCustomerId: null,
        })
        .where(eq(users.stripeCustomerId, customer.id));
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
