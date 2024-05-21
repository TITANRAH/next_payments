import { CartList } from "./cart-list";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function CartPage() {


  
  return (
    <div className="container mx-auto">
      <h1>Checkout</h1>
      <CartList />
    </div>
  );
}
export default CartPage;
