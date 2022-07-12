import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
const prisma = new PrismaClient()

await prisma.user.deleteMany()

await prisma.user.createMany(
  {
    data: [
      {
        name: 'John Doe',
        profile: {
          age: 30,
          bio: 'John is a 30 year old software developer',
          photos: [
            {
              id: 1,
              url: 'https://picsum.photos/200/300?random=1',
            },
            {
              id: 2,
              url: 'https://picsum.photos/200/300?random=2',
            },
          ],
          hobbies: [
            'Running', 'Coding', 'Cooking', 'Traveling',
          ]
        }
      },
      {
        name: 'Jane Rams',
        profile: {
          age: 50,
          photos: [
          ],
          hobbies: [
            'Coding', 'Gaming', 'Cooking', 'Traveling',
          ]
        }
      },
      {
        name: 'John Smith',
        profile: {
          age: 20,
          bio: 'I hate to write bios',
          photos: [
            {
              id: 1,
              url: 'https://picsum.photos/200/300?random=4',
            },
          ],
          hobbies: [
            'Reading', 'Coding', 'Traveling',
          ],
        }
      }
    ]
  }
)

await prisma.$disconnect()