import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readNxJson } from '@nx/devkit';

import { InitOptions } from '../../interfaces';
import { initGenerator } from './generator';

describe('init generator', () => {
  let tree: Tree;
  const options: InitOptions = { lang: 'en-us' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should setup plugin as en-us', async () => {
    await initGenerator(tree, options);

    const nxJson = readNxJson(tree) ?? {};

    nxJson.generators = { ...(nxJson?.generators ?? {}) };

    const config = nxJson.generators[
      '@developer-experience/design'
    ] as InitOptions;

    expect(config).toBeDefined();
    expect(config.lang).toBe('en-us');
  });
});
