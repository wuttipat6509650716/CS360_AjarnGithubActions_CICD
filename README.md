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

### Base URL: `http://<ip-or-dns-of-server>:3000`

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
