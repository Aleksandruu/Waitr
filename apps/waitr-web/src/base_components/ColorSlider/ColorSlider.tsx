import { useState } from "react";
import { Slider } from "@mui/material";
import styles from "./ColorSlider.module.scss";
import { parseHsl } from "apps/waitr-web/src/helpers/parseHsl";

interface ColorSlidersProps {
  setColor: (color: string) => void;
  color: string;
}

const ColorSliders = ({ setColor, color }: ColorSlidersProps) => {
  const { h, s, l } = parseHsl(color);
  const [hue, setHue] = useState(h);
  const [saturation, setSaturation] = useState(s);
  const [lightness, setLightness] = useState(l);

  const selectedColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div className={styles.colorSliders}>
      <p>Color:</p>
      <small>
        This color will be used as a theme color for client side as well!
      </small>
      <Slider
        value={hue}
        min={0}
        max={360}
        onChange={(e, newValue) => {
          setHue(newValue as number);
          setColor(selectedColor);
        }}
        sx={{
          color: selectedColor,
        }}
      />
      <p>Saturation:</p>
      <Slider
        value={saturation}
        min={0}
        max={100}
        onChange={(e, newValue) => {
          setSaturation(newValue as number);
          setColor(selectedColor);
        }}
        sx={{
          color: selectedColor,
        }}
      />
      <p>Lightness:</p>
      <Slider
        value={lightness}
        min={0}
        max={40}
        onChange={(e, newValue) => {
          setLightness(newValue as number);
          setColor(selectedColor);
        }}
        sx={{
          color: selectedColor,
        }}
      />
    </div>
  );
};

export default ColorSliders;
