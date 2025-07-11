"use client";

import { useEffect } from "react";

export const StripePricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <div
        className="stripe-container"
        dangerouslySetInnerHTML={{
          __html: `
            <stripe-pricing-table
              pricing-table-id="prctbl_1Rj5OuGG5Z3i5YX8dgBLBtBj"
              publishable-key="pk_live_51QxISMGG5Z3i5YX8Fr61JMh4EE8AIi4vW5kL9c4kMmlT39jfllyaGLZJ6drZLEmiJrE1KuqPrCIOvER9rPhbROx600JzUiPTqP"
              theme="dark"
            ></stripe-pricing-table>
          `,
        }}
      />
    </div>
  );
};
