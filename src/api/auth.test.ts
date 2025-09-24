import { describe, it, expect, beforeAll, expectTypeOf } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, Payload } from "./auth.js";
import { createUser, deleteUsers } from "../db/queries/users.js";
import { NewUser } from "src/db/schema.js";
import { verify } from "jsonwebtoken";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    const TEST_SECRET = "test-secret-123"
    let hash1: string;
    let hash2: string;
    let user1: NewUser;
    let user2: NewUser;
    let jwt1: string;
    let jwt2: string;

    beforeAll(async () => {
        await deleteUsers();
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
        user1 = await createUser({ email: "kevin@kevin.de", hashedPassword: hash1 });
        user2 = await createUser({ email: "cathi@cathi.de", hashedPassword: hash2 })
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should create a JWT with correct payload", async () => {
        jwt1 = makeJWT(user1.id!, 10, TEST_SECRET);
        jwt2 = makeJWT(user2.id!, 10, TEST_SECRET);

        const verify1 = verify(jwt1, TEST_SECRET);
        const verify2 = verify(jwt2, TEST_SECRET);

        expectTypeOf(verify1 as Payload).toMatchObjectType<Payload>();
        expectTypeOf(verify1 as Payload).toMatchObjectType<Payload>();
    })

    it('should validate JWT with correct sub', async () => {
        const checkJwt1 = validateJWT(jwt1, TEST_SECRET);
        const checkJwt2 = validateJWT(jwt2, TEST_SECRET);

        expect(checkJwt1).toBe(user1.id);
        expect(checkJwt2).toBe(user2.id);
    })

    it("validation should fail with wrong secret", async () => {
        const checkJwt1 = validateJWT(jwt1, TEST_SECRET);
        expect(checkJwt1).toBe(user1.id);
        expect(() => validateJWT(jwt2, "123-123-123")).toThrowError('Something went wrong');
    })
});