/**
 * @param {Date} date
 */
export function getDays(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}.${month}.${day}`
}