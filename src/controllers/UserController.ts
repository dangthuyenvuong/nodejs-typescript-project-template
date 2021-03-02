import Token from "models/Token";
import User from "models/User";
import md5 from 'md5'
import { NextFunction, Request, Response } from "express";

interface IUserRequest extends Request {
    user?: any
}

export default {
    login: async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body
        const user = await User.findOne({ username, password: md5(<string>password) })
        if (user) {
            return res.json({
                username,
                token: await Token.createToken(user)
            })
        }

        return res.status(500).json({
            message: 'Username or Password not exits!'
        })
    },
    register: async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (user) {
            return res.status(500).json({
                message: 'User have exits!'
            })
        }

        const register = new User({ ...req.body, username, password: md5(password) })
        return register.save()
            .then(async (result) => {
                const user = JSON.parse(JSON.stringify(result))

                delete user.password
                delete user.id
                delete user.__v
                delete user.createdAt
                delete user.updatedAt


                return res.json({
                    user,
                    token: await Token.createToken(user)
                })
            })
            .catch(error => res.status(500).json({
                message: error.message,
                error
            }))


    },
    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.body

        if (refreshToken == null) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_REQUIRED',
                message: 'refreshToken is required'
            });
        }


        const token = await Token.findOne({ refreshToken })


        if (!token) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_NOT_EXISTS',
                message: 'refreshToken not exists'
            });
        }

        return res.json({
            accessToken: await Token.refreshToken(refreshToken, res)
        })

    },
    updateInfo: async (req: IUserRequest, res: Response, next: NextFunction) => {
        const { name } = req.body
        const { user } = req
        User.findOneAndUpdate({ _id: user._id }, { $set: { name } }, { runValidators: true, new: true })
            .then(result => res.json(result))
            .catch(error => res.status(500).json({ message: error.message, error }))

    }
}