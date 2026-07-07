"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  postStripeSession,
  createCustomerPortalSession,
} from "@/lib/data/stripe";
import { STRIPE_PLANS } from "@/lib/constants/stripe";

interface PlanProps {
  name: string;
  description: string;
  monthlyPrice: number | "Contact For Pricing";
  /**  Used for ELITE+ one-time cost  */
  yearlyPrice: number | "Contact For Pricing";
  monthlyStripePriceId?: string;
  yearlyStripePriceId?: string;
  stripeProductId?: string;
  features: string[];
  label?: string;
}

const ENV = process.env.NODE_ENV === "production" ? "prod" : "dev";

/** ------------------------------------------------------------------ */
/**  PLAN DEFINITIONS – matches the pricing layout direction in the reference. */
/** ------------------------------------------------------------------ */
const plans: PlanProps[] = [
  {
    name: "ROOKIE",
    description: "Entry-level access to recruiting tools.",
    monthlyPrice: 14.95,
    yearlyPrice: 179.4,
    stripeProductId: STRIPE_PLANS.rookie.productId[ENV],
    monthlyStripePriceId: STRIPE_PLANS.rookie.monthlyPriceId[ENV],
    yearlyStripePriceId: STRIPE_PLANS.rookie.yearlyPriceId[ENV],
    features: [
      "Player Campaign",
      "Social Boost",
      "Coach Contact Access",
      "EXPO+ Score",
      "Recruiting Toolkit",
    ],
  },
  {
    name: "MVP",
    description: "More exposure and tools to boost recruiting.",
    monthlyPrice: 24.95,
    yearlyPrice: 299.4,
    stripeProductId: STRIPE_PLANS.mvp.productId[ENV],
    monthlyStripePriceId: STRIPE_PLANS.mvp.monthlyPriceId[ENV],
    yearlyStripePriceId: STRIPE_PLANS.mvp.yearlyPriceId[ENV],
    features: [
      "2x Player Campaign",
      "2x Social Boost",
      "Coach Contact Access",
      "EXPO+ Score + Metrics",
      "Recruiting Toolkit",
      "College Openings Group",
      "Recruiting Coordinator",
      "Campaign Analytics",
    ],
    label: "Most popular",
  },
  {
    name: "ELITE+",
    description: "Premium recruiting access with a one-time payment.",
    /**  No monthly subscription – charge once via yearlyPrice  */
    monthlyPrice: "Contact For Pricing",
    yearlyPrice: 119.95,
    stripeProductId: STRIPE_PLANS.elite.productId[ENV],
    /**  Use the yearly price ID for the one-time charge  */
    yearlyStripePriceId: STRIPE_PLANS.elite.yearlyPriceId[ENV],
    features: [
      "3x Player Campaign",
      "3x Social Boost",
      "Coach Contact Access",
      "EXPO+ Score & Metrics",
      "Recruiting Toolkit +",
      "College Openings Group",
      "Recruiting Coordinator",
      "Campaign Analytics +",
      "EXPO+ Event Discounts",
      "Player Evaluation",
      "ONE TIME PAYMENT",
    ],
  },
];

/* -------------------------------------------------------------------- */
export const PlanTiles = ({ usage }: { usage?: { plan?: string } }) => {
  return (
    <section className="grid gap-10 px-2 py-6 sm:px-4 max-w-6xl mx-auto">
      
      <div className="grid gap-6 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch">
        {plans.map((plan) => (
          <Tile key={plan.name} plan={plan} currentPlan={usage?.plan} />
        ))}
      </div>

      {usage?.plan && (
        <p className="text-center text-muted-foreground">
          Current Plan:{" "}
          <span className="font-medium text-foreground uppercase">
            {usage.plan}
          </span>
        </p>
      )}
    </section>
  );
};

const Tile = ({
  plan,
  currentPlan,
}: {
  plan: PlanProps;
  currentPlan?: string;
}) => {
  const isCurrentPlan =
    currentPlan?.toLowerCase() === plan.name.toLowerCase();
  const isFeatured = plan.label === "Most popular";

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 sm:p-7",
        "hover:-translate-y-1 hover:shadow-xl",
        isFeatured &&
          "border-primary/50 shadow-lg ring-2 ring-primary/40 sm:-translate-y-1 md:-translate-y-2",
        isCurrentPlan && "border-primary ring-2 ring-primary/60"
      )}
    >
      {isFeatured && (
        <div className="absolute left-0 right-0 top-0 mx-auto w-fit -translate-y-1/2">
          <p className="rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground shadow">
            {plan.label}
          </p>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] border border-primary/40 text-primary">
          Current Plan
        </div>
      )}

      <div className="space-y-2 pt-4 text-center">
        <h3 className="text-3xl font-black uppercase tracking-tight text-foreground">
          {plan.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {plan.description}
        </p>
      </div>

      <div className="border-y border-border py-5 text-center">
        {plan.monthlyPrice === "Contact For Pricing" ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              One-time fee
            </p>
            <p className="mt-1 text-5xl font-black tracking-tight text-foreground">{`$${plan.yearlyPrice}`}</p>
          </>
        ) : (
          <>
            <p className="text-5xl font-black tracking-tight text-foreground">
              ${plan.monthlyPrice}
              <span className="text-base align-top font-semibold text-muted-foreground">
                /mo
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Billed monthly, cancel anytime
            </p>
          </>
        )}
      </div>

      <ul className="space-y-3 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2 items-start">
            <Check
              size={16}
              strokeWidth={3}
              className="mt-1 shrink-0 text-primary"
            />
            <span className="text-foreground/90">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="pt-2 mt-auto space-y-2">
        {!isCurrentPlan &&
          (plan.monthlyPrice === "Contact For Pricing" ? (
            <Button
              className="w-full font-bold text-sm"
              onClick={() => {
                window.location.href =
                  "https://buy.stripe.com/28E14naixbAmcNL5TLafS00";
              }}
            >
              One-Time Purchase
            </Button>
          ) : (
            <Button
              className="w-full font-bold text-sm"
              onClick={() => {
                postStripeSession({
                  priceId: plan.monthlyStripePriceId!,
                });
              }}
            >
              Purchase Monthly
            </Button>
          ))}

        {isCurrentPlan && (
          <>
            <Button
              variant="outline"
              className="w-full pointer-events-none cursor-default"
            >
              Your Active Plan
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                createCustomerPortalSession();
              }}
            >
              Manage Your Plan
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
