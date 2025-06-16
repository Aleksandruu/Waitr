interface Fields {
  [key: string]: string | number | boolean | File;
}

interface Body {
  [key: string]: string | number | boolean | File;
}

export const validateFields = (fields: Fields, body: Body): void => {
  const fieldNames = Object.keys(fields);
  fieldNames.filter((field) => {
    return field !== "photo";
  });
  const missingFields = fieldNames.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
};
