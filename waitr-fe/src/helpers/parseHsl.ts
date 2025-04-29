export function parseHsl(hslString: string) {
  const regex = /hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/i;
  const result = hslString.match(regex);

  if (!result) {
    throw new Error("Invalid HSL string format");
  }

  const [, h, s, l] = result;

  return {
    h: parseFloat(h),
    s: parseFloat(s),
    l: parseFloat(l),
  };
}
