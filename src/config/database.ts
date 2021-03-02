import { ConnectOptions } from "mongoose"

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'root'
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const MONGO_HOST = process.env.MONGO_URL || 'localhost'

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || 27017
const DATABASE_NAME = process.env.MONGO_DATABASE || 'test'
const MONGO_STRING_CONNECT = process.env.MONGO_STRING_CONNECT || ''


const MONGO_OPTIONS: ConnectOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    dbName: DATABASE_NAME
}


const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: MONGO_STRING_CONNECT,
    dbName: DATABASE_NAME
}

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

const database = {
    mongo: MONGO,
    server: SERVER
}

export default database