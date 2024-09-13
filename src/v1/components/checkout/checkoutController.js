const stripe = require("stripe")(
  "sk_test_51PxSHqB4vjA2VhbOicDTPm05sD2wKB8TyBb9B3jIXdQkAOLBJiaH4Kbs9CokPqH8yqsgi5yJXtatoJZRele0pjtF00OiIQUvcX"
);
const Nextcloud = require("../../classes/Nextcloud");

const YOUR_DOMAIN = "http://localhost:5173/shop";

const prices = {
  ["Sleep Well"] : "price_1PyaJVB4vjA2VhbORbp9Jl0O",
  ["It Could Be Worse"] : "price_1PyaJVB4vjA2VhbORbp9Jl0O",
}

/**
 * @description Contacts Class
 */
class Checkout {
  async createSession(request, response, next) {
    try {
      const { album } = request.query;
      const price = prices[album];
      if (!price) {
        throw new Error("Invalid album");
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });

      response.redirect(303, session.url);
    } catch (error) {
      next(error);
    }
  }
  async getSharedLink(request, response, next) {

    const { sessionId } = request.params
    const { id, payment_status, status } = await stripe.checkout.sessions.retrieve(sessionId);
    if (payment_status === 'paid' && status === 'complete') {
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
