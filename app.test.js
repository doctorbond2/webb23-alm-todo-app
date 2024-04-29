const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');

// Load environment variables from .env file
require('dotenv').config();

const mongoURI = process.env.TEST_MONGODB_URI;

// Connect to the test database before running any tests
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the database after each test
beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

// Close the database connection and the server after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /todos', () => {
  test('It should respond with an empty array initially', async () => {
    const response = await request(app).get('/todos');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('POST /todos', () => {
  test('It should create a new todo', async () => {
    const newTodo = { text: 'Buy groceries' };
    const response = await request(app)
      .post('/todos')
      .send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(newTodo);
  });

  test('It should not create a new todo without text', async () => {
    const response = await request(app)
      .post('/todos')
      .send({});
    expect(response.statusCode).toBe(400);
  });
});

describe('DELETE /todos/:id', () => {
  test('It should delete a todo by ID', async () => {
    const todo = await request(app)
      .post('/todos')
      .send({ text: 'Walk the dog' });
    
    const response = await request(app).delete(`/todos/${todo.body._id}`);
    expect(response.statusCode).toBe(204);

    const getResponse = await request(app).get('/todos');
    expect(getResponse.body).toEqual([]);
  });

  test('It should return 404 if todo ID not found', async () => {
    const response = await request(app).delete('/todos/123321312231');
    expect(response.statusCode).toBe(404);
  });
});
