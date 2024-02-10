import { GithubExecutorSchema } from './schema';
import { releaseVersion } from 'nx/release';
import {
  getFirstRelease,
  showReleasedTable,
  getCurrentVersion,
  getReleasedProjects,
  resolveSemverConventional,
} from '../utilities';

const runReleaseVersion = async (options: GithubExecutorSchema) => {
  try {
    if (options.specifier) {
      return await releaseVersion(options);
    } else {
      const { tag, version } = await getCurrentVersion();

      if (!tag || !version) {
        options.firstRelease = true;
        options.specifier = await getFirstRelease();
      } else {
        options.specifier = await resolveSemverConventional(version);
      }

      return await releaseVersion(options);
    }
  } catch (err) {
    throw new Error(`Github release error: ${err}`);
  }
};

export default async function runExecutor(options: GithubExecutorSchema) {
  console.log('Executor ran for Github', options);

  const released = await runReleaseVersion(options);

  const { workspace, projects } = getReleasedProjects(released);

  showReleasedTable(projects, workspace);

  return { success: !projects.length };
}
