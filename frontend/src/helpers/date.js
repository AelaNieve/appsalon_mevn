// frontend\src\helpers\date.js
import { parse } from 'date-fns'

export function convertToISO(strDate) {
  //console.log(strDate)
  const newDate = parse(strDate, 'yyyy-MM-dd', new Date()) // Changed to yyyy-MM-dd
  return newDate
}
