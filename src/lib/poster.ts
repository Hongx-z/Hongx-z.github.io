/**
 * Procedural poster art.
 *
 * Documentary entries often exist before a still has been pulled from the
 * edit. Rather than show a broken image, we derive a stable, muted two-tone
 * wash from the film's slug so the grid still reads as a contact sheet.
 */

/** Small deterministic string hash — the same seed always gives the same wash. */
function hash(input: string): number {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) | 0;
  }
  return Math.abs(value);
}

/** A CSS `background` value for the given seed. */
export function posterBackground(seed: string): string {
  const hue = hash(seed) % 360;
  const second = (hue + 38) % 360;
  return `linear-gradient(150deg, hsl(${hue} 20% 34%) 0%, hsl(${second} 16% 15%) 100%)`;
}
