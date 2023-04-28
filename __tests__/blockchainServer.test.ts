import request from "supertest";
import { app } from "../src/server/blockchainServer";
import Block from "../src/lib/block";

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");

describe("blockchainServer", () => {
  describe("/status", () => {
    it("GET - should return status", async () => {
      const response = await request(app).get("/status");

      expect(response.status).toBe(200);
      expect(response.body.isValid.success).toEqual(true);
    });
  });

  describe("/blocks", () => {
    describe("GET", () => {
      it("/:index - Should return genesis", async () => {
        const response = await request(app).get("/blocks/0");

        expect(response.status).toBe(200);
        expect(response.body.index).toEqual(0);
      });

      it("/:hash - should return block", async () => {
        const response = await request(app).get("/blocks/abc");

        expect(response.status).toBe(200);
        expect(response.body.hash).toEqual("abc");
      });

      it("/:index - should NOT return block", async () => {
        const response = await request(app).get("/blocks/-1");

        expect(response.status).toBe(404);
      });
    });

    describe("POST", () => {
      it("should add block", async () => {
        const block = new Block({
          index: 1,
        } as Block);

        const response = await request(app).post("/blocks").send(block);

        expect(response.status).toBe(201);
        expect(response.body.index).toEqual(1);
      });

      it("should NOT add block (empty)", async () => {
        const response = await request(app).post("/blocks").send({});

        expect(response.status).toBe(422);
      });

      it("should NOT add block (invalid)", async () => {
        const block = new Block({
          index: -1,
        } as Block);

        const response = await request(app).post("/blocks").send(block);

        expect(response.status).toBe(400);
      });
    });
  });
});
