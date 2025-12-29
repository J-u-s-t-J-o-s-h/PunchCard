
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to check role
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Auto-create profile if missing (resilience)
  if (!profile && error) {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({ id: user.id, full_name: user.email?.split('@')[0], role: 'employee' })
      .select()
      .single()

    if (!createError) {
      profile = newProfile
    }
  }

  if (profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/employee')
  }
}
