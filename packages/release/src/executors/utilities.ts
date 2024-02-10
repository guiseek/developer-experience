import { resolveSemverSpecifierFromConventionalCommits } from 'nx/src/command-line/release/utils/resolve-semver-specifier';
import type { NxReleaseVersionResult } from 'nx/src/command-line/release/version';
import type { ReleaseProject, ReleaseProjectResult } from './types';
import { createProjectGraphAsync } from '@nx/devkit';
import { type ReleaseType } from 'semver';
import {
  getFirstGitCommit,
  getLatestGitTagForPattern,
} from 'nx/src/command-line/release/utils/git';

export async function resolveSemverConventional(from: string) {
  const graph = await createProjectGraphAsync();
  const projects = Object.keys(graph.nodes);
  return resolveSemverSpecifierFromConventionalCommits(
    from,
    graph,
    projects
  ) as Promise<ReleaseType>;
}

export async function getFirstRelease() {
  const commit = await getFirstGitCommit();
  return await resolveSemverConventional(commit);
}

export async function getCurrentVersion(
  pattern = '{version}',
  data: object = {}
) {
  const latestTag = await getLatestGitTagForPattern(pattern, data);
  const version = latestTag?.extractedVersion;
  const tag = latestTag?.tag;
  return { version, tag };
}

export function getReleasedProjects(
  result: NxReleaseVersionResult
): ReleaseProjectResult {
  const { workspaceVersion, projectsVersionData } = result;

  const data = Object.entries(projectsVersionData);

  return {
    workspace: workspaceVersion ?? null,
    projects: data.map(([name, { newVersion: version }]) => ({
      name,
      version,
    })),
  };
}

export function showReleasedTable(
  projects: ReleaseProject[] = [],
  workspace: string | null
) {
  const table: ReleaseProject[] = [];

  if (workspace) {
    table.push({ name: 'workspace', version: workspace });
  }

  table.push(...projects);

  console.table(table);
}
