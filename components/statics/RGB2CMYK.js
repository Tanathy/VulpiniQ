Q.RGB2CMYK = (r, g, b) => {
  // Normalize RGB values to [0,1]
  r = r / 255;
  g = g / 255;
  b = b / 255;
  
  // Find the maximum value among R, G, B
  const k = 1 - Math.max(r, g, b);
  
  // Special case: pure black
  if (k === 1) return [0, 0, 0, 1];
  
  // Calculate C, M, Y
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  
  return [c, m, y, k];
};
