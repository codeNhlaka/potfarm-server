/**
 * 
 * @param {String} address email address you want to send the email to
 * @param {Boolean} wait if true: sets the function to stop the process before sending email. 
 * Recommended if nodemailer has not been configure
 * @returns 
 */
async function sendMail(address, wait){

    if (wait) return null;

    const nodemailer = require("nodemailer");

    // compatible with godaddy email service

    const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        secure: true,
        port: 465,
        auth: {
            "user": "<enter your email>",
            "pass": "<enter your password>"
        }
    });
      
    const info = await transporter.sendMail({
        from: '<your email>',
        to: address,
        subject: '<Your subject>',
        text: `<Your message>`
    });

    const { messageId } = info;

    return messageId;
}

module.exports = sendMail;