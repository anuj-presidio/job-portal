import LambdaTester from "lambda-tester";
import { handler as getJobs } from "./getJobs";

describe("lambdas/getJobs", () => {
  let event;

  context("when with a valid body", () => {
    beforeEach(() => {
      event = {
        body: {},
      };
    });

    it("returns 200 - Jobs found", async () => {
      // @ts-ignore
      await LambdaTester(getJobs)
        .event(event)
        .expectResult((response) => {
          let jobs = JSON.parse(response.body);
          expect(response.statusCode).toBe(200);
          expect(Array.isArray(jobs)).toEqual(true);
        });
    });
  });
});
