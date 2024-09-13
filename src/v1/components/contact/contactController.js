const Mailer = require("../../classes");

/**
 * @description Contacts Class
 */
class Contacts {
  /**
   * Send a new contact mail
   * @route POST /contacts
   * @param {string} request.params.name - Name of the user
   * @param {string} request.params.mail - Mail of the user
   * @param {string} request.params.message - Message of the user
   */
  async sendMessage(request, response, next) {
    try {
      const { name, email, subject, message } = request.body;
      const error = Mailer.send(name, email, subject, message);

      if (error) {
        throw error;
      }

      response.status(201).json({
        message: "Message sent",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Contacts();
