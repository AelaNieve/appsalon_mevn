// frontend\src\helpers\passwordValidation.js

export const MIN_PASSWORD_LENGTH = 16
export const HAS_UPPERCASE_REGEX = /[A-Z]/
export const HAS_LOWERCASE_REGEX = /[a-z]/
export const HAS_NUMBER_REGEX = /[0-9]/
export const HAS_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/
export const REPEATING_CHARS_REGEX = /(.)\1{3,}/
export const SIMPLE_NUMBER_SEQUENCES_REGEX =
  /123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321/
export const SIMPLE_ALPHABET_SEQUENCES_REGEX =
  /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i

// Define password validation rules with descriptive messages
export const passwordRules = [
  {
    test: (value) => value && value.length >= MIN_PASSWORD_LENGTH,
    message: `Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
  },
  {
    test: (value) => value && HAS_UPPERCASE_REGEX.test(value),
    message: 'Debe incluir al menos una letra mayúscula',
  },
  {
    test: (value) => value && HAS_LOWERCASE_REGEX.test(value),
    message: 'Debe incluir al menos una letra minúscula',
  },
  {
    test: (value) => value && HAS_NUMBER_REGEX.test(value),
    message: 'Debe incluir al menos un número',
  },
  {
    test: (value) => value && HAS_SPECIAL_CHAR_REGEX.test(value),
    message: 'Debe incluir al menos un carácter especial (ej. !@#$%^&*)',
  },
  {
    test: (value) => value && !REPEATING_CHARS_REGEX.test(value),
    message: 'No debe tener secuencias de caracteres repetidos (ej. "aaaa")',
  },
  {
    test: (value) => value && !SIMPLE_NUMBER_SEQUENCES_REGEX.test(value),
    message: 'No debe contener secuencias numéricas simples (ej. "1234")',
  },
  {
    test: (value) => value && !SIMPLE_ALPHABET_SEQUENCES_REGEX.test(value),
    message: 'No debe contener secuencias alfabéticas simples (ej. "abcd")',
  },
]
