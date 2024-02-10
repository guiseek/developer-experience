import { LogGeneratorSchema } from './schema';
import { join } from 'path';
import {
  names,
  type Tree,
  formatFiles,
  generateFiles,
  installPackagesTask,
  detectPackageManager,
  addDependenciesToPackageJson,
  addProjectConfiguration,
} from '@nx/devkit';

export async function logGenerator(tree: Tree, options: LogGeneratorSchema) {
  const { fileName: name } = names(options.name);
  const { fileName: directory } = names(options.directory ?? '');
  const projectRoot = join(directory, name);

  /**
   * Create folder and project.json for doc
   */
  addProjectConfiguration(tree, name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: {
        command: 'nx exec -- astro check && astro build',
        outputs: ['dist/{projectRoot}'],
        options: {
          cwd: projectRoot,
          args: ['config=./astro.config.mjs'],
        },
        cache: true,
      },
      serve: {
        command: 'nx exec -- astro dev',
        options: {
          cwd: projectRoot,
          args: ['config=./astro.config.mjs'],
        },
      },
    },
  });

  /**
   * Place statis and config files into doc
   */
  const x = (name.length + 2) * 14 + 80;
  const properties = { name, x, directory, projectRoot };
  generateFiles(tree, join(__dirname, 'files'), projectRoot, properties);

  /**
   * Update .gitignore with .astro (generates types)
   */
  const content = tree.exists('.gitignore')
    ? tree.read('.gitignore').toString('utf-8')
    : ['dist', 'node_modules'].join('\n');

  if (content && !content.includes('.astro')) {
    const dotAstro = `\n\n# generated types\n.astro/`;
    const contentWithDotAstro = `${content}\n${dotAstro}`;
    tree.write('.gitignore', contentWithDotAstro);
  }

  /**
   * Update package.json with astro dependencies
   */
  addDependenciesToPackageJson(
    tree,
    {
      astro: '^4.3.2',
      sass: '^1.69.5',
      sharp: '^0.32.6',
      typescript: '^5.3.3',
    },
    {}
  );

  installPackagesTask(tree, true, '.', detectPackageManager());

  return await formatFiles(tree);
}

export default logGenerator;
