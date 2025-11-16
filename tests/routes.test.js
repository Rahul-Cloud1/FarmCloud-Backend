const request = require('supertest');

// Ensure test env vars are set before importing the app so controllers can use them
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'dummy';

const app = require('../server');
const axios = require('axios');

jest.mock('axios');

describe('API Routes (integration)', () => {
  let token;
  let userId;

  test('GET / should return running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/FarmCloud Backend is Running/);
  });

  test('User register and login', async () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password',
      role: 'farmer',
      location: 'Testville'
    };

    const reg = await request(app).post('/api/users/register').send(user);
    expect(reg.statusCode).toBe(201);
    expect(reg.body.token).toBeDefined();
    userId = reg.body.user._id;

    const login = await request(app).post('/api/users/login').send({ email: user.email, password: user.password });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeDefined();
    token = login.body.token;
  });

  test('Products CRUD (add & list & get by id)', async () => {
    const product = {
      name: 'Test Seed',
      description: 'Good seed',
      price: 9.99,
      quantity: 100,
      category: 'seeds'
    };

    const add = await request(app).post('/api/products').send(product);
    expect(add.statusCode).toBe(201);
    expect(add.body._id).toBeDefined();

    const list = await request(app).get('/api/products');
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(1);

    const getOne = await request(app).get(`/api/products/${add.body._id}`);
    expect(getOne.statusCode).toBe(200);
    expect(getOne.body.name).toBe(product.name);
  });

  test('Rentals: add listing (protected) and book', async () => {
    // create a fresh user and login for this test (each test runs with clean DB)
    const user2 = {
      name: 'Renter User',
      email: 'renter@example.com',
      phone: '5555555555',
      password: 'password',
      role: 'machine_owner',
      location: 'Rentville'
    };

    const reg2 = await request(app).post('/api/users/register').send(user2);
    expect(reg2.statusCode).toBe(201);
    const login2 = await request(app).post('/api/users/login').send({ email: user2.email, password: user2.password });
    expect(login2.statusCode).toBe(200);
    const token2 = login2.body.token;

    // create rental listing
    const rental = {
      title: 'Tractor',
      description: 'Powerful tractor',
      category: 'machine',
      pricePerDay: 50
    };

    expect(token2).toBeDefined();
    const addRental = await request(app).post('/api/rentals').set('Authorization', `Bearer ${token2}`).send(rental);
    if (addRental.statusCode !== 201) console.log('addRental body:', addRental.body);
    expect(addRental.statusCode).toBe(201);
    const rentalId = addRental.body._id;

    // book the rental
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 2);

    const book = await request(app)
      .post(`/api/rentals/${rentalId}/book`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });

    expect(book.statusCode).toBe(200);
    expect(book.body.message).toMatch(/Rental booked/);
    expect(book.body.rental.bookings.length).toBeGreaterThanOrEqual(1);
  });

  test('Weather route (mocked)', async () => {
    // Mock axios response
    axios.get.mockResolvedValue({
      data: {
        name: 'MockCity',
        main: { temp: 20, humidity: 50 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        wind: { speed: 3 }
      }
    });

    const res = await request(app).get('/api/weather').query({ city: 'MockCity' });
    expect(res.statusCode).toBe(200);
    expect(res.body.location).toBe('MockCity');
    expect(res.body.temperature).toBe(20);
  });
});
