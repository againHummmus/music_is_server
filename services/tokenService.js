const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');


class TokenService {
    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });        
        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const { data: tokenData, error } = await this.supabase
            .from('Token')
            .select('*')
            .eq('userId', userId)
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        if (tokenData) {
            const { data: updatedToken, error: updateError } = await this.supabase
                .from('Token')
                .update({ 'refresh_token': refreshToken })
                .eq('userId', userId)
                .maybeSingle();

            if (updateError) {
                throw new Error(updateError.message);
            }
            return updatedToken;
        } else {
            const { data: newToken, error: insertError } = await this.supabase
                .from('Token')
                .insert([{ userId, 'refresh_token': refreshToken }])
                .maybeSingle();

            if (insertError) {
                throw new Error(insertError.message);
            }
            return newToken;
        }
    }

    async removeToken(refreshToken) {
        const { data, error } = await this.supabase
            .from('Token')
            .delete()
            .eq('refresh_token', refreshToken);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async findToken(refreshToken) {
        const { data, error } = await this.supabase
            .from('Token')
            .select('*')
            .eq('refresh_token', refreshToken)
            .maybeSingle();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}

module.exports = new TokenService();
