const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    db: 'mean-app-6',
    uri: 'mongodb://localhost:27017/mean-app-6',
    secret: crypto 
}