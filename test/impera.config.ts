import { Impera } from "../src/";

const impera = new Impera({
  auth: {
    isEmail: (str: string) => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str);
    },
    isNumber: (str: string) => {
      return /^(\+?\d{1,3}[-\s]?)?(\(?\d{1,4}\)?[-\s]?)?(\d{1,4}[-\s]?)?\d{1,4}[-\s]?\d{1,4}$/.test(
        str
      );
    },
  },
});

const res = impera.ruleSet("auth").single("isEmail").validateConditions({
  isEmail: "Emailed problem",
});

const response = res.validate("will_banh.com");

console.log(response);
