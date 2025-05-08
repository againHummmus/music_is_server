const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function supabase(req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY,
        {
            global: {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : '',
                },
            },
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    );
}

module.exports = {
    supabaseAdmin,
    supabase
};