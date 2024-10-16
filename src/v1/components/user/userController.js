const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Prisma = require("../../classes/Prisma");
const Mailer = require("../../classes/Mailer");

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};
const checkCredentials = async (password, userPassword) =>
  await bcrypt.compare(password, userPassword);

const getNewToken = (userId) => 
  jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400,
    }
  );

/**
 * @description Contacts Class
 */
class User {
  async login(request, response, next) {
    try {
      const { userName, userPassword } = request.body;
      console.log(userName, userPassword);
      if (!userName || !userPassword) {
        throw new Error("Missing required fields");
      }

      const userFound = await Prisma.users.findFirst({
        where: {
          name: userName,
        },
      });

      if (!userFound) {
        throw new Error("User not found");
      }

      if (!(await checkCredentials(userPassword, userFound.password))) {
        throw new Error("Invalid credentials");
      }

      const userToken = getNewToken(userFound.id);
      response.status(200).json({
        token: getNewToken(userFound.id),
      });
      
      console.log('après')
      
    } catch (error) {
      next(error);
    }
  }
  async createOne(request, response, next) {
    try {
      const { userName, userPassword } = request.body;

      if (!userName || !userPassword) {
        throw new Error("Missing required fields");
      }

      const findUser = await Prisma.users.findFirst({
        where: {
          name: userName,
        },
      });

      if (findUser) {
        throw new Error("User already exists");
      }

      const passwordRegex =
        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
      const isValidPassword = passwordRegex.test(userPassword);
      if (!isValidPassword) {
        throw new Error(
          "Password must contain at least 6 characters, including uppercase, lowercase letters and numbers"
        );
      }

      const encryptedPassword = await encryptPassword(userPassword);

      const createdUser = await Prisma.users.create({
        data: {
          name: userName,
          password: encryptedPassword,
        },
      });

      response.status(201).json(createdUser);
    } catch (error) {
      console.log("une erreur");
      next(error);
    }
  }
}

module.exports = new User();
