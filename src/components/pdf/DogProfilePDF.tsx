import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import type { Dog, DogTag, Owner } from '@/lib/database.types'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', gap: 20, marginBottom: 20, alignItems: 'flex-start' },
  photo: { width: 100, height: 100, borderRadius: 8, objectFit: 'cover' },
  photoPlaceholder: { width: 100, height: 100, backgroundColor: '#e5e7eb', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1e40af', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: { fontSize: 8, color: '#ffffff', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 10 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 130, fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#374151' },
  value: { flex: 1, fontSize: 10, color: '#374151' },
  note: { fontSize: 10, color: '#374151', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af' },
})

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

interface DogProfilePDFProps {
  dog: Dog
  owner: Owner | null
  tags: DogTag[]
  primaryPhotoUrl?: string | null
}

export function DogProfilePDF({ dog, owner, tags, primaryPhotoUrl }: DogProfilePDFProps) {
  return (
    <Document title={`Hlídací karta — ${dog.name}`} author="Dogoteka">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {primaryPhotoUrl ? (
            <Image src={primaryPhotoUrl} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>{dog.name}</Text>
            {dog.breed && <Text style={styles.subtitle}>{dog.breed}</Text>}
            {tags.length > 0 && (
              <View style={styles.tagRow}>
                {tags.map((tag) => (
                  <Text key={tag.id} style={{ ...styles.tag, backgroundColor: tag.color }}>
                    {tag.label}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identifikace</Text>
          <Field label="Číslo pasu / průkazu" value={dog.passport_number} />
          <Field label="Číslo čipu / tetování" value={dog.chip_number} />
          {dog.weight_kg && <Field label="Hmotnost" value={`${dog.weight_kg} kg`} />}
        </View>

        {(dog.food_notes || dog.medication) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Péče a zdraví</Text>
            {dog.food_notes && (
              <>
                <Text style={{ ...styles.label, marginBottom: 2 }}>Krmení a dieta:</Text>
                <Text style={styles.note}>{dog.food_notes}</Text>
              </>
            )}
            {dog.medication && (
              <>
                <Text style={{ ...styles.label, marginBottom: 2, marginTop: 6 }}>Léky:</Text>
                <Text style={styles.note}>{dog.medication}</Text>
              </>
            )}
          </View>
        )}

        {(dog.vet_name || dog.vet_phone) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Veterinář</Text>
            <Field label="Jméno" value={dog.vet_name} />
            <Field label="Telefon" value={dog.vet_phone} />
          </View>
        )}

        {owner && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Majitel</Text>
            <Field label="Jméno" value={`${owner.first_name} ${owner.last_name}`} />
            <Field label="Telefon" value={owner.phone} />
            <Field label="Záchranný kontakt" value={owner.phone_emergency} />
            <Field label="E-mail" value={owner.email} />
            <Field label="Adresa" value={owner.address} />
          </View>
        )}

        {dog.extra_notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Další poznámky</Text>
            <Text style={styles.note}>{dog.extra_notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>Dogoteka — hlídací karta vygenerována {new Date().toLocaleDateString('cs-CZ')}</Text>
      </Page>
    </Document>
  )
}
