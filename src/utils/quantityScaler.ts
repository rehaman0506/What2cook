/**
 * Utility for intelligently scaling recipe ingredient quantities
 * based on selected people count / servings.
 */

// Converts fraction strings like "1/2", "3/4", "1 1/2" into numeric decimals
function parseFraction(str: string): number | null {
  const trimmed = str.trim();
  
  // Mixed fraction like "1 1/2"
  if (/^\d+\s+\d+\/\d+$/.test(trimmed)) {
    const [whole, frac] = trimmed.split(/\s+/);
    const [num, den] = frac.split('/').map(Number);
    if (den !== 0) {
      return Number(whole) + num / den;
    }
  }

  // Simple fraction like "1/2" or "3/4"
  if (/^\d+\/\d+$/.test(trimmed)) {
    const [num, den] = trimmed.split('/').map(Number);
    if (den !== 0) {
      return num / den;
    }
  }

  // Pure decimal or integer like "1.5" or "2"
  const num = parseFloat(trimmed);
  return isNaN(num) ? null : num;
}

// Formats a decimal number into clean culinary presentation (e.g. 1.5, 2, 0.5 or 1/2)
function formatCulinaryNumber(val: number): string {
  if (val <= 0) return '0';

  // Round to nearest 2 decimal places
  const rounded = Math.round(val * 100) / 100;

  // Common fraction representations
  const whole = Math.floor(rounded);
  const frac = rounded - whole;

  if (Math.abs(frac - 0.5) < 0.05) {
    return whole > 0 ? `${whole} ½` : '½';
  }
  if (Math.abs(frac - 0.25) < 0.05) {
    return whole > 0 ? `${whole} ¼` : '¼';
  }
  if (Math.abs(frac - 0.75) < 0.05) {
    return whole > 0 ? `${whole} ¾` : '¾';
  }
  if (Math.abs(frac - 0.33) < 0.05) {
    return whole > 0 ? `${whole} ⅓` : '⅓';
  }
  if (Math.abs(frac - 0.67) < 0.05) {
    return whole > 0 ? `${whole} ⅔` : '⅔';
  }

  // Return clean decimal or integer
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1).replace(/\.0$/, '');
}

/**
 * Scales an ingredient quantity string proportionally.
 * Examples:
 * - "2 cups" (servings 2 -> 4) => "4 cups"
 * - "1.5 cups (soaked 30 mins)" => "3 cups (soaked 30 mins)"
 * - "500g" => "1000g"
 * - "1/2 tsp" => "1 tsp"
 * - "to taste" => "to taste"
 */
export function scaleQuantity(
  quantityStr: string,
  originalServings: number,
  targetServings: number
): string {
  if (!quantityStr || originalServings <= 0 || targetServings <= 0) {
    return quantityStr;
  }

  if (originalServings === targetServings) {
    return quantityStr;
  }

  const factor = targetServings / originalServings;

  // Extract parenthetical notes (e.g. "(soaked 20 mins)")
  const parenMatch = quantityStr.match(/\s*(\([^)]*\))/);
  const note = parenMatch ? parenMatch[0] : '';
  const mainPart = note ? quantityStr.replace(note, '').trim() : quantityStr.trim();

  // Qualitative words that should not be mathematically scaled
  const qualitativeRegex = /(to taste|as needed|as required|for garnish|optional|pinch|తగినంత|అవసరమైనంత|आवश्यकतानुसार|स्वादानुसार|इच्छानुसार)/i;
  if (qualitativeRegex.test(mainPart)) {
    return quantityStr;
  }

  // Handle range quantities like "2-3 pieces" or "2 to 3 cups"
  const rangeMatch = mainPart.match(/^(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(.*)$/i);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]) * factor;
    const high = parseFloat(rangeMatch[2]) * factor;
    const unit = rangeMatch[3].trim();
    return `${formatCulinaryNumber(low)} - ${formatCulinaryNumber(high)} ${unit}${note}`.trim();
  }

  // Handle leading mixed fraction or fraction: e.g. "1 1/2 cups" or "1/2 cup" or "1/2 छोटा चम्मच"
  const fracMatch = mainPart.match(/^(\d+\s+\d+\/\d+|\d+\/\d+)\s*(.*)$/);
  if (fracMatch) {
    const parsed = parseFraction(fracMatch[1]);
    if (parsed !== null) {
      const scaled = parsed * factor;
      const unit = fracMatch[2].trim();
      return `${formatCulinaryNumber(scaled)} ${unit}${note}`.trim();
    }
  }

  // Handle standard number with unit: e.g. "500g", "2.5 tbsp", "400 ग्राम", "3 medium"
  const standardMatch = mainPart.match(/^([\d.]+)\s*(.*)$/);
  if (standardMatch) {
    const num = parseFloat(standardMatch[1]);
    if (!isNaN(num)) {
      let scaled = num * factor;
      const unit = standardMatch[2].trim();
      const lowerUnit = unit.toLowerCase();

      // Grams to Kilograms automatic conversion if >= 1000g
      if ((lowerUnit === 'g' || lowerUnit === 'gm' || lowerUnit === 'gram' || lowerUnit === 'grams') && scaled >= 1000) {
        const kg = scaled / 1000;
        return `${formatCulinaryNumber(kg)} kg${note}`.trim();
      }
      if (unit === 'ग्राम' && scaled >= 1000) {
        const kg = scaled / 1000;
        return `${formatCulinaryNumber(kg)} किलोग्राम${note}`.trim();
      }
      if ((unit === 'గ్రాములు' || unit === 'గ్రాం') && scaled >= 1000) {
        const kg = scaled / 1000;
        return `${formatCulinaryNumber(kg)} కిలో${note}`.trim();
      }

      // Milliliters to Liters automatic conversion if >= 1000ml
      if ((lowerUnit === 'ml' || lowerUnit === 'milliliters') && scaled >= 1000) {
        const liters = scaled / 1000;
        return `${formatCulinaryNumber(liters)} L${note}`.trim();
      }
      if (unit === 'मिली' && scaled >= 1000) {
        const liters = scaled / 1000;
        return `${formatCulinaryNumber(liters)} लीटर${note}`.trim();
      }
      if (unit === 'మి.లీ' && scaled >= 1000) {
        const liters = scaled / 1000;
        return `${formatCulinaryNumber(liters)} లీటర్${note}`.trim();
      }

      return `${formatCulinaryNumber(scaled)} ${unit}${note}`.trim();
    }
  }

  return quantityStr;
}
