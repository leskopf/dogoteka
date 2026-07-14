import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { Payment, Settings } from '@/lib/database.types'

const origin = window.location.origin
Font.register({
  family: 'Roboto',
  fonts: [
    { src: `${origin}/fonts/Roboto-Regular.ttf`, fontWeight: 'normal' },
    { src: `${origin}/fonts/Roboto-Bold.ttf`, fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Roboto', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  headerLeft: { flex: 1 },
  headerRight: { flex: 1, alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 24, fontFamily: 'Roboto', fontWeight: 'bold', color: '#1e40af', marginBottom: 4 },
  invoiceNumber: { fontSize: 11, color: '#374151', marginBottom: 2 },
  invoiceDate: { fontSize: 10, color: '#6b7280' },
  issuerLine: { fontSize: 10, color: '#374151', marginBottom: 2, textAlign: 'right' },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Roboto', fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 130, fontSize: 10, fontFamily: 'Roboto', fontWeight: 'bold', color: '#374151' },
  value: { flex: 1, fontSize: 10, color: '#374151' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tableDesc: { flex: 1, fontSize: 10, color: '#374151' },
  tableAmount: { fontSize: 10, color: '#374151', textAlign: 'right' },
  tableTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  tableTotalDesc: { flex: 1, fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: '#111827' },
  tableTotalAmount: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
  },
})

function formatCzk(amount: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
  }).format(amount)
}

export interface InvoicePDFProps {
  payment: Payment
  stay: { date_from: string; date_to: string; time_from?: string | null; time_to?: string | null }
  dogName: string
  owner: { first_name: string; last_name: string; address?: string | null; phone?: string | null; email?: string | null } | null
  settings: Settings
  qrDataUrl: string | null
  dueDate?: string
}

export function InvoicePDF({ payment, stay, dogName, owner, settings, qrDataUrl, dueDate }: InvoicePDFProps) {
  const today = new Date().toLocaleDateString('cs-CZ')
  const dateFrom = new Date(stay.date_from).toLocaleDateString('cs-CZ')
  const dateTo = new Date(stay.date_to).toLocaleDateString('cs-CZ')
  const nights = Math.round(
    (new Date(stay.date_to).getTime() - new Date(stay.date_from).getTime()) / 86400000,
  )
  const nightsLabel = nights === 0 ? (stay.time_from && stay.time_to ? `Částečný den (${stay.time_from}–${stay.time_to})` : 'Částečný den') : `${nights} ${nights === 1 ? 'noc' : nights < 5 ? 'noci' : 'nocí'}`
  const paymentTypeLabel = payment.type === 'deposit' ? 'Záloha za pobyt' : 'Doplatek za pobyt'
  const ownerName = owner ? `${owner.first_name} ${owner.last_name}` : 'Neuvedeno'
  const hasBank = settings.bank_account || settings.bank_iban

  return (
    <Document title={`Faktura ${payment.invoice_number ?? ''}`} author="Dogoteka">
      <Page size="A4" style={styles.page}>
        {/* Hlavička */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceTitle}>FAKTURA</Text>
            {payment.invoice_number && (
              <Text style={styles.invoiceNumber}>Číslo: {payment.invoice_number}</Text>
            )}
            <Text style={styles.invoiceDate}>Datum vystavení: {today}</Text>
          </View>
          <View style={styles.headerRight}>
            {settings.issuer_name && (
              <Text style={styles.issuerLine}>{settings.issuer_name}</Text>
            )}
            {settings.issuer_address && (
              <Text style={styles.issuerLine}>{settings.issuer_address}</Text>
            )}
            {settings.issuer_ico && (
              <Text style={styles.issuerLine}>IČO: {settings.issuer_ico}</Text>
            )}
            {settings.issuer_dic && (
              <Text style={styles.issuerLine}>DIČ: {settings.issuer_dic}</Text>
            )}
            {settings.issuer_phone && (
              <Text style={styles.issuerLine}>{settings.issuer_phone}</Text>
            )}
            {settings.issuer_email && (
              <Text style={styles.issuerLine}>{settings.issuer_email}</Text>
            )}
            {settings.issuer_web && (
              <Text style={styles.issuerLine}>{settings.issuer_web}</Text>
            )}
          </View>
        </View>

        {/* Příjemce */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Příjemce</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Jméno:</Text>
            <Text style={styles.value}>{ownerName}</Text>
          </View>
          {owner?.address && (
            <View style={styles.row}>
              <Text style={styles.label}>Adresa:</Text>
              <Text style={styles.value}>{owner.address}</Text>
            </View>
          )}
          {owner?.phone && (
            <View style={styles.row}>
              <Text style={styles.label}>Telefon:</Text>
              <Text style={styles.value}>{owner.phone}</Text>
            </View>
          )}
          {owner?.email && (
            <View style={styles.row}>
              <Text style={styles.label}>E-mail:</Text>
              <Text style={styles.value}>{owner.email}</Text>
            </View>
          )}
        </View>

        {/* Předmět a specifikace */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Předmět plnění</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Popis:</Text>
            <Text style={styles.value}>Pobyt psa {dogName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Období:</Text>
            <Text style={styles.value}>Od {dateFrom} do {dateTo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Počet nocí:</Text>
            <Text style={styles.value}>{nightsLabel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Typ platby:</Text>
            <Text style={styles.value}>{paymentTypeLabel}</Text>
          </View>
          {dueDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Splatnost:</Text>
              <Text style={styles.value}>{new Date(dueDate).toLocaleDateString('cs-CZ')}</Text>
            </View>
          )}
        </View>

        {/* Tabulka platby */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vyúčtování</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableDesc}>{paymentTypeLabel}</Text>
            <Text style={styles.tableAmount}>{formatCzk(payment.amount)}</Text>
          </View>
          <View style={styles.tableTotalRow}>
            <Text style={styles.tableTotalDesc}>Celkem k úhradě</Text>
            <Text style={styles.tableTotalAmount}>{formatCzk(payment.amount)}</Text>
          </View>
        </View>

        {/* Platební údaje */}
        {hasBank && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Platební údaje</Text>
            {settings.bank_account && (
              <View style={styles.row}>
                <Text style={styles.label}>Číslo účtu:</Text>
                <Text style={styles.value}>{settings.bank_account}</Text>
              </View>
            )}
            {settings.bank_iban && (
              <View style={styles.row}>
                <Text style={styles.label}>IBAN:</Text>
                <Text style={styles.value}>{settings.bank_iban}</Text>
              </View>
            )}
            {settings.bank_name && (
              <View style={styles.row}>
                <Text style={styles.label}>Banka:</Text>
                <Text style={styles.value}>{settings.bank_name}</Text>
              </View>
            )}
            {payment.invoice_number && (
              <View style={styles.row}>
                <Text style={styles.label}>Variabilní symbol:</Text>
                <Text style={styles.value}>{payment.invoice_number}</Text>
              </View>
            )}
          </View>
        )}

        {/* QR platba */}
        {qrDataUrl !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QR Platba</Text>
            <Image src={qrDataUrl} style={{ width: 120, height: 120 }} />
          </View>
        )}

        <Text style={styles.footer}>
          Faktura vystavena systémem Dogoteka · {today}
        </Text>
      </Page>
    </Document>
  )
}
