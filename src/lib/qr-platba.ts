import QRCode from 'qrcode'

export function buildSpdString(params: {
  iban: string
  amount: number
  invoiceNumber: string
  message?: string
}): string {
  const am = params.amount.toFixed(2)
  const vs = params.invoiceNumber.replace(/\D/g, '').slice(0, 10)
  const msg = (params.message || `Faktura ${params.invoiceNumber}`).slice(0, 60)
  return `SPD*1.0*ACC:${params.iban}*AM:${am}*CC:CZK*MSG:${msg}*X-VS:${vs}`
}

export async function generateQrDataUrl(spdString: string): Promise<string> {
  return QRCode.toDataURL(spdString, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 200,
  })
}
