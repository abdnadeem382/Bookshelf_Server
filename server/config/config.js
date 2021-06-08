const config = {
    production:{
        SECRET:   process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        SECRET: 'SUPERPASSWORD123',
        DATABASE: 'mongodb+srv://abdullah:abd123@cluster0.hvxys.mongodb.net/BookShelf',
        JWT_EXPIRE_TIME : "7d"
    }
}

exports.get = function get(env){
    return config[env] || config.default
}