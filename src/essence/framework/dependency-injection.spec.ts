import {DependencyInjector} from './dependency-injection';

class TestClass {
  name = 'testClass';
}

class TestClassWithDependency {
  public static inject = [TestClass];
  constructor(public test: TestClass) {
  }
}

describe('DependencyInjector', () => {
  let dependencyInjector: DependencyInjector;

  beforeEach(() => {
    dependencyInjector = new DependencyInjector();
  });

  it('should be created', () => {
    expect(dependencyInjector).toBeTruthy();
  });

  describe('addInstance', () => {
    it('should store instance', () => {
      const expectedTypeName = {name: 'TestClass'};
      const expectedResult = {test: 'test result'};

      dependencyInjector.addInstance(expectedTypeName, expectedResult);

      expect(dependencyInjector.get(expectedTypeName)).toEqual(expectedResult);
    });

    it('should give error when providing multiple instances of same type', () => {
      const expectedTypeName = {name: 'TestClass'};

      dependencyInjector.addInstance(expectedTypeName, {test: 'test result'});

      expect(() => dependencyInjector.addInstance(expectedTypeName, {test: 'test result'})).toThrowError();
    });
  });

  describe('addClass', () => {
    it('should register instance without dependencies', () => {
      dependencyInjector.addClass(TestClass);

      expect(dependencyInjector.get(TestClass)).toBeTruthy();
    });

    it('should register instance with dependency', () => {
      dependencyInjector.addClass(TestClass);
      dependencyInjector.addClass(TestClassWithDependency);

      const instance = dependencyInjector.get(TestClassWithDependency);

      expect(instance?.test.name).toEqual('testClass');

    });
  });
});
