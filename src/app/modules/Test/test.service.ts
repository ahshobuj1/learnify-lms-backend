import { TTest } from './test.interface';
import { TestModel } from './test.model';

const createTest = async (payload: TTest) => {
  const result = await TestModel.create(payload);
  return result;
};

const Test = async () => {
  const result = await TestModel.find();

  if (!result) {
    return { message: 'Testing is successful' };
  }
  return result;
};

export const testService = {
  createTest,
  Test,
};
