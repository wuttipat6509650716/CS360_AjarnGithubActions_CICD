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

```yaml
name: CI - Run Automated Test on Push and Pull Request

on:
  push:
    branches:
      - main
    paths-ignore:
        - 'README.md' # Ignore pushes that only affect README.md
  pull_request:
    branches:
      - main
    paths-ignore:
        - 'README.md' # Ignore pull requests that only affect README.md

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14, 16, 18] # Define Node.js versions to test

    steps:
      # Step 1: Checkout the code
      - name: Checkout Code
        uses: actions/checkout@v3

      # Step 2: Set up Node.js
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      # Step 3: Cache Node Modules
      - name: Cache Node Modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ matrix.node-version }}-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-${{ matrix.node-version }}-

      # Step 4: Install dependencies
      - name: Install Dependencies
        run: npm install

      # Step 5: Run Jest tests 
      - name: Run Jest Tests 
        run: npm test 
```

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
  `DOCKER_USERNAME`: Your DockerHub username.
  `DOCKER_TOKEN`: The token you generated.

```yaml
name: CI - Test Source Code and Docker Image

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'README.md'
  pull_request:
    branches:
      - main
    paths-ignore:
      - 'README.md'

jobs:
  # Step 1: Test Source Code
  test-source-code:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14, 16, 18]

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm install

      - name: Run Jest Tests 
        run: npm test

  # Step 2: Build Docker Image
  build-docker:
    needs: test-source-code
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Log in to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }} # Use the token here

      - name: Build Docker Image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/cs360_calc_image:latest .

      - name: Push Docker Image to DockerHub
        run: |
          docker push ${{ secrets.DOCKER_USERNAME }}/cs360_calc_image:latest

  # Step 3: Test Docker Image
  test-docker-image:
    needs: build-docker
    runs-on: ubuntu-latest

    steps:
      - name: Log in to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }} # Use the token here

      - name: Pull and Run Docker Image
        run: |
          docker pull ${{ secrets.DOCKER_USERNAME }}/cs360_calc_image:latest
          docker run -d --name test-container ${{ secrets.DOCKER_USERNAME }}/cs360_calc_image:latest

      - name: Run Automated Tests in Docker Container
        run: |
          docker exec test-container npm test 

      - name: Clean Up Docker Container
        run: |
          docker stop test-container
          docker rm test-container

```
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

The following user data script is used to configure Docker on the EC2 instance and deploy the application:

```bash
#!/bin/bash
# Update the package manager and install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -aG docker ec2-user
```
### cd.yml Workflow Features

1. **Creates an EC2 Instance**:
   - Automatically launches an EC2 instance using the AWS CLI.

2. **Configure the Instance to Run a Container**
   - Passes the user-data.sh script to set up and run the Docker container.

```yaml
name: CD - Deploy to EC2 with Docker (Human trigger)

on:
  workflow_dispatch:

jobs:
  check-image-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Check if Docker Image Exists
      - name: Check if Docker Image Exists
        id: check_image
        run: |
          IMAGE_TAG=${{ secrets.DOCKER_USERNAME }}/cs360_calc_image:latest
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -u "${{ secrets.DOCKER_USERNAME }}:${{ secrets.DOCKER_TOKEN }}" https://hub.docker.com/v2/repositories/${IMAGE_TAG}/tags/latest/)
          if [ "$RESPONSE" -ne 200 ]; then
            echo "Docker image not found. Exiting workflow."
            exit 1
          fi
          echo "Docker image exists. Proceeding to deployment."

      # Step 2: Set AWS Credentials in Environment Variables
      - name: Set AWS Credentials
        if: ${{ steps.check_image.outcome == 'success' }}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
        run: echo "AWS credentials set."

      # Step 3: Create EC2 Instance and Deploy the Application
      - name: Create EC2 Instance and Deploy the Application
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
        run: |
          # Define instance details
          INSTANCE_ID=$(aws ec2 run-instances \
            --image-id ami-06b21ccaeff8cd686 \  # Replace with an AMI ID for your region
            --count 1 \
            --instance-type t2.micro \
            --key-name ${{ secrets.AWS_KP_NAME }} \  
            --security-group-ids ${{ secrets.AWS_SG_ID }} \  
            --user-data file://user-data.sh \  # Use the user data script
            --query 'Instances[0].InstanceId' \
            --output text)
          echo "Instance ID: $INSTANCE_ID"

          # Wait for the instance to be running
          aws ec2 wait instance-running --instance-ids $INSTANCE_ID

          # Output the instance public DNS
          INSTANCE_PUBLIC_DNS=$(aws ec2 describe-instances \
            --instance-ids $INSTANCE_ID \
            --query 'Reservations[0].Instances[0].PublicDnsName' \
            --output text)
          echo "Instance Public DNS: $INSTANCE_PUBLIC_DNS"
```

