import { Connection, createConnection } from "typeorm";
import {v4 as uuidV4} from "uuid";
import {hash} from "bcryptjs";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Show User Profile Controller", () => {

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

    it("should be able to show a User Profile", async () => {
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "admin@admin.com",
            password: "admin"
        });

        const { token } = responseToken.body;

        const response = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(200);
    });

    it("Should not be able to a inexisting user profile", async () => {

        const response = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer blablabla`
        });

        expect(response.status).toBe(401);
    });


});