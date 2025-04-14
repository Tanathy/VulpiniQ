Q.CMYK2RGB = (c, m, y, k) => {
  // Calculate RGB values
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  
  // Round values to integers
  return [Math.round(r), Math.round(g), Math.round(b)];
};
