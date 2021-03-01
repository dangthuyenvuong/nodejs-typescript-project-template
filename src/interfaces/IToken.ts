
import { Document, Types } from 'mongoose'
export interface IToken extends Document {
    accessToken: string,
    refreshToken: string,
    user: Types.ObjectId,
    expiredIn: Number,
    tokenType: string,
    expiredAt: string,
}