import LambdaTester from "lambda-tester";
import { makeJobForm } from "../../shared/specs/fakes/Job";
import { handler } from "./createJob";
import { Job } from "../entities/Job";

describe("lambdas/createJob", () => {
  let event, jobForm, job;

  context("When event does not have a body", () => {
    beforeEach(async () => {
      event = {};
      jobForm = makeJobForm();
      job = new Job(jobForm);
    });

    it("returns 400 - Event object validation failed ", async () => {
      await LambdaTester(handler)
        .event(event)
        .expectResult((response) => {
          expect(response.statusCode).toBe(400);
          expect(response.body).toContain("Event object failed validation");
        });
    });
  });

  context("When event does have a body", () => {
    beforeEach(async () => {
      event = {
        body: {},
      };
    });

    it("returns 400 - Event object validation failed ", async () => {
      await LambdaTester(handler)
        .event(event)
        .expectResult((response) => {
          expect(response.statusCode).toBe(400);
          expect(response.body).toContain("Event object failed validation");
        });
    });
  });

  context("When with valid job", () => {
    beforeEach(async () => {
      event = {
        body: job,
      };
    });

    it("returns 201 - Job created", async () => {
      await LambdaTester(handler)
        .event(event)
        .expectResult((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toContain("jobId");
        });
    });
  });
});
