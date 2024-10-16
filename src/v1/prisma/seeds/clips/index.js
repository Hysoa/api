const SeedFactory = require('../seed');

const clips = [
  {
    order: 1,
    title: "Dirty Sock",
    url: "https://www.youtube.com/embed/hMlYhr_8pI0"
  },
  {
    order: 2,
    title: "June",
    url: "https://www.youtube.com/embed/xyko7vWflAs",
  },
  {
    order: 3,
    title: "Bluelight",
    url: "https://www.youtube.com/embed/RymOqLXujtw",
  },
  {
    order: 4,
    title: "Sleep Well",
    url: "https://www.youtube.com/embed/LBUcByh-G7s",
  },
  {
    order: 5,
    title: "Dust",
    url: "https://www.youtube.com/embed/z5Zy5D0lF7g",
  },
  {
    order: 6,
    title: "Coldshower",
    url: "https://www.youtube.com/embed/V6so-hlqJvg",
  },
  {
    order: 7,
    title: "Five Year Later",
    url: "https://www.youtube.com/embed/iKlk0fjMvrU",
  },
  {
    order: 8,
    title: "Pinky Swear",
    url: "https://www.youtube.com/embed/6ifm9uUAAyc",
  },
  {
    order: 9,
    title: "Dreamcatcher",
    url: "https://www.youtube.com/embed/4cR2H3Eu-44",
  },
];

class ClipFactory extends SeedFactory {
  constructor() {
    super();
  }

  async createMany() {
    for (const clip of clips) {
      const existingClip = await this.prisma.clips.findFirst({
        where: {
          title: clip.title,
        },
      });

      if (existingClip) {
        continue;
      }

      await this.prisma.clips.create({
        data: clip,
      });
    }
  }
}

module.exports = ClipFactory;