# webb23-alm-todo-app

# Step 1

- Create .env file and add two env variables
  ```code
  MONGODB_URI=
  TEST_MONGODB_URI=
  ```
- Try running the test locally on you computer and make sure it connect to you mongodb test db that is in you .env
  ```bash
  npm test
  ```
  github workflow

# Step 2

- Lets create the github action worklow

  - create the folder .github and the workflows inside it

  ```
      .github/
          workflows/
  ```

  - Inside the workflows is where will create our first action yaml file

  ```
      .github/
          workflows/
              test-action.yml
  ```

  - test-action.yml code

  ```yaml
  name: Test Workflow
  on:
  push:
      branches:
      - main
  pull_request:
      branches:
      - main
      # Defines the events that trigger the workflow.
      # This workflow will run on pushes to the main branch
      # and pull requests targeting the main branch.
  jobs:
  build:
      runs-on: ubuntu-latest
      # Specifies the type of machine to run the job on.
      # Here, it's running on the latest version of Ubuntu.
      environment: test
      # set the enviroment
      steps:
      - name: Checkout repository
      uses: actions/checkout@v2
      # Checks out your repository code.

      - name: Install Node.js
      uses: actions/setup-node@v2
      with:
          node-version: 'lts/*'
      # Sets up Node.js environment with the latest LTS version.

      - name: Install dependencies
      run: npm install
      # Installs your project dependencies using npm.

      - name: Create .env file
      run: |
          cat << EOF >> ./.env
          TEST_MONGODB_URI=${{ secrets.TEST_MONGODB_URI }}
          EOF
          # This command uses the cat utility along with a here document
          # (<< EOF) to append text to a file named .env.
          # The << EOF syntax indicates the start of the here document,
          # and EOF indicates the end. Anything between << EOF and
          # EOF will be appended to the .env file.

      - name: Run tests
      run: npm test
      # Executes your test script.
  ```

  - Use local mongodb in github actions

  ```yaml
      # Name of the GitHub Actions workflow
      name: Node.js CI

  # Defines when the workflow should run
  on:
  push:
      branches:
      - main
  pull_request:
      branches:
      - main

  # Defines the jobs that will be executed
  jobs:
  # Job name
  build:
      # Specifies the type of machine to run the job on
      runs-on: ubuntu-latest

      # Define a matrix strategy to test with multiple MongoDB versions
      strategy:
      matrix:
          mongodb-version: ['4.4.14', '5.0.9']

      # Defines the steps to execute in the job
      steps:
      # Step to checkout the repository code
      - name: Checkout repository
          uses: actions/checkout@v2

      # Step to start MongoDB using a GitHub Action
      - name: Start MongoDB
          uses: MongoCamp/mongodb-github-action@1.0.0
          with:
          mongodb-version: ${{ matrix.mongodb-version }}
          # Starts MongoDB using the specified versions from the matrix

      # Step to set up Node.js environment
      - name: Install Node.js
          uses: actions/setup-node@v2
          with:
          node-version: 'lts/*' # Use the latest LTS version of Node.js

      # Step to install project dependencies
      - name: Install dependencies
          run: npm install

      # Step to create .env file with MongoDB URIs
      - name: Create .env file
          run: |
          cat << EOF >> ./.env
          TEST_MONGODB_URI=mongodb://localhost:27017/testdatabase
          EOF
          # Appends TEST_MONGODB_URI to .env file with local MongoDB URI

      # Step to run tests
      - name: Run tests
          run: npm test
  ```
