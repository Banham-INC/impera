import { Impera } from "../src";

const EMAIL = "will_banh@google.com";

// Before

let isEmailValid = false;
if (EMAIL.endsWith("google.com")) {
  if (isEmail(EMAIL)) {
    isEmailValid = true;
  }
}
console.log(`Email is valid: ${isEmailValid}`);

// After
const rules = new Impera({
  auth: {
    isEmail: (input: string) => {
      return true;
    },
    endsGoogle: (input: string) => {
      return input.endsWith("google.com");
    },
  },
});

const isValid = rules.ruleSet("auth").multiple(["endsGoogle", "isEmail"]);
console.log(isValid.validate(EMAIL));
console.log(isValid.validate("not_email_ending_in_google@icloud.com"));

function isEmail(str: string): boolean {
  return true;
}
