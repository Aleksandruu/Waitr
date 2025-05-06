import tinycolor from "tinycolor2";

export function generateColorVars(baseColor: string) {
  const color = tinycolor(baseColor);

  const vars = {
    "--color-brand": color.toHexString(),
    "--color-brand-light": color.lighten(20).desaturate(20).toHexString(),
    "--color-brand-dark": color.darken(20).toHexString(),
  };
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}
