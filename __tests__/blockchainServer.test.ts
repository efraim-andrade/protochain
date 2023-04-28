import request from "supertest";
import { app } from "../src/server/blockchainServer";

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");

describe("blockchainServer", () => {
  it("GET /status", async () => {
    const response = await request(app).get("/status");

    expect(response.status).toBe(200);
    expect(response.body.isValid.success).toEqual(true);
  });
});
