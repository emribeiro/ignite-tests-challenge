import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll( async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a new user.", async () => {
        const response = await request(app).post("/api/v1/users").send({
            name: "Test User",
            email: "Test password",
            password: "1234"
        });

        expect(response.status).toBe(201);
    });

    it("should not be able to create a new user with existing user email.", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Test User",
            email: "Test password",
            password: "1234"
        });

        const response = await request(app).post("/api/v1/users").send({
            name: "Test User",
            email: "Test password",
            password: "1234"
        });

        expect(response.status).toBe(400);
    });
});