import { IPaginationOptions } from "../../../domain/dtos";

type PaginationData = {
    limit: number;
    skip: number;
    page: number;
}

export default function setupPagination(options?: IPaginationOptions): PaginationData {

    if (!options) {
        return {
            limit: 10,
            skip: 0,
            page: 1
        }
    }

    const page = options.page && !isNaN(+options.page) && +options.page > 0 ? +options.page : 1
    const limit = options.limit && !isNaN(+options.limit) && +options.limit > 0 && options.limit <= 100 ? +options.limit : 10
    const skip = (page - 1) * limit

    return {
        limit,
        skip,
        page
    }
}