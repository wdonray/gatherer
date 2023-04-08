export function selectRandomType(options) {
  const totalProbability = options.reduce(
    (sum, option) => sum + option.chance,
    0
  );
  let randomValue = Math.random() * totalProbability;

  for (const { type, chance } of options) {
    if (randomValue <= chance) {
      return type;
    }
    randomValue -= chance;
  }

  return options[options.length - 1].type;
}
