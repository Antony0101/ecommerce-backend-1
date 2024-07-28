import { ProductSortEnumType } from "../../utils/enums.utils";
import { escapeRegExp } from "../../utils/extra.utils";

type ProductFilter = {
    search?: string;
    category?: string;
    color?: string;
    priceStart?: number;
    priceEnd?: number;
    rating?: number;
};

function productFilterQuery(query: ProductFilter): any {
    let filter: any = {};
    if (query.search) {
        const searchQuery = query.search ? escapeRegExp(query.search) : "";
        filter.name = { $regex: searchQuery, $options: "i" };
    }
    if (query.category) {
        filter.category = query.category;
    }
    if (query.color) {
        filter.color = query.color;
    }
    if (query.priceStart) {
        filter.price = { ...filter.price, $gte: query.priceStart };
    }
    if (query.priceEnd) {
        filter.price = { ...filter.price, $lte: query.priceEnd };
    }
    if (query.rating) {
        filter.rating = { $gte: query.rating };
    }
    return filter;
}

type ProductSort = {
    sort: ProductSortEnumType;
};

function productSortObject(query: ProductSort) {
    let filter: any = {};
    switch (query.sort) {
        case "newFirst":
            filter = { createdAt: -1 };
            break;
        case "priceHighToLow":
            filter = { price: -1 };
            break;
        case "priceLowToHigh":
            filter = { price: 1 };
            break;
        default:
            filter = { createdAt: 1 };
    }
    return filter;
}

export { productFilterQuery, ProductFilter, productSortObject, ProductSort };
