const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

class ErrorNodeMailService extends ErrorHandler {
  constructor (error) {
    super(error);
  } 
}
class ErrorMailData extends ErrorHandler {
  constructor (mail) {
    super(Object
      .entries(mail).reduce((errorData, [field, value]) => {
        if (value) {
          errorData.push({
            [field]: value
          })
        }

        return errorData
      }, []),
    statusCode);
  }
}

class Mailer {
  constructor() {
    this.node = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const error = this.#verify();
    console.log('error', error);
    if (error) {
      throw error;
    }
  }

  #verify = () => {
    try {
      this.node.verify((error) => {
        if (error) {
          throw new ErrorNodeMailService(error);
        }
      });
    } catch (error) {
      return error;
    }
  };
  send = (name, email, subject, message) => {
    try {
      if (!name || !email || !message) {
        console.log(
          "erreur lors de la vérification des données",
          name,
          email,
          message
        );
        throw new ErrorMailData({ name, email, message });
      }

      const formattedMessage = message.split('\n').map(line => `<p>${line}</p>`).join('');

      const mail = {
        from: `${name} <${process.env.NODEMAILER_EMAIL}>`,
        replyTo: email,
        to: process.env.NODEMAILER_EMAIL,
        subject: subject,
        html: formattedMessage
      };

      this.node.sendMail(mail, (error) => {
        if (error) {
          throw new ErrorNodeMailService(error);
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

const MailerInstance = new Mailer();

module.exports = MailerInstance;
