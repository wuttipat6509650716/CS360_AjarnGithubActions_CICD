# CS360 Github Actions CI/CD
A simple Node.js application with a REST API for basic math operations, unit testing with Jest, and containerization using Docker.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/)

---

## Manual Deployment
### 1. Clone the Repository

```bash
git clone https://github.com/ajnooncstu/CS360_GithubActions_CICD.git
cd CS360_GithubActions_CICD
```

### 2. Run the Application: 

```bash
npm start
```

### 3. Test API Endpoints: Use a browser, curl, or an API client like Postman

---

## Docker Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/ajnooncstu/CS360_GithubActions_CICD.git
cd CS360_GithubActions_CICD
docker build -t cs360_calc_image .
```

### 2. Run the Application in a Docker container: 

```bash
docker run -dp 3000:3000 cs360_calc_image
```

### 3. Test API Endpoints: Use a browser, curl, or an API client like Postman

---

## API Endpoints

#### Base URL: `http://<ip-or-dns-of-server>:3000`

#### **1. Addition**

- **Endpoint**: `/add`
- **Method**: GET
- **Query Parameters**:
  - `x` (number): First number
  - `y` (number): Second number
- **Example**: `/add?x=2&y=3`
- **Response**:
  ```json
  {
    "result": 5
  }
  ```

#### **2. Subtraction**

- **Endpoint**: `/subtract`
- **Method**: GET
- **Query Parameters**:
  - `x` (number): First number
  - `y` (number): Second number
- **Example**: `/subtract?x=7&y=4`
- **Response**:
  ```json
  {
    "result": 3
  }
  ```

#### **3. Multiplication**

- **Endpoint**: `/subtract`
- **Method**: GET
- **Query Parameters**:
  - `x` (number): First number
  - `y` (number): Second number
- **Example**: `/multiply?x=3&y=5`
- **Response**:
  ```json
  {
    "result": 15
  }
  ```
---

## Continuous Integration (CI) Workflow with GitHub Actions

This project uses **GitHub Actions** for Continuous Integration (CI) to ensure code quality and test reliability.

### ci-test.yml Workflow Features

1. **Automated Testing**:
   - Runs the test suite using [Jest](https://jestjs.io/) whenever code is pushed to the `main` branch or a pull request is created.
   - Ensures that all tests pass before merging changes.

2. **Multi-Version Testing**:
   - Tests the application across multiple Node.js versions (`14`, `16`, and `18`) to ensure compatibility.

3. **Caching**:
   - Caches `node_modules` to speed up build times for subsequent runs.

### ci-docker.yml Workflow Features

1. **test-source-code**:
   - Runs Jest tests on the source code directly to ensure code correctness before building the Docker image.

2. **build-docker**:
   - Builds the Docker image after the source tests pass.
   - Pushes the image to DockerHub.

3. **test-docker-image**:
   - Pulls the built image from DockerHub.
   - Runs the Docker container and executes the Jest tests inside the container.
   - Cleans up the container after the tests.

#### Create a Personal Access Token on DockerHub:
- Log in to your DockerHub account.
- Go to Account Settings > Security > New Access Token.
- Generate a token, give it a meaningful description (e.g., "GitHub Actions CI"), and copy the token.
  Note: you will have to copy the token now or you cannot retrieve it again later.

#### Add the Token to GitHub Secrets:
- Navigate to your GitHub repository.
- Go to Settings > Secrets and Variables > Actions > New repository secret.
- Add the following secrets:
  1. `DOCKER_USERNAME`: Your DockerHub username.
  2. `DOCKER_TOKEN`: The token you generated.

---

## Continuous Delivery (CD) Workflow with GitHub Actions

This project leverages **GitHub Actions** for Continuous Delivery (CD) to automate the deployment process.

## Pre-requisites

To successfully run the deployment workflow, the following pre-requisites must be configured:

### AWS Credential and Environment Configuration

Add your AWS credentials as **GitHub Secrets** in your repository:

| Secret Name            | Description                                           |
|------------------------|-------------------------------------------------------|
| `AWS_ACCESS_KEY_ID`    | AWS Access Key ID for CLI access.                     |
| `AWS_SECRET_ACCESS_KEY`| AWS Secret Access Key for CLI access.                 |
| `AWS_SESSION_TOKEN`     | AWS Session Token for temporary credentials (Required when using Learner Lab). |
| `AWS_REGION`           | AWS region for deploying the EC2 instance (e.g., `us-east-1`). |
| `AWS_KP_NAME`          | The name of the AWS Key Pair for accessing the EC2 instance. |
| `AWS_SG_ID`            | The security group ID for the EC2 instance.           |

---

### User Data Script (`user-data.sh`)

- Setup the user data script is used to configure Docker on the EC2 instance and deploy the application

### cd.yml Workflow Features

1. **Creates an EC2 Instance**:
   - Automatically launches an EC2 instance using the AWS CLI.

2. **Configure the Instance to Run a Container**
   - Passes the user-data.sh script to set up and run the Docker container.

---
## Troubleshooting Tips
- Amazon EC2 logs the execution of the user data script to /var/log/cloud-init-output.log.
```bash
cat /var/log/cloud-init-output.log
```
