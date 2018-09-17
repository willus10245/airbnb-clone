import fetch from "node-fetch";

test("should return invalid if key is bad", async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/12083`);
  const text = await response.text();
  expect(text).toBe("invalid");
});
