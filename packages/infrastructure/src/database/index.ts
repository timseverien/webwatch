import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';
import type { Database } from './.supabase-types.js';

export type DatabaseClient = SupabaseClient<Database>;

export function getClient(
	url: string = process.env.SUPABASE_URL!,
	key: string = process.env.SUPABASE_KEY!,
): DatabaseClient {
	return createClient<Database>(url, key, {
		db: {
			schema: 'public',
		},
		auth: {
			autoRefreshToken: false,
			persistSession: false,
			detectSessionInUrl: false,
		},
	});
}
