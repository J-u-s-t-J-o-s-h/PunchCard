
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    full_name: string | null
                    avatar_url: string | null
                    role: 'employee' | 'admin'
                    team_id: string | null
                }
                Insert: {
                    id: string
                    created_at?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'employee' | 'admin'
                    team_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'employee' | 'admin'
                    team_id?: string | null
                }
            }
            // Add other tables here as needed or run supabase gen types
        }
    }
}
