import { Model } from 'objection';

class Advice extends Model {
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  static get tableName() {
    return 'advices';
  }
}

const insertAdvice = async (props) => {
  return Advice.query().insert(props).returning('*');
};

const deleteAdvice = async (id) => {
  return Advice.query().delete().where({ api_id: id });
};

export { Advice as default, insertAdvice, deleteAdvice };
