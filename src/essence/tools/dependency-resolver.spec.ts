import {DependencyResolver} from './dependency-resolver';

describe('DependencyResolver', () => {
  let dependancyResolver: DependencyResolver;

  beforeEach(() => {
    dependancyResolver = new DependencyResolver();
  });

  it('should be created', () => {
    expect(dependancyResolver).toBeTruthy();
  });

  describe('resolveForSource', () => {
    it('should ignore class without constructor parameters', () => {
      const expectedClassSource = `
        class Test {
          constructor() {
          }
        }
      `;
      expect(dependancyResolver.resolveForSource(expectedClassSource)).toBeUndefined();
    });

    it('should add inject based on constructor', () => {
      const expectedClassSource = `
        class Test {
          constructor(private router: Router, private componentManager: ComponentManager) {
          }
        }
      `;

      expect(dependancyResolver.resolveForSource(expectedClassSource)).toEqual('public static inject = [Router,ComponentManager];');
    });

    it('should handle class without constructor', () => {
      const expectedClassSource = `class Test {}`;
    expect(dependancyResolver.resolveForSource(expectedClassSource)).toBeUndefined();
    });
  });
});
