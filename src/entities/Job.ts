// import isBlank from "is-blank";
// const Log = require("@dazn/lambda-powertools-logger");
import { generateKSUID } from "../../shared/dynamodb/generateKSUID";

import { Job as Types } from "../../shared/types/types";
export class Job {
  static readonly entityType = "Job";

  public jobId: string;
  public title: string;
  public description: string;
  public experience: Types.Experience;
  public vacancy: number;
  public createdAt: string;
  public updatedAt: string;
  public pay: Types.Pay;
  public skills: Array<string>;

  constructor({
    jobId,
    title,
    pay,
    skills,
    description,
    experience,
    vacancy,
    createdAt = new Date().toISOString(),
  }: Types.IJob) {
    this.createdAt = createdAt;
    this.updatedAt = new Date().toISOString();
    this.jobId = jobId ? jobId : generateKSUID(new Date(this.createdAt));
    this.title = title;
    this.description = description;
    this.experience = experience;
    this.vacancy = vacancy;
    this.pay = pay;
    this.skills = skills;
  }

  public validate(): boolean {
    if (!this.jobId) return false;
    return true;
  }

  public key() {
    return {
      PK: `JOB#${this.jobId}`,
      SK: `JOB#${this.jobId}`,
    };
  }

  public toItem() {
    return {
      ...this.key(),
      jobId: this.jobId,
      title: this.title,
      description: this.description,
      skills: this.skills,
      vacancy: this.vacancy,
      experience: this.experience,
      pay: this.pay,
    };
  }

  public updateAttributes(attributes: Types.IJob) {
    Object.keys(attributes).forEach((key) => {
      this[key] = attributes[key];
    });
  }
}
