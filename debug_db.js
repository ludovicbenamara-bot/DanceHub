
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), 'frontend/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl);
console.log('Key (first 5 chars):', supabaseKey ? supabaseKey.substring(0, 5) : 'MISSING');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to teachers table...');

    const { data, error } = await supabase
        .from('teachers')
        .select('*');

    if (error) {
        console.error('Error fetching teachers:', error);
    } else {
        console.log(`Success! Found ${data.length} teachers.`);
        console.log('Data:', data);
    }
}

testConnection();
