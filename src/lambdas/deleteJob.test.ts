import LambdaTester from "lambda-tester";
import { handler as deleteJob } from "./deleteJob";
import { makeJobForm } from "../../shared/specs/fakes/Job";
import { create as createJob } from "../data/createJob";
import { Job } from "../entities/Job";

describe("lambdas/deleteJob", async () => {
  let event, jobForm, job;

  context("when event does not have a body", () => {
    beforeEach(async () => {
      event = {};
      jobForm = makeJobForm();
      job = await createJob(new Job(jobForm));
    });

    it("returns 400 - Event object validation failed", async function () {
      await LambdaTester(deleteJob)
        .event(event)
        .expectResult((response) => {
          expect(response.statusCode).toBe(400);
          expect(response.body).toContain("Event object failed validation");
        });
    });
  });

  context("when event has body but missing jobId", () => {
    beforeEach(() => {
      event = {
        body: {},
      };
    });

    it("returns 400 - Event object failed validation", async () => {
      // @ts-ignore
      await LambdaTester(deleteJob)
        .event(event)
        .expectResult((response) => {
          expect(response.statusCode).toBe(400);
          expect(response.body).toContain("Event object failed validation");
        });
    });
  });

  context("when with invalid jobId", () => {
    beforeEach(() => {
      event = {
        body: {
          jobId: "invalid",
        },
      };
    });

    it("returns 404 - Not found", async () => {
      // @ts-ignore
      await LambdaTester(deleteJob)
        .event(event)
        .expectResult((response) => {
          expect(response.statusCode).toBe(404);
          expect(response.body).toContain("not found");
        });
    });
  });

  context("when with a valid jobId", () => {
    beforeEach(() => {
      event = {
        body: {
          jobId: job.jobId,
        },
      };
    });

    it("returns 202 - Job deleted", async () => {
      // @ts-ignore
      await LambdaTester(deleteJob)
        .event(event)
        .expectResult((response) => {
          expect(response.statusCode).toBe(202);
          expect(response.body).toContain("jobId");
        });
    });
  });
});
