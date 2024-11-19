export type ImperaRule = {
  [k: string]: {
    [z: string]: (str: any) => boolean;
  };
};

export type ValidStatement = {
  value: boolean;
  message: string;
};

export class ImperaHandler<Keys extends ((s: any) => boolean)[], Z> {
  private _fns: Keys;
  private _fns_name: Z;
  private _conditions:
    | Partial<{
        //@ts-ignore
        [z in Z]: string;
      }>
    | undefined
    | null;
  constructor(functions: Keys) {
    this._fns = functions;
    this._fns_name = functions.map((z) => z.name) as Z;
  }

  public validateMultiple(
    inputs: string[],
    returnMessages?: Partial<{
      //@ts-ignore
      [z in Z]: string;
    }>
  ) {
    this._conditions = returnMessages;
    const returns: Record<
      string,
      {
        value: boolean;
        message: string;
      }
    > = {};
    inputs.forEach((input) => {
      const res = this.validate(input, returnMessages);
      returns[`${input}`] = res;
    });
    return returns;
  }

  public validateConditions(
    returnMessages?: Partial<{
      //@ts-ignore
      [z in Z]: string;
    }>
  ) {
    this._conditions = returnMessages;
    return this;
  }

  public validate<ValueUnion = any>(
    value: ValueUnion,
    returnMessages?: Partial<{
      //@ts-ignore
      [z in Z]: string;
    }>
  ): ValidStatement {
    this._conditions = returnMessages;
    const returnedMapped = this._fns.map((z) => z(value));
    let returnedState: ValidStatement = {
      value: true,
      message: "Input is valid.",
    };
    returnedMapped.forEach((v, i) => {
      const rawFunction = this._fns[i];
      let defaultMessage = `Input value failed to validate in "${rawFunction.name}".`;
      if (!v) {
        returnedState = {
          value: false,
          message: returnMessages
            ? (returnMessages[rawFunction.name as Z] as string)
            : defaultMessage,
        };
      }
    });
    return returnedState;
  }
}

export default class Impera<K extends ImperaRule = ImperaRule> {
  private _rules: K;
  constructor(rules: K) {
    this._rules = rules;
  }

  private multiple<Keys extends (keyof K[keyof K])[]>(T: keyof K) {
    type SingleKeyEnum = keyof K[typeof T];
    return (functions: Keys) => {
      const functionsMapped = functions.map((key) => this._rules[T][key]);
      return new ImperaHandler<typeof functionsMapped, SingleKeyEnum>(
        functionsMapped
      );
    };
  }

  private single<Keys extends keyof K[keyof K]>(T: keyof K) {
    type SingleKeyEnum = keyof K[typeof T];
    return (functionSingle: Keys) => {
      const singleFunction = this._rules[T][functionSingle];
      return new ImperaHandler<(typeof singleFunction)[], SingleKeyEnum>([
        singleFunction,
      ]);
    };
  }

  public ruleSet(T: keyof K) {
    type DynamicFunctionKeys = keyof (typeof this._rules)[typeof T];
    return {
      multiple: this.multiple<DynamicFunctionKeys[]>(T),
      single: this.single<DynamicFunctionKeys>(T),
      rawFunctions: { ...this._rules[T] },
    };
  }
}
