import { Factory } from 'fishery';
import { TestModel } from 'fixtures/testModel';

export const testModelFactory = Factory.define<TestModel>(() => {
  return {
    and: { value1: 'foo', value2: 'bar' },
    boolArray: [true, false],
    boolValue: false,
    id: 1,
    modelValue: { email: 'test@test.com', id: 2 },
    modelsArray: [{ email: 'test@test.com', id: 1 }],
    modelsObjectIndirect: {
      key: {
        email: 'test@test.com',
        id: 1,
        testSubModel2: false,
      },
    },
    numberArray: [1, 2],
    numberArrayReadonly: [1, 2],
    numberValue: 5,
    objLiteral: {
      name: 'hello',
    },
    object: { foo: 'bar' },
    objectArray: [{ foo1: 'bar1' }, { foo2: 'bar2' }],
    optionalString: 'test1234',
    or: { value1: 'Foo' },
    referenceAnd: { value1: 'foo', value2: 'bar' },
    strLiteralArr: ['Foo', 'Bar'],
    strLiteralVal: 'Foo',
    stringArray: ['test', 'testtwo'],
    stringValue: 'test1234',
  };
});
