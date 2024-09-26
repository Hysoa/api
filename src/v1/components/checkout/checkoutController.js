const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Nextcloud = require("../../classes/Nextcloud");

const url = `${process.env.DOMAIN_URL}/shop`;
const allowed_countries = [
  "AC",
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CV",
  "CW",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SZ",
  "TA",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VN",
  "VU",
  "WF",
  "WS",
  "XK",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
  "ZZ",
];
const shipping_rates = {
  france: [
    "shr_1Q0m4zB4vjA2VhbOgjBzhh0D",
    "shr_1Q0m5zB4vjA2VhbOLiHe5Rkg",
    "shr_1Q0m6XB4vjA2VhbOuglatixH",
  ],
  international: [
    "shr_1Q0m73B4vjA2VhbOEZvN7GCJ",
    "shr_1Q0m7SB4vjA2VhbOvxCUVlVG",
    "shr_1Q0m8SB4vjA2VhbO4khZ2A5F",
    "shr_1Q0m9MB4vjA2VhbO6D2YzMwi",
  ],
};

/**
 * @description Contacts Class
 */
class Checkout {
  async createSession(request, response, next) {
    try {
      const { album, purshaseType } = request.body;
      const products = await stripe.products.list();
      const albumProduct = products.data.find((product) => {
        return (
          product.name.toLowerCase() === album.toLowerCase() && product.active
        );
      });
      if (!albumProduct) {
        throw new Error("Invalid album");
      }

      const session = {
        line_items: [
          {
            price: albumProduct.default_price,
            quantity: 1,
          },
        ],
        mode: "payment",
        allow_promotion_codes: true,

        success_url: `${url}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}?canceled=true`,
      };

      if (purshaseType !== "digital") {
        const purshaseDestination = purshaseType.split("-")[1];
        const options = shipping_rates[purshaseDestination];
        if (options) {
          const sessionShippingRates = options.map((rate) => ({
            shipping_rate: rate,
          }));

          session.shipping_options = sessionShippingRates;

          session.shipping_address_collection = {
            allowed_countries:
              purshaseDestination === "france"
                ? ["FR"]
                : allowed_countries.filter((country) => country !== "FR"),
          };
        }
      }

      const checkoutSession = await stripe.checkout.sessions.create(session);
      response.status(200).json({ url: checkoutSession.url });
    } catch (error) {
      next(error);
    }
  }
  async getSharedLink(request, response, next) {
    const { sessionId } = request.params;
    const { id, payment_status, status, shipping_address_collection } =
      await stripe.checkout.sessions.retrieve(sessionId);
    if (
      payment_status === "paid" &&
      status === "complete" &&
      shipping_address_collection === null
    ) {
      const lineItems = await stripe.checkout.sessions.listLineItems(id);
      const productId = lineItems.data[0].price.product;
      const product = await stripe.products.retrieve(productId);

      const nextcloud = new Nextcloud();
      const sharedLink = await nextcloud.shareLink(
        `/Albums/${product.name}.zip`
      );

      response.json({
        sharedLink: `${sharedLink}/download/${product.name}.zip`,
      });
    }
  }
}

module.exports = new Checkout();
