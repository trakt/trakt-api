import { Validator } from '@seriousme/openapi-schema-validator';
import { generate } from './generate.ts';

async function validate() {
  const validator = new Validator();
  const { valid, errors } = await validator.validate(generate());

  if (!valid) {
    if (errors == null) {
      return;
    }

    console.error(errors);
    process.exit(1);
  }
}

validate();
