const request = require("supertest");
const fs = require("fs");
const app = require("./server");

// Testing for both a valid and a invalid file format
describe("POST /read-csv", () => {
  it("should return 400 if file is not a CSV", async () => {
    const response = await request(app)
      .post("/read-csv")
      .attach("csvFile", "test-files/notcsv.txt");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Please upload a valid CSV file." });
  });

  it("should return parsed CSV data if file is a CSV", async () => {
    const response = await request(app)
      .post("/read-csv")
      .attach("csvFile", "test-files/data.csv");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });
});

afterAll(() => {
  // Clean up test uploads directory
  fs.rmdirSync("uploads", { recursive: true });
});
