# Impera

Simple validation library built in Typescript. Fully typesafe conditioning - Allows for multiple/single validators with multiple/single inputs.

### Example

```ts
import { Impera } from "@baninc/impera";

const validator = new Impera({
  auth: {
    isNumber: (number: string) => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(number);
    },
    isEmail: (email: string) => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    },
  },
});
```

_Single Rule Validtations_

```ts
const authRuleSetEmail = validator.ruleSet("auth").single("isEmail");
console.log(authRuleSetEmail.validate("not-email.com"));

/* Output:
    {
        value: false,
        message: "Input value failed to validate in \"isEmail\".",
    }
*/

const authRuleSetEmailCon = validator
  .ruleSet("auth")
  .single("isEmail")
  .validateConditions({
    isEmail: "Not valid email.",
  });

console.log(authRuleSetEmailCon.validate("not-valid-email.com"));

/* Output:
    {
        value: false,
        message: "Not valid email.",
    }
*/

console.log(
  authRuleSetEmailCon.validateMultiple([
    "not-valid-email.com",
    "valid@email.com",
  ])
);

/* Output:
  {
    "not-valid-email.com": {
      value: false,
      message: "Not valid email.",
    },
    "valid@email.com": {
      value: true,
      message: "Input is valid.",
    },
  }
*/
```


# More examples to come...