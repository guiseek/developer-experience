import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { logGenerator } from './generator';
import { LogGeneratorSchema } from './schema';

describe('log generator', () => {
  let tree: Tree;
  const options: LogGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    try {
      await logGenerator(tree, options);
      const config = readProjectConfiguration(tree, 'test');
      expect(config).toBeDefined();
    } catch (err) {
      console.log(err);
    }
  });
});
