import { supabase } from './supabase'

export async function generateInvoiceNumber(): Promise<string> {
  const { data, error } = await supabase.rpc('increment_invoice_counter')
  if (error) throw error
  return data as string
}
