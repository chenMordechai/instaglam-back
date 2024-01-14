const pass = process.env.MONGO_PASS

export default {
    dbURL: `mongodb+srv://chen:${pass}@cluster1.h2v9iky.mongodb.net/?retryWrites=true&w=majority`,
    dbName: 'instaglam',
}


