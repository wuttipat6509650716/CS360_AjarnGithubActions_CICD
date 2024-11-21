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

### CI-test.yml Workflow Features

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
  pull_request:
    branches:
      - main

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

      # Step 5: Run Jest tests with coverage
      - name: Run Jest Tests with Coverage
        run: npm test 
```
