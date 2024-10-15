import { Discount, Prisma } from "@prisma/client";

// Define interfaces for your repositories. How to communicate with your database
export default interface IRepository {
    create(data: Prisma.DiscountCreateArgs): Promise<Discount>
    update(data: Prisma.DiscountUpdateArgs): Promise<Discount | null>
    delete(params: Prisma.DiscountDeleteArgs): Promise<Discount | null>
    deleteMany(params: Prisma.DiscountDeleteManyArgs): Promise<Prisma.BatchPayload>
    find(query: Prisma.DiscountFindManyArgs): Promise<Discount[]>
    findOne(query: Prisma.DiscountFindUniqueArgs): Promise<Discount | null>
    count(query: Prisma.DiscountCountArgs): Promise<number>
}