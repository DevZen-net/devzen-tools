export interface IdistZenCommonOptions {
  workDir?: string
  logLevel: string // @todo: grab strings of ELogLevel only
  debug?: boolean
  dryRun?: boolean
  skipInstallLocal?: false
  forceInstallLocal?: false
  clean?: boolean | string[]
  deepClean?: boolean | string[]
  noCleanExit?: boolean
  watch?: boolean | number
}

export interface IdistZenCliOptions extends IdistZenCommonOptions {
  config?: string
}

export type TDependencies = { [dependencyName: string]: string }

export type TDependencyResolved = {
  dependencyName: string // eg '@devzen/zendash',
  declaredPath: string // eg '../zendash',
  absolutePath: string // eg '/projects/devzen/packages/zendash',
  absoluteSrcPath: string // eg '/projects/devzen/packages/zendash/src',
  absoluteDistPath: string // eg '/projects/devzen/packages/zendash/dist',
  installedPath: string // eg '/projects/devzen/packages/authzen-nestjs-example/node_modules/@devzen/zendash'
  installedDistPath: string // eg '/projects/devzen/packages/authzen-nestjs-example/node_modules/@devzen/zendash/dist'
  distDirName: string // eg dist / dst / build
  srcDirName: string // eg dist / dst / build
}

export type TDependenciesResolved = {
  [dependencyName: string]: TDependencyResolved
}

export interface IdistZenConfig extends IdistZenCommonOptions {
  localDependencies: TDependencies // if declared they are merged with package.json#localDependencies (from install-local)
  targetDepNames: string[] // used to _.pick only the deps we care about
}

export interface IdistZenConfigAndOptions extends IdistZenCliOptions, IdistZenConfig {
  dependant: any
  localDependenciesResolved: TDependenciesResolved // all localDeps, resolved. Used by install-local, as we need to install all of them always!
  targets: TDependenciesResolved // Filtered with only those we care to watch, clean, copy, ts-clean-build
  resolvedDir: string // resolved from cwd + workDir
  clean: string[]
  deepClean: string[]
  cycles: number
  dependantName: string // name of your App, that use localDependencie, eg great-app
}

export const distZenDefaults: Partial<IdistZenConfigAndOptions> = {
  workDir: './',
  cycles: 0,
}

export const defaultConfigFilename = '.distzen.yml'
