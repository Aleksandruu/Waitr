interface Fields {
  [key: string]: string | number | boolean;
}

interface Body {
  [key: string]: string | number | boolean;
}

export const validateFields = (fields: Fields, body: Body): void => {
  const fieldNames = Object.keys(fields);
  const missingFields = fieldNames.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
};
