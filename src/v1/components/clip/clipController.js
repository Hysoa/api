const Mailer = require("../../classes/Mailer");
const Prisma = require("../../classes/Prisma");

/**
 * @description Contacts Class
 */
class Clip {
  async getAll(_, response, next) {
    try {
      const clips = await Prisma.clips.findMany();
      response.status(200).json({
        clips: clips.map((clip) => ({
          id: clip.id,
          order: clip.order,
          index: clip.index,
          title: clip.title,
          url: clip.url,
        })),
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteOne(request, response, next) {
    try {
      const { id } = request.params;
  
      const deletedClip = await Prisma.clips.findUnique({
        where: { id },
      });
  
      if (!deletedClip) {
        return response.status(404).json({ message: "Clip not found" });
      }
  
      await Prisma.clips.delete({
        where: { id },
      });
  
      await Prisma.clips.updateMany({
        where: {
          order: {
            gt: deletedClip.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
  
      response.status(200).json({ deletedClip });
    } catch (error) {
      next(error);
    }
  }
  async updateOne(request, response, next) {
    try {
      const { id } = request.params;

      const updatedData = Object.entries(request.body).reduce(
        (acc, [key, value]) => {
          if (key === "order") {
            acc.order = parseInt(value);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      if (updatedData.order) {
        const foundClip = await Prisma.clips.findFirst({
          where: {
            order: updatedData.order,
          },
        });

        if (foundClip) {
          const olderClipOrder = await Prisma.clips.findUnique({
            where: { id },
          });

          await Prisma.clips.update({
            where: { id: foundClip.id },
            data: { order: olderClipOrder.order },
          });
        }
      }

      await Prisma.clips.update({
        where: { id },
        data: updatedData,
      });

      response.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async addOne(request, response, next) {
    try {
      const { title, url, order } = request.body;

      if (!title || !url) {
        throw new Error("Missing required fields");
      }

      const clips = await Prisma.clips.findMany({
        orderBy: {
          order: "asc",
        },
      });

      let newOrder;
      if (!order) {
        newOrder = clips.length + 1;
      } else {
        newOrder = parseInt(order, 10);

        if (clips.some((clip) => clip.order === newOrder)) {
          await Prisma.clips.updateMany({
            where: {
              order: {
                gte: newOrder,
              },
            },
            data: {
              order: {
                increment: 1,
              },
            },
          });
        }
      }

      const clip = await Prisma.clips.create({
        data: {
          title,
          url,
          order: newOrder,
        },
      });

      response.status(200).json({ clip });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Clip();
