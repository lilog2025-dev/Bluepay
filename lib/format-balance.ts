// Format balance to NGN currency format
// Examples: 250000 => "NGN250,000.00"
export const formatBalance = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'NGN0.00'
  }

  // Ensure we have a valid number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  // Format with 2 decimal places and comma separators
  const formatted = numAmount.toFixed(2)
  const [wholePart, decimalPart] = formatted.split('.')

  // Add comma separators to whole part
  const withCommas = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return `NGN${withCommas}.${decimalPart}`
}

// Parse NGN formatted string back to number
// Examples: "NGN250,000.00" => 250000
export const parseBalance = (formatted: string): number => {
  if (!formatted) return 0
  const cleaned = formatted.replace(/NGN|,/g, '')
  return parseFloat(cleaned) || 0
}
