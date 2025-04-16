import tinycolor from "tinycolor2";

export function generateColorVars(baseColor: string) {
  const color = tinycolor(baseColor);

  return {
    "--color-primary": color.toHexString(),
    "--color-primary-light": color.lighten(10).toHexString(),
    "--color-primary-dark": color.darken(10).toHexString(),
    "--color-primary-contrast": color.isLight() ? "#000" : "#fff",
  };
}
