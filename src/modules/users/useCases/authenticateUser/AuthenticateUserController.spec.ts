import { Connection, createConnection } from "typeorm";
import {v4 as uuidV4} from "uuid";
import {hash} from "bcryptjs";
import { app } from "../../../../app";
import request from "supertest";

let connection : Connection;

describe("Authenticate User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
            `INSERT INTO USERS(id,name, email, password, created_at)
            values ('${id}', 'admin', 'admin@admin.com', '${password}', 'now()');
            `
        )
            });

    afterAll( async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to authenticate a user", async () => {
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "admin@admin.com",
            password: "admin"
        });

        expect(responseToken.body).toHaveProperty("token");
    });

    it("Should not be able to authenticate a inexistent user", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            name: "email@email.com",
            password: "1234"
        });

        expect(response.status).toBe(401);
    });

    it("Should not be able to authenticate a user with incorrect password", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            name: "admin@admin.com",
            password: "1234"
        });

        expect(response.status).toBe(401);
    });
});