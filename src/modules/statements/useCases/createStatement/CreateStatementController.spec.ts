import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;


describe("Create Statement Controller", () => {

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

    it("Should be able to deposit amount in user account", async() => {
        const response = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "First Deposit"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(201);

    });


    it("Should be able to withdraw amount from user account", async () => {

        await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "First Deposit"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        const response = await request(app).post("/api/v1/statements/withdraw")
        .send({
            amount: 50,
            description: "Phone bill"
        })
        .set({
            Authorization: `Bearer ${token}`
        });


        expect(response.status).toBe(201);

    });

    it("Should not be able to deposit amount in inexisting account", async () => {
        const response = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 300,
            description: "First Deposit"
        })
        .set({
            Authorization: `Bearer blablabla`
        });

        expect(response.status).toBe(401);
    });
});