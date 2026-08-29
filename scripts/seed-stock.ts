import { PERFUMES } from '@/lib/perfumes'
import { supabaseAdmin } from '@/lib/supabase'

async function seed() {
  const stocks = PERFUMES.map(p => ({
    perfume_id: p.id,
    stock_ml: p.stockMl ?? 60
  }))

  const { error } = await supabaseAdmin.from('stock').upsert(stocks)
  if (error) throw error
  console.log('Seed done:', stocks.length, 'perfumes')
}

seed()