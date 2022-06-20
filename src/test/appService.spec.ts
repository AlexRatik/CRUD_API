import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "node:http";
import { appService } from "../services/appService";
import { IUser } from "../interfaces/IUser";
import { ERRORS } from "../enums/errorEnum";

describe("Scenario 1", () => {
    const server = createServer((req, res) => {
        appService(req, res);
    });
    let id: string = "";
    let updatedUser: IUser;
    afterAll(() => {
        server.close();
    });
    test("Get all users", async () => {
        const response = await request(server).get("/api/users");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
    test("Create new user", async () => {
        const newUser = {
            username: "Bob",
            age: 66,
            hobbies: ["Football"],
        };
        const response = await request(server).post("/api/users").send(newUser);
        id = response.body.id;
        updatedUser = { ...newUser, id };
        expect(response.status).toBe(201);
        expect(response.body).toEqual(updatedUser);
    });
    test("Get a newly created user", async () => {
        const response = await request(server).get(`/api/users/${id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedUser);
    });
    test("Update user", async () => {
        const updateFields: object = {
            age: 18,
            hobbies: ["Rock-n-roll"],
        };
        const response = await request(server)
            .put(`/api/users/${id}`)
            .send(updateFields);
        updatedUser = { ...updatedUser, ...updateFields };
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedUser);
    });
    test("Delete user", async () => {
        const response = await request(server).delete(`/api/users/${id}`);
        expect(response.status).toBe(204);
    });
    test("Get all users", async () => {
        const response = await request(server).get(`/api/users`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});

describe("Scenario 2", () => {
    const server = createServer((req, res) => {
        appService(req, res);
    });
    let id: string = uuidv4();
    let updatedUser: IUser;
    afterAll(() => {
        server.close();
    });
    test("Get users at invalid link", async () => {
        const response = await request(server).get("/api/user");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: ERRORS.PAGE_NOT_FOUND });
    });
    test("Create new user with invalid fields", async () => {
        const newUser = {
            username: "",
            age: 66,
            hobbies: ["Football"],
        };
        const response = await request(server).post("/api/users").send(newUser);
        id = response.body.id || id;
        updatedUser = { ...newUser, id };
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: ERRORS.NOT_ALL_FIELDS_ARE_FILLED,
        });
    });
    test("Get not existing user", async () => {
        const response = await request(server).get(`/api/users/${id}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: ERRORS.NO_SUCH_USER });
    });
    test("Update not existing user", async () => {
        const updateFields: object = {
            age: 18,
            hobbies: ["Rock-n-roll"],
        };
        const response = await request(server)
            .put(`/api/users/${id}`)
            .send(updateFields);
        updatedUser = { ...updatedUser, ...updateFields };
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: ERRORS.NO_SUCH_USER });
    });
    test("Delete not existing user", async () => {
        const response = await request(server).delete(`/api/users/${id}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: ERRORS.NO_SUCH_USER });
    });
});
describe("Scenario 3", () => {
    const server = createServer((req, res) => {
        appService(req, res);
    });
    let id: string = "id";
    let updatedUser: IUser;
    afterAll(() => {
        server.close();
    });
    test("Create new user at invalid URL", async () => {
        const newUser = {
            username: "Bob",
            age: 66,
            hobbies: ["Football"],
        };
        const response = await request(server)
            .post("/api/users111")
            .send(newUser);
        id = response.body.id || id;
        updatedUser = { ...newUser, id };
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: ERRORS.NO_OPPORTUNITY,
        });
    });
    test("Get user by invalid id", async () => {
        const response = await request(server).get(`/api/users/${id}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: ERRORS.INVALID_ID });
    });
    test("Update user by invalid id", async () => {
        const updateFields: object = {
            age: 18,
            hobbies: ["Rock-n-roll"],
        };
        const response = await request(server)
            .put(`/api/users/${id}`)
            .send(updateFields);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: ERRORS.INVALID_ID });
    });
    test("Delete user by invalid id", async () => {
        const response = await request(server).delete(`/api/users/${id}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: ERRORS.INVALID_ID });
    });
});
