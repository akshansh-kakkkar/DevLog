import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return console.log("no user");
    
    console.log("User id:", user.id);
    const totalPosts = await prisma.post.count({
      where: { authorId: user.id }
    })
    const totalReads = await prisma.postView.count({
      where: {
        post: {
          authorId: user.id
        }
      }
    })
    console.log({totalPosts, totalReads});
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
