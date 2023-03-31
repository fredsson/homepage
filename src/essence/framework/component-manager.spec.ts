import { ViewModel, ViewModelConfig } from 'essence/core';
import {ComponentManager} from './component-manager';
import { DependencyInjector } from './dependency-injection';
import { PlatformService } from './platform-service';

class TestComponent implements ViewModel {
  public content = 'test content';
  public readonly name = 'test';

  public destroySpy = jasmine.createSpy();

  public config() {
    return {
      bindings: [],
      events: [],
      inputs: []
    }
  }
  init() {
  }
  destroy() {
    this.destroySpy();
  }
}

describe('ComponentManager', () => {
  let componentManager: ComponentManager;

  let mockPlatform: jasmine.SpyObj<PlatformService>;
  let mockDi: jasmine.SpyObj<DependencyInjector>;

  let mockElement: Partial<HTMLElement>;

  beforeEach(() => {
    mockElement = {innerHTML: ''};

    mockPlatform = jasmine.createSpyObj<PlatformService>('PlatformService', ['querySelector', 'removeCssStyleWithTitle']);
    mockPlatform.querySelector.and.returnValue(mockElement as Element);

    mockDi = jasmine.createSpyObj<DependencyInjector>('DependencyInjector', ['inject']);
    mockDi.inject.and.callFake(token => new token());

    componentManager = new ComponentManager(mockPlatform, mockDi);
  });

  it('should be created', () => {
    expect(componentManager).toBeTruthy();
  });

  describe('changeToComponent', () => {
    it('should attach component html', () => {
      componentManager.changeToComponent(TestComponent);

      expect(mockElement.innerHTML).toEqual('test content');
    });

    it('should handle missing mount point', () => {
      mockPlatform.querySelector.and.returnValue(undefined);

      expect(() => componentManager.changeToComponent(TestComponent)).not.toThrowError();
      expect (mockDi.inject).not.toHaveBeenCalled();
    });

    it('should destroy already attached component', () => {
      componentManager.changeToComponent(TestComponent);
      const previousComponent = mockDi.inject.calls.mostRecent().returnValue as TestComponent;

      componentManager.changeToComponent(TestComponent)

      expect(previousComponent.destroySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeToComponentFromRoute', () => {

  });
});
