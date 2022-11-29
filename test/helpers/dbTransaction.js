import { Model, knexSnakeCaseMappers } from 'objection';
import Knex from 'knex';

const knex = Knex({
  client: 'pg',
  connection: {
    database: 'test_project_test',
    user: 'postgres',
    port: 5400,
  },
  ...knexSnakeCaseMappers(),
});

let trx;

beforeEach(async () => {
  trx = await Model.startTransaction(knex);
  Model.knex(trx);
});

afterEach(async () => {
  await trx.rollback();
});

afterAll(async () => {
  await knex.destroy();
});
