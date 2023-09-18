process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let soda = { name: "soda" };

beforeEach(function () {
    items.push(soda);
});

afterEach(function () {
    // clears data
    items.length = 0;
});


// GET /items returns `[{"name": "soda", "price": 1.75}, {"name": "cheesecake", "price": 4.00}]`

describe("GET /items", function () {
    test("Gets a list of items", async function () {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual([soda]);
    });
});




// GET /items/[name] returns data about one item: `{"name": "soda", "price": 1.75}`

describe("GET /items/:name", function () {
    test("Gets a single item", async function () {
        const resp = await request(app).get(`/items/${soda.name}`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual(soda);
    });

    test("Responds with 404 if cannot find item", async function () {
        const resp = await request(app).get(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});



// POST /items create item from data; return `{"name": "cheesecake", "price": 4.00 }`

describe("POST /items", function () {
    test("Creates a new item", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "cheesecake",
                price: 4.0
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            "added": {
                name: "cheesecake", 
                price: 4.0
            }
        });
    });


    test("Creates a new item, no name", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "",
                price: 4.0
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({
            "error": {
                message: "name required", 
                status: 400
            }
        });
    });
});

// PATCH /items/[name] update item, return `{"updated": {"name": "new soda", "price": 1.75}}`

describe("PATCH /items/:name", function () {
    test("Updates a single item", async function () {
        const resp = await request(app)
            .patch(`/items/${soda.name}`)
            .send({
                name: "new soda", 
                price: 1.75
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated: {
                name: "new soda", 
                price: 1.75
            }
        });
    });

    test("update a single item, no name", async function () {
        const resp = await request(app)
            .patch(`/items/${soda.name}`)
            .send({
                name: "",
                price: 1.75
            });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({
            "error": {
                message: "name required", 
                status: 400
            }
        });
    });

    test("Responds with 404 if id invalid", async function () {
        const resp = await request(app).patch(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});



// DELETE /items/[name] deletes item, return `{message: "Deleted"}`

describe("DELETE /items/:name", function () {
    test("Deletes a single item", async function () {
        const resp = await request(app).delete(`/items/${soda.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted "});
    });
});