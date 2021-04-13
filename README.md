# Job-portal - Serverless NodeJs


## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

### Using NPM

- Run `npm i` to install the project dependencies

### Using Yarn

- Run `yarn` to install the project dependencies


### Running Locally

In order to test the hello function locally, run the following command:

- `sls offline` 

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.



### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── lambdas            # Lambda configuration and source code folder
│   │   │
│   │   ├── createJob.ts 
│   │   |
│   │   ├── getJob.ts
│   │   │
│   │   ├── deleteJob.ts
│   │   │
│   │   ├── getJobs.ts
│   │   │
│       └── index.ts         # Import/export of all lambda configurations
│   
│   
│
├── package.json
├── serverless.ts            # Serverless service file
├── tsconfig.json            # Typescript compiler configuration
└── webpack.config.js        # Webpack configuration
```

