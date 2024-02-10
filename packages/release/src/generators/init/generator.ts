import { formatFiles, readNxJson, Tree, updateNxJson } from '@nx/devkit';
import { InitGeneratorSchema } from './schema';

export async function initGenerator(tree: Tree, options: InitGeneratorSchema) {
  const nxJson = readNxJson(tree) ?? {};

  if (nxJson?.release && nxJson.release.version) {
    throw new Error(`nx release config already initialized`);
  }

  nxJson.release = {
    ...nxJson.release,
    version: { conventionalCommits: options.conventional ?? true },
    projectsRelationship: options.relationship ?? 'fixed',
    releaseTagPattern: '{version}',
  };

  updateNxJson(tree, nxJson);

  await formatFiles(tree);
}

export default initGenerator;
