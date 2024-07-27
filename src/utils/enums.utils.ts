const USER_ROLE_ENUM = {
    ADMIN: "admin",
    USER: "user",
} as const;

type UserRoleEnumType = (typeof USER_ROLE_ENUM)[keyof typeof USER_ROLE_ENUM];

const CART_STATUS_ENUM = {
    PENDING: "pending",
    ORDERED: "ordered",
    DELIVERED: "delivered",
} as const;

type CartStatusEnumType =
    (typeof CART_STATUS_ENUM)[keyof typeof CART_STATUS_ENUM];

export {
    USER_ROLE_ENUM,
    UserRoleEnumType,
    CART_STATUS_ENUM,
    CartStatusEnumType,
};
