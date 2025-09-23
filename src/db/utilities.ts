import { NewUser, UserWithoutHash } from "./schema.js";

export const transformUserData = (user: NewUser): UserWithoutHash => {
    if (!user)
        throw new Error();

    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}