const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1'
const dbURI = `mongodb://${host}/travlr`;  
const readLine = require('readline');

const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {
        useNewUrlParser: true
    }), 1000);
}
mongoose.connection.on('connected', () => {
    console.log('connected');
});

mongoose.connection.on('error', err => {
    console.log('error: ' + err);
    return connect();
});
mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
});

if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {  t
        process.emit("SIGINT");
    });
}

const gracefulshutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);  
        callback();
    });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulshutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', () => {  
    gracefulshutdown('app termination', () => {
        process.exit(0);
    });
});

// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulshutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

connect();

//bring in the Mongoose schema
require('./travlr');
require('./user');
