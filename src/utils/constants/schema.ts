import * as Yup from 'yup';
import { STRINGS } from './strings';

export const assetValidationSchema = Yup.object().shape({
  name: Yup.string().required(STRINGS.REQUIRED_NAME),
  description: Yup.string().required(STRINGS.REQUIRED_DESCRIPTION),
  price: Yup.number()
    .required(STRINGS.REQUIRED_PRICE)
    .min(1, STRINGS.errorMessage.validPrice),
  currency: Yup.string().required(STRINGS.REQUIRED_CURRENCY),
  tags: Yup.array().required(STRINGS.REQUIRED_TAGS),
});
