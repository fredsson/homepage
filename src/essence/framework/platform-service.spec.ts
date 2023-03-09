import {PlatformService} from "./platform-service";

describe('PlatformService', () => {
  let platform: PlatformService;

  beforeEach(() => {
    platform = new PlatformService();
  });

  it('should be created', () => {
    expect(platform).toBeTruthy();
  });
});
