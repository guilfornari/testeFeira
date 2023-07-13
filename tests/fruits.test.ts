import supertest from "supertest"
import app from "../src/app"
import { any } from "joi";

const api = supertest(app);

describe("Fruits health test", () => {

    it("Should breath", async () => {
        const result = await api.get("/health");
        expect(result.status).toEqual(200);
        expect(result.text).toEqual("ok!");
    });
});

describe("Posting fruits to the database", () => {

    it("Should return 201 when posting a fruit", async () => {
        const body = {
            name: "Apple",
            price: 3
        };
        const result = await api.post("/fruits").send(body);
        const { status } = result;

        expect(status).toEqual(201);
    });

    it("Should return 409 when posting a fruit that already exists", async () => {
        const body = {
            name: "Apple",
            price: 5
        };
        const result = await api.post("/fruits").send(body);
        const { status } = result;

        expect(status).toEqual(409);
    });

    it("Should return 422 when posting a fruit with data missing", async () => {
        const body = {
            name: "Tanjerine",
        };
        const result = await api.post("/fruits").send(body);
        const { status } = result;

        expect(status).toEqual(422);
    });

});

describe("Geting fruits from the dartabase", () => {

    it("Should return 404 when trying to get a fruit that does not exist", async () => {

        const result = await api.get("/fruits/888");
        expect(result.status).toEqual(404);
    });

    it("Should return 400 when id param is not valid", async () => {

        const result = await api.get("/fruits/dois");
        expect(result.status).toEqual(400);
    });

    it("Should return fruit when id is ok", async () => {

        const result = await api.get("/fruits/1");
        expect(result.body).toEqual({
            id: 1,
            name: "Apple",
            price: 3
        })
    });

    it("Should return all fruits with the correct body", async () => {

        const result = await api.get("/fruits");
        console.log(result.body);
        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ]));
    });
});




