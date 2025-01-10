// You can modify this file the way you like but make sure to export the router as default so that it initialised in index.ts
import { Router } from 'express';
import expressAdapter from '../../adapters/expressAdapter';
import GetDiscountsController from '../../http/controllers/discounts/getDiscounts';
import CreateDiscountController from '../../http/controllers/discounts/createDiscount';
import GetDiscountController from '../../http/controllers/discounts/getDiscount';
import ValidateDiscoutnController from '../../http/controllers/discounts/validateDiscount';
import ApplyDiscoutnController from '../../http/controllers/discounts/applyDiscount';
import UpdateDiscountController from '../../http/controllers/discounts/updateDiscount';
import DeleteDiscountsController from '../../http/controllers/discounts/deleteDiscounts';
import DeactivateDiscountsController from '../../http/controllers/discounts/deactivateDiscounts';

const router = Router();

// Define your routes here
router
  .route('/')
  .get(expressAdapter(GetDiscountsController))
  .post(expressAdapter(CreateDiscountController));

router.post('/validate', expressAdapter(ValidateDiscoutnController));

router.post('/apply', expressAdapter(ApplyDiscoutnController));

router.put('/deactivate', expressAdapter(DeactivateDiscountsController));

router.post('/delete', expressAdapter(DeleteDiscountsController));

router
  .route('/:id')
  .get(expressAdapter(GetDiscountController))
  .put(expressAdapter(UpdateDiscountController));

export default router;
