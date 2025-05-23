const jwt = require('jsonwebtoken');

class TokenService {
    generateTokens(userDto) {
        const accessPayload = {
            id: userDto.id.toString(),
            sub: userDto.sub,
            role: 'authenticated',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            email: userDto.email,
            is_activated: userDto.is_activated,
            app_role: userDto.role,
        };

        const refreshPayload = {
            id: userDto.id.toString(),
            sub: userDto.sub,
            role: 'authenticated',
            type: 'refresh',
            iat: Math.floor(Date.now() / 1000),
            email: userDto.email,
            is_activated: userDto.is_activated,
            app_role: userDto.role,
        };

        const access_token = jwt.sign(
            accessPayload,
            process.env.SUPABASE_JWT_SECRET,
            { algorithm: 'HS256' }
        );
        const refresh_token = jwt.sign(
            refreshPayload,
            process.env.SUPABASE_JWT_SECRET,
            { algorithm: 'HS256' }
        );

        return { access_token, refresh_token };
    }

    validateaccess_token(token) {
        try {
            const userData = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
            return userData;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    validaterefresh_token(token) {
        try {
            const userData = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
}

module.exports = new TokenService();
