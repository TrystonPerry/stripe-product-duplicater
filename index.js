import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const { STRIPE1_SECRET_KEY, STRIPE2_SECRET_KEY } = process.env;

const stripe1 = new Stripe(STRIPE1_SECRET_KEY);
const stripe2 = new Stripe(STRIPE2_SECRET_KEY);

const products = await stripe1.products.list();
const prices = await stripe1.prices.list();

// Map with new product id pointing to new product object with oldProductId included
const newProducts = {};

for (const product of products.data) {
  const newProduct = await stripe2.products.create({
    id: product.id,
    name: product.name,
    active: product.active,
    metadata: product.metadata,
    images: product.images,
  });
  newProducts[product.id] = newProduct;
}

for (const price of prices.data) {
  const product = newProducts[price.product];
  await stripe2.prices.create({
    currency: price.currency,
    product: product.id,
    unit_amount: price.unit_amount,
    active: price.active,
    metadata: price.metadata,
    nickname: price.nickname,
  });
}
