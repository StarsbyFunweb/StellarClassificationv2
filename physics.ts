export const SUN_TEMP = 5778;

export function calcMainSequence(mass: number) {
  const luminosity = Math.pow(mass, 3.5);
  const radius = mass < 1 ? Math.pow(mass, 0.8) : Math.pow(mass, 0.57);
  const temperature = SUN_TEMP * Math.pow(luminosity / Math.pow(radius, 2), 0.25);
  return { luminosity, radius, temperature };
}

export function applyAgeEffects(mass: number, age: number, baseL: number, baseR: number, baseT: number) {
  // Simple approximation of stellar evolution
  // Age is 0 (ZAMS) to 1 (End of life)
  
  let r = baseR;
  let t = baseT;
  let l = baseL;

  if (age > 0.8) {
    // Red Giant / Supergiant phase
    const expansionFactor = 1 + (age - 0.8) * 50 * Math.pow(mass, 0.5); // Expands significantly
    r *= expansionFactor;
    // Temperature drops as it expands, but luminosity might increase slightly
    t = Math.max(2500, baseT * Math.pow(expansionFactor, -0.4));
    l = Math.pow(r, 2) * Math.pow(t / SUN_TEMP, 4);
  } else {
    // Main sequence gradual brightening and slight expansion
    const msFactor = 1 + age * 0.2; // 20% increase over MS
    l *= msFactor;
    r *= Math.pow(msFactor, 0.5); // Slight expansion
    t = SUN_TEMP * Math.pow(l / Math.pow(r, 2), 0.25);
  }

  return { luminosity: l, radius: r, temperature: t };
}

export function getSpectralClass(temp: number) {
  if (temp >= 30000) return 'O';
  if (temp >= 10000) return 'B';
  if (temp >= 7500) return 'A';
  if (temp >= 6000) return 'F';
  if (temp >= 5200) return 'G';
  if (temp >= 3700) return 'K';
  return 'M';
}

export function tempToRGB(temp: number) {
  let tempValue = temp / 100;
  let red, green, blue;

  if (tempValue <= 66) {
    red = 255;
    green = tempValue;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if (tempValue <= 19) {
      blue = 0;
    } else {
      blue = tempValue - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }
  } else {
    red = tempValue - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    green = tempValue - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    blue = 255;
  }

  const clamp = (x: number) => Math.max(0, Math.min(255, Math.round(x)));
  return [clamp(red) / 255, clamp(green) / 255, clamp(blue) / 255];
}

export function getFeedbackText(mass: number, age: number, spectralClass: string) {
  let stage = "Main Sequence";
  if (age > 0.8) {
    stage = mass > 8 ? "Red Supergiant" : "Red Giant";
  } else if (age < 0.1) {
    stage = "Young Star";
  }

  const descriptions: Record<string, string> = {
    'O': "O-type stars are rare cosmic sprinters, burning fuel fast and bright.",
    'B': "B-type stars are extremely luminous and blue, often found in young clusters.",
    'A': "A-type stars are hot, white stars with strong hydrogen lines, like Sirius.",
    'F': "F-type stars are yellow-white and slightly hotter and more massive than the Sun.",
    'G': "G-type stars are yellow stars like our Sun, providing stable habitable zones.",
    'K': "K-type stars are orange dwarfs, burning fuel slowly and living for tens of billions of years.",
    'M': "M-type stars are red dwarfs, the most common and longest-lived stars in the universe."
  };

  return `The star is currently a ${spectralClass}-type ${stage}. ${descriptions[spectralClass] || ""}`;
}

export function getAccurateStarClassification(mass: number, temp: number, radius: number, luminosity: number): string {
  // White Dwarfs
  if (radius <= 0.05 && temp >= 3000) return "White Dwarf Remnant";
  
  // Brown Dwarfs
  if (mass < 0.08 || temp < 2500) return "Brown Dwarf";

  // Hypergiants
  if (radius >= 1000 || luminosity >= 500000) {
    if (temp < 5000) return "Red Hypergiant";
    if (temp >= 10000) return "Blue Hypergiant";
    return "Yellow Hypergiant";
  }

  // Supergiants
  if (radius >= 100 || luminosity >= 10000) {
    if (temp < 5000) return "Red Supergiant";
    if (temp >= 10000) return "Blue Supergiant";
    return "Yellow Supergiant";
  }

  // Giants
  if (radius >= 10 || luminosity >= 100) {
    if (temp < 5000) return "Red Giant";
    if (temp >= 10000) return "Blue Giant";
    return "Yellow Giant";
  }

  // Subgiants
  if (radius >= 2.5 && luminosity >= 5) {
    return "Subgiant";
  }

  // Main Sequence (Dwarfs)
  if (temp >= 30000) return "O-Type Main Sequence";
  if (temp >= 10000) return "B-Type Main Sequence";
  if (temp >= 7500) return "A-Type Main Sequence";
  if (temp >= 6000) return "F-Type Main Sequence";
  if (temp >= 5200) return "G-Type (Yellow Dwarf)";
  if (temp >= 3700) return "K-Type (Orange Dwarf)";
  return "M-Type (Red Dwarf)";
}
