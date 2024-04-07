export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 10,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 30,
    pagesPerPdf: 35,
    price: {
      amount: 1200,
      priceIds: {
        test: process.env.TEST_PRICE_ID,
        production: process.env.PRODUCTION_PRICE_ID,
      },
    },
  },
];
