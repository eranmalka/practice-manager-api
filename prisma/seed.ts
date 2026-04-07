import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const songs = [
    { title: "Bohemian Rhapsody", artist: "Queen" },
    { title: "Black Hole Sun", artist: "Soundgarden" },
    { title: "Under the Bridge", artist: "Red Hot Chili Peppers" },
    { title: "Here There and Everywhere", artist: "The Beatles" },
    { title: "Isn't She Lovely", artist: "Stevie Wonder" }
  ];

  for (const song of songs) {
    await prisma.song.create({
        data: {
        name: song.title,
        artist: song.artist,
        },
    });
  }

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });