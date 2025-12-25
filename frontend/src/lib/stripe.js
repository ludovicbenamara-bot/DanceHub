
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the Publishable Key
// We use the key provided by the user
const stripePromise = loadStripe('pk_test_51SFKPUAmyblGiA3MjdLuDYDOhy1QWpEokqwuy2bvEP3RoB6YMS5ExNA1Z9CgPRCSTlwGXYF30IGEDM31d62De1HP00Ixx6Icxd');

export default stripePromise;
