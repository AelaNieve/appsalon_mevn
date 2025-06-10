import { parse, formatISO, parseISO, format } from 'date-fns'
import es from 'date-fns/locale/es'

// FIX: Change the parsing format from 'dd/MM/yyyy' to 'yyyy-MM-dd'
export function convertToISO(strDate) {
  if (!strDate) return null // Guard clause for empty dates
  const newDate = parse(strDate, 'yyyy-MM-dd', new Date())
  return formatISO(newDate)
}

export function displayDate(date) {
  const newDate = parseISO(date)
  const formattedDate = format(newDate, 'PPPP', { locale: es })
  return formattedDate
}

// FIX: This function is no longer needed in the store's logic
// but may be useful elsewhere.
export function convertToDDMMYYYY(isoDate) {
  const newDate = new Date(isoDate)
  const formattedDate = format(newDate, 'dd/MM/yyyy')
  return formattedDate
}

// ADD: A new helper to format ISO dates for the date input
export function toYYYYMMDD(isoDate) {
  if (!isoDate) return ''
  const newDate = parseISO(isoDate)
  return format(newDate, 'yyyy-MM-dd')
}
