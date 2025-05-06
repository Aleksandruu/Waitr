import { current, Draft, PayloadAction } from "@reduxjs/toolkit";

export function primitiveSetter<T>(key: string) {
  return (state: any, action: PayloadAction<T>) => {
    state[key] = action.payload;
  };
}

export const generateSetterReducers = <T>(
  initialState: T
): GeneratorDataRet<T> => {
  const toRet = {} as GeneratorDataRet<T>;
  for (const key in initialState) {
    let type:
      | "undefined"
      | "object"
      | "boolean"
      | "number"
      | "string"
      | "function"
      | "symbol"
      | "bigint"
      | "array" = typeof initialState[key];

    if (Array.isArray(initialState[key])) {
      type = "array";
    }
    const capKey = capitalizeFirstLetter(key);

    switch (type) {
      case "string":
        //@ts-ignore
        toRet["set" + capKey] = primitiveSetter<string>(key);
        break;
      case "boolean":
        //@ts-ignore
        toRet["set" + capKey] = primitiveSetter<boolean>(key);
        break;
      case "number":
        //@ts-ignore
        toRet["set" + capKey] = primitiveSetter<number>(key);
        break;
      case "array":
        //@ts-ignore
        toRet["set" + capKey] = arrSetter<boolean>(key);
        //@ts-ignore
        toRet["set" + capKey + "inArray"] = inArrSetter<boolean>(key);
        break;
      case "object":
        //@ts-ignore
        toRet["set" + capKey] = primitiveSetter<number>(key);
        break;
      case "undefined":
        //@ts-ignore
        toRet["set" + capKey] = primitiveSetter<any>(key);
        break;
      default:
        throw new Error(`Not implemented ${type} ${key}`);
    }
  }

  function arrSetter<T>(key: string) {
    return (state: any, action: PayloadAction<T[]>) => {
      state[key] = action.payload;
    };
  }

  function inArrSetter<T>(key: string) {
    return (state: any, action: PayloadAction<T>) => {
      const currentArr = state[key] as T[];
      const index = currentArr.findIndex((item) => item === action.payload);

      if (index === -1) {
        currentArr.push(action.payload);
      } else {
        currentArr.splice(index, 1);
      }
    };
  }

  toRet["setAll"] = (
    state: Draft<T>,
    { payload }: PayloadAction<Partial<T>>
  ) => {
    for (const key in state) {
      const keyStr = key as string;
      if (payload && Object.hasOwnProperty.bind(payload)(keyStr)) {
        //@ts-ignore
        state[keyStr] = payload[keyStr];
      }
    }
  };

  //@ts-ignore
  toRet["setByPath"] = (
    state: Draft<T>,
    { payload }: PayloadAction<{ path: string; value: any }>
  ) => {
    const { value } = payload;
    let { path } = payload;
    path = path.replaceAll(".", "/");
    updateObjByPath(state, path, value);
  };

  toRet["resetState"] = (state: Draft<T>) => {
    //@ts-ignore
    if (state["initialState"] === null) {
      console.warn("Cannot reset state: No initialState", current(state));
      return;
    }
    //@ts-ignore
    for (const key in state["initialState"]) {
      const keyStr = key as string;
      if (
        [
          "initialState",
          "requestInProgress",
          "requestSuccess",
          "requestRejected",
        ].includes(keyStr)
      ) {
        // Do not reset 'setting' keys
        continue;
      }
      //@ts-ignore
      if (!this.doNotResetFields.includes(keyStr)) {
        //@ts-ignore
        state[keyStr] = state["initialState"][keyStr];
      }
    }
  };

  return toRet;
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

type GeneratorDataRet<InitialState> = Record<
  `set${Capitalize<string & keyof NoStringIndex<InitialState>>}`,
  (
    state: Draft<InitialState>,
    { payload }: PayloadAction<ValueOf<InitialState>>
  ) => void
> &
  Record<
    `setAll`,
    (
      state: Draft<InitialState>,
      { payload }: PayloadAction<Partial<InitialState>>
    ) => void
  > &
  Record<`resetState`, (state: Draft<InitialState>) => void>;

type ValueOf<T> = T[keyof T];
type NoStringIndex<T> = {
  [K in keyof T as string extends K ? never : K]: T[K];
};

const updateObjByPath = (obj: any, keyPathUrl: string, value: any) => {
  const keyPath = keyPathUrl.split("/"); // split key path string
  const lastKeyIndex = keyPath.length - 1;
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];

    // choose if nested object is array or hash based on if key is number
    if (!(key in obj)) obj[key] = parseInt(key) !== parseInt(key) ? {} : [];
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
};
