interface StripePlanConfig {
  productId: {
    dev: string;
    prod: string;
  };
  monthlyPriceId: {
    dev: string;
    prod: string;
  };
  yearlyPriceId: {
    dev: string;
    prod: string;
  };
}

interface StripePlansConfig {
  rookie: StripePlanConfig;
  mvp: StripePlanConfig;
  elite: StripePlanConfig;
}

export const STRIPE_PLANS: StripePlansConfig = {
  rookie: {
    productId: {
      dev: "prod_SYR3SGGNS8DMfw",
      prod: "prod_SYR3SGGNS8DMfw",
    },
    monthlyPriceId: {
      dev: "price_1RdKBbGG5Z3i5YX8UZshGJyF",
      prod: "price_1RdKBbGG5Z3i5YX8UZshGJyF",
    },
    yearlyPriceId: {
      dev: "price_1RdKBbGG5Z3i5YX8UZshGJyF",
      prod: "price_1RdKBbGG5Z3i5YX8UZshGJyF",
    },
  },
  mvp: {
    productId: {
      dev: "prod_SYR5OHPLCWkQNS",
      prod: "prod_SYR5OHPLCWkQNS",
    },
    monthlyPriceId: {
      dev: "price_1RdKD9GG5Z3i5YX8t0sVsFR0",
      prod: "price_1RdKD9GG5Z3i5YX8t0sVsFR0",
    },
    yearlyPriceId: {
      dev: "price_1RdKD9GG5Z3i5YX8t0sVsFR0",
      prod: "price_1RdKD9GG5Z3i5YX8t0sVsFR0",
    },
  },
  elite: {
    productId: {
      dev: "prod_SYR6VrdIwTCmeV",
      prod: "prod_SYR6VrdIwTCmeV",
    },
    monthlyPriceId: {
      dev: "price_1RdKE5GG5Z3i5YX8SQrteq3v",
      prod: "price_1RdKE5GG5Z3i5YX8SQrteq3v",
    },
    yearlyPriceId: {
      dev: "price_1RdKE5GG5Z3i5YX8SQrteq3v",
      prod: "price_1RdKE5GG5Z3i5YX8SQrteq3v",
    },
  },
};
