export function getWeekdayNames(
  {
    firstLetterUpperCased,
  }: {
    firstLetterUpperCased: boolean
  } = { firstLetterUpperCased: true }
) {
  return [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ].map((weekday) =>
    firstLetterUpperCased ? upperCaseFirstLetter(weekday) : weekday
  )
}

// private

function upperCaseFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
