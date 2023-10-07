import {DependencyInjector} from './framework/dependency-injection';
import { ComponentManager } from './framework/component-manager';
import { Router } from './framework/router';
import { PlatformService } from './framework/platform-service';

import {registerEssenceSvg} from './tools/essence-svg';


const di = new DependencyInjector();

// TODO: not nice that these needs to be in specific order:
di.addClass(PlatformService);
di.addClass(ComponentManager);
di.addClass(Router);

registerEssenceSvg();

export {
  ComponentManager,
  di,
}
// setup di for essence provided classes
// handle user provided classes in di

// setup router with correct config
// export the needed classes so that others can use the framework
