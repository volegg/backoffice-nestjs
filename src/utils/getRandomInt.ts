export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  if (min > max) {
    throw new Error(`Minimum value (${min}) should be less or equal to Maximum (${max})`);
  }

  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
