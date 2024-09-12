/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
const prisma = new PrismaClient()

async function main() {
    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {
            balance: {
                create: {
                    amount: 20000,
                    locked: 0
                }
            }
        },
        create: {
            email: 'alice@example.com', 
            number: '1111111111',
            password: await bcrypt.hash('alice', 10),
            name: 'alice',
            balance: {
                create: {
                    amount: 20000,
                    locked: 0
                }
            },
            onRampTransactions: {
                create: {
                    startTime: new Date(),
                    status: "Success",
                    amount: 20000,
                    token: "token__1",
                    provider: "HDFC Bank",
                },
            },
        },
    })
    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {
            balance: {
                create: {
                    amount: 2000,
                    locked: 0
                }
            },
        },
        create: {
            email: 'bob@example.com', 
            number: '2222222222',
            password: await bcrypt.hash('bob', 10),
            name: 'bob',
            balance: {
                create: {
                    amount: 2000,
                    locked: 0
                }
            },
            onRampTransactions: {
                create: {
                    startTime: new Date(),
                    status: "Failure",
                    amount: 2000,
                    token: "token__2",
                    provider: "HDFC Bank",
                },
            },
        },
    })
    console.log({ alice, bob })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })