export namespace Job {

  export type EntityType = "Job";

  export interface IJob {
    jobId?: string;
    title: string;
    pay?: Pay;
    description?: string;
    /** @TJS-minItems 1 */
    location?: Array<String>;
    /** @TJS-minItems 1 */
    skills?: Array<string>;
    experience?: Experience;
    /** @TJS-minimum 0 */
    vacancy?: number;
    createdAt?: string;
    updatedAt?: string;
  }

  export type Pay = {
    currency?: string;
    min: number;
    max: number;
  };

  export type Experience = {
    min: number;
    max: number;
  };
}
