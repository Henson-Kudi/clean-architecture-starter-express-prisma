# TO BE DONE

=> Usecases and endpoints to handle updating product brands.
=> Usecases and endpoints to handle adding and removing categories from a product.

The above will help to tract and manage the discounts the applied to a product. Will helpt to either remove or add discounts to the product.

CONDITION
\*\* When a new discount is created which needs to be auto applied to products (product_based), filter all products that match the discount criteria and apply the discount on these conditions:
=> First consider the discount rate and apply the discount with highest discount rate (or amount).
=>If discount rates (or amounts) are thesame, apply the discount that will expire soonest
=>If expiry is still same, consider the most recent created discount.
=> Total discount applied for a product cannot be more than 100% (or set percentage by user in settings) of the product.

\*\* When a discount is updated
=> Case where it is deactivated, expired or deleted, we have to remove the discount from the affected products
=> In case where the discount value or rate is changed, update the product accordingly.

NB: We have to keep a record of product's possible discounts so that when a discount is deactivatet, expired or deleted, we apply the next possible discount that applies to the product.
Also worth noting that only one product based discount can be applied to a product at a time.

Any order that needs to be applied automatically (e.g free shipping, discount based on customer status like VIP_CUST) should be applied before application of coupon discounts

In case of coupons (Discount applied at level of the order).
Only one coupon can be applied at a time. Coupon discount should be applied after the application of any shipping discount.

Totall discount applied for a single order should not be more than a specified set amoun by user in settings (default 50%)
