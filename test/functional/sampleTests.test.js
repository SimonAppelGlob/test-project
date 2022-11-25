import request from 'supertest';
import * as axios from 'axios';
import app from 'app';
import 'test/helpers/dbTransaction';

jest.mock('axios');

describe('jest', () => {
  it('works', () => {
    expect(Math.min()).toBeGreaterThan(Math.max());
  });

  describe('POST /advice', () => {
    describe('if no query is passed', () => {
      it('returns an error', async () => {
        axios.get.mockImplementation(() =>
          Promise.reject({ status: 404, data: undefined }),
        );

        const { statusCode } = await request(app)
          .post('/advice')
          .send({ query: null });

        expect(statusCode).toBe(400);
      });
    });

    describe('if query is passed', () => {
      it('returns the advice', async () => {
        axios.get.mockImplementation(() =>
          Promise.resolve({
            data: { slips: [{ advice: 'DUMMY ADVICE', id: 1 }] },
          }),
        );

        const { statusCode } = await request(app)
          .post('/advice')
          .send({ query: 'ice' });

        expect(statusCode).toBe(200);
      });

      it('but is not coherent text, then returns the advice', async () => {
        axios.get.mockImplementation(() => Promise.resolve({}));

        const { statusCode } = await request(app)
          .post('/advice')
          .send({ query: '[][]' });

        expect(statusCode).toBe(404);
      });
    });
  });
});
