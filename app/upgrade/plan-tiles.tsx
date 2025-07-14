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
}

const ENV = process.env.NODE_ENV === "production" ? "prod" : "dev";

/** ------------------------------------------------------------------ */
/**  PLAN DEFINITIONS – matches the screenshot (ROOKIE, MVP, ELITE+)  */
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
  console.log("[PlanTiles] Rendered with usage:", usage);

  return (
    <section className="grid gap-12 px-4 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Compare Plans</h2>
        <p className="text-muted-foreground">
          There&rsquo;s a plan for everyone. Choose the one that works for you...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const isElite = plan.name === "ELITE+";

  console.log("[Tile] Rendering plan:", plan.name);
  console.log(" - isCurrentPlan:", isCurrentPlan);
  console.log(" - monthlyPriceId:", plan.monthlyStripePriceId);
  console.log(" - yearlyPriceId:", plan.yearlyStripePriceId);

  return (
    <div
      className={cn(
        "relative bg-black text-white p-6 rounded-xl shadow-md flex flex-col gap-4 transition-all",
        isCurrentPlan && "border-2 border-yellow-400"
      )}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 px-3 py-1 rounded-full">
          <p className="text-xs text-black font-medium">Current Plan</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
        <p className="text-muted-foreground text-sm text-center">
          {plan.description}
        </p>
      </div>

      <ul className="space-y-2 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2 items-start">
            <Check
              size={16}
              className={isElite ? "text-yellow-400 mt-1" : "text-orange-500 mt-1"}
            />
            {feature}
          </li>
        ))}
      </ul>

      <div className="pt-4 mt-auto">
        {plan.monthlyPrice === "Contact For Pricing" ? (
          <p className="text-center text-lg font-semibold bg-gradient-to-r from-orange-400 to-yellow-300 text-black px-4 py-2 rounded-md w-fit mx-auto">
            ${plan.yearlyPrice}
          </p>
        ) : (
          <>
            <p className="text-center text-lg font-semibold bg-gradient-to-r from-orange-400 to-yellow-300 text-black px-4 py-2 rounded-md w-fit mx-auto">
              ${plan.monthlyPrice}/mo
            </p>
          </>
        )}
      </div>

      <div className="pt-4 space-y-2">
        {!isCurrentPlan &&
          (plan.monthlyPrice === "Contact For Pricing" ? (
            <Button
  className="w-full"
  onClick={() => {
    console.log("[Tile] ONE-TIME checkout initiated", {
      plan: plan.name,
      priceId: plan.yearlyStripePriceId,
    });
    window.location.href = "https://buy.stripe.com/28E14naixbAmcNL5TLafS00";
  }}
>
  One-Time Purchase
</Button>

          ) : (
            <Button
              className="w-full"
              onClick={() => {
                console.log("[Tile] MONTHLY checkout initiated", {
                  plan: plan.name,
                  priceId: plan.monthlyStripePriceId,
                });
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
                console.log("[Tile] Manage Plan portal opened for", plan.name);
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