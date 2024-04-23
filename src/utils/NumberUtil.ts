export class NumberUtil {
  static formatThousands = (v?: number | string, decimals = 0): string => {
    return this.toFixed(v, decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  static toFixed = (v?: number | string, decimals = 0, fill = false): string => {
    const numberValue = Number(v ?? 0)
    let numberStr = numberValue.toString()

    // Check if the number is in scientific notation
    if (numberValue.toString().toLowerCase().includes('e')) {
      // If in scientific notation, convert to string preserving decimal places
      numberStr = numberValue.toFixed(18).replace(/\.?0+$/, '')
      decimals = 18
    }

    // trim decimals as string to prevent rounding
    const [intPart, floatPart] = numberStr.split('.')
    return `${intPart}${
      decimals > 0
        ? `.${Array.from(
            { length: decimals },
            (_, i) => floatPart?.[i] ?? (fill || i == 0 ? 0 : '')
          ).join('')}`
        : ''
    }`
  }
}
