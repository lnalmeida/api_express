const path = require('path')
const nodeMailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const { host, port, user, pass } = require('../config/mail.json')

const transport = nodeMailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    },
})

const handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialDir: './src/resources/mail',
        layoutsDir: './src/resources/mail', 
        defaultLayout: undefined,
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName:'.html',
}
transport.use('compile', hbs(handlebarsOptions))

module.exports = transport