const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models')

const generateJwt = (id, email) => {
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class userService {
    async registration({username, email, password}) {
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return {
                success: false,
                message: 'Email is already in use!',
            };
        }
        const hashPassword = await bcrypt.hash(password, 5)

        const user = await User.create({username, email, password: hashPassword})
        const token = generateJwt(user.id, user.email)
        return {
            success: true,
            message: 'Success!',
            token
        };
    }

    async login({email, password}) {
        const user = await User.findOne({where: {email}})
        if (!user) {
            return {
                success: false,
                message: 'User does not exist!',
            };
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return {
                success: false,
                message: 'Wrong password!',
            };
        }
        const token = generateJwt(user.id, user.email)
        return {
            success: true,
            message: 'Success!',
            token
        };
    }

    async getOneUser({id}) {
        const user = await User.findOne({where: {id}})
        if (!user) {
            return {
                success: false,
                message: 'User does not exist!',
            };
        } else {
            return {
                success: true,
                message: 'Success!',
                user,
            };
        }
    }

    async updateOneUser({id, newUsername}) {
        const user = await User.findOne({where: {id}})
        if (!user) {
            return {
                success: false,
                message: 'User does not exist!',
            };
        }
        user.username = newUsername

        await user.save();
        return {
            success: true,
            message: 'Success!',
            user
        };
    }

    async deleteUser({id}) {
        await User.destroy({where: {id}})
        return {
            success: true,
            message: 'Success!',
        };
    }
}

module.exports = new userService()