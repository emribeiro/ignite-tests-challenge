
import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
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

    it("Should be able to get a User Statement Operation", async () => {
        const statement_response = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "First Deposit"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        const statement_id = statement_response.body.id;

        const response = await request(app).get(`/api/v1/statements/${statement_id}`)
        .set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
    });

    it("Should not be able to get a inexistent User Statement Operation", async () => {
        const statement_response = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "First Deposit"
        })
        .set({
            Authorization: `Bearer ${token}`
        });

        const statement_id = statement_response.body.id;

        const response = await request(app).get(`/api/v1/statements/${statement_id}`)
        .set({
            Authorization: `Bearer invalid-token`
        });

        expect(response.status).toBe(401);
    });

    it("Should be able to get a User inexistent Statement Operation", async () => {

        const response = await request(app).get(`/api/v1/statements/1ee8920e-1913-4328-ae55-33319ffb541d`)
        .set({
            Authorization: `Bearer ${token}`
        });

        console.log(response.body);

        expect(response.status).toBe(404);
    });
});

