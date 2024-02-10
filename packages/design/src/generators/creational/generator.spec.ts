import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { join } from 'path';

import { creationalGenerator } from './generator';
import { CreationalPattern, PatternOptions } from '../../interfaces';

describe('creational generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should generate a singleton pattern', async () => {
    const options: PatternOptions<CreationalPattern> = {
      name: 'test',
      pattern: 'singleton',
      singleFile: false,
    };

    await creationalGenerator(tree, options);

    const file = join(options.name, `${options.name}.ts`);

    expect(tree.exists(file)).toBeTruthy();
  });
});
