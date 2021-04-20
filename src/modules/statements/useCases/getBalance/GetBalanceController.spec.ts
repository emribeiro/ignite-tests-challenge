
import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;


describe("Get User Balance", () => {

    let token : string;

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send({
            name: "Test User",
            email: "test@test.com",
            password: "1234"
        });

        const response = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com",
            password: "1234"
        });

        token = response.body.token;

    });

    afterAll( async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to get a user Balance", async () => {
        await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "First Deposit"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        const response = await request(app).get("/api/v1/statements/balance")
        .set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(200);
        expect(response.body.balance).toBeGreaterThan(0);

    });

    it("Should not be able to get a inexisting user balance", async () => {
        const response = await request(app).get("/api/v1/statements/balance")
        .set({
            Authorization: `Bearer invalid-token`
        });

        expect(response.status).toBe(401);
    });

});