import * as _ from 'lodash'
import * as _z from '@neozen/zendash'
import { ExcludeByKey, TAny_ExcludeObjectAndFunction } from './types-utilities'
import { objectToString } from './utils/objectToString'
import { getTinyLog } from './utils/tiny-log'

const _log = getTinyLog(true, 'types')

export enum EOnliesPriorities {
  FEAT = 1,
  LOOK = 2,
  ONLY = 3,
  FOCUS = 4,
  PICK = 5,
  SOLO = 6,
  ME = 7,
}

export const onliesPrioritiesDescriptions = {
  FEAT: `We are starting work on a feature (eg a workpiece, PR, a ticket etc), so everything belongs together in away. We want to start having focus on everything we can think of is related to that FEATure.`,
  LOOK: `We start delving down to what WORKs, cause some part the whole FEATure might be breaking, others are irrelevant noise etc.`,
  ONLY: `Only run this or these tests, it's our soft focus.`,
  FOCUS: `Focus on a specific group of Specs or Suites, along higher priority ones. The above ones with lower priority (FEAT & LOOK) are disabled.`,
  PICK: `Pick a group of worked-together tests, and run only them.`,
  SOLO: `What we are currently working on, nothing else should matter!`,
  ME: `Override anything else, only me!`,
}

export enum ESkipiesPriorities {
  FUTURE = 1,
  YAGNI = 2,
  BREAKS = 3,
  IGNORE = 4,
  NOPE = 5,
  SKIP = 6,
  TODO = 7,
  WIP = 8,
}

export const skipiesPrioritiesDescriptions = {
  FUTURE: `We might have a thought about this feature, but no focus at all right now. It's nice to have a roadmap and some meta though!`,
  YAGNI: `We know we don't need this feature, but we keep a test skeleton for it, just in case.`,
  BREAKS: `We know it breaks, probably for a long time. Not fixable, not the focus right now.`,
  IGNORE: `Ignore this test, its maybe part of the whole feature, just not this work piece (eg PR), or waiting for something or someone else etc.`,
  // alternatives: DONE, but we need something with negative connotation
  NOPE: `We dont actively want those. Maybe we are DONE with & they seem to work fine. But maybe we don't want their noise!`,
  SKIP: `We are currently working around this feature, but we want to be able to drill down a bit more if needed.`,
  TODO: `Marked in our open TODOs, will come back to it soon`,
  WIP: `Work in progress, but not there yet. Disable momentarily.`,
}

export abstract class Command {
  public _YOU_CANT_USE_ANY_COMMAND_HERE?: 'JUST_IGNORE_IT_AS_KEY' // search "ObjectWithAnyKeyExceptXxxHack"

  constructor(obj?: Command) {
    _.extend(this, obj)
  }

  [Symbol.for('nodejs.util.inspect.custom')](depth, inspectOptions, inspect) {
    return `${this.toString()}`
  }
}

export type TMatcher =
  | string
  | RegExp
  | ((val: any) => boolean)
  | (string | RegExp | ((val: any) => boolean))[]

export type TCommandWithMetaArgs<TU> = [string?] | [string, TU?] | [TU?]

export abstract class CommandWithMeta extends Command {
  constructor(args: TCommandWithMetaArgs<CommandWithMeta>) {
    super()

    let commandWithMeta: CommandWithMeta
    if (_.isString(args?.[0])) {
      this.reason = args[0]
      commandWithMeta = args[1]
      _.extend(this, args[1])
    } else commandWithMeta = args?.[0]

    _.extend(this, commandWithMeta)
  }

  toString() {
    return (
      '{ ' +
      this.constructor.name +
      '(' +
      (this.reason ? '`' + this.reason + '`' : '') +
      ') }'
    )
  }

  /**
   * Target a specific group @todo: NOT IMPLEMENTED
   *
   * eg {group: 'UserLogin'} or {group: ['UserLogin', 'UserLogout']}
   */
  group?: TMatcher

  /**
   * Why are we Skipping / Onlying this?
   *
   * Meta info for your own use (@todo: and reporting in future)
   */
  reason?: string

  /** Just for meta info of your choice */
  updates?: {
    date?: string
    description?: string
  }[]
}

export abstract class CommandWithPriority extends CommandWithMeta {
  public priorityName: string

  public static prioritiesEnum: Record<string, any> = {}

  constructor(
    public readonly priority: number,
    args?: TCommandWithMetaArgs<CommandWithMeta>
  ) {
    super(args)
    // prettier-ignore
    if (!this.priority) throw new Error(`SpecZen: ${this.constructor.name} called with no priority!`)

    // @ts-ignore - we know it's there but TS2339: Property pioritiesEnum does not exist on type Function
    this.priorityName = this.constructor.prioritiesEnum[this.priority]
  }
}

/**
 * Onlie (ONLY) & Skipy (SKIP) Filters - start a Filter below this point
 */

/**
 * The parent class of Onlie and Skipy (what ONLY() & SKIP() return)
 *
 * Options and all options params are optional
 */
export abstract class Filter extends CommandWithPriority {
  public _YOU_CANT_USE_FILTER_HERE: 'JUST_IGNORE_IT_AS_KEY' // search "ObjectWithAnyKeyExceptXxxHack"
}

/** ONLY() returns new Onlie() */
export class Onlie extends Filter {
  public __kind? = 'Onlie'

  static prioritiesEnum = EOnliesPriorities
}

/** SKIP() et al returns new Skipy() */
export class Skipy extends Filter {
  public __kind? = 'Skipy'

  static prioritiesEnum = ESkipiesPriorities
}

// UserLand - We use "U" in front, for what user expects to provide - search "choosing-Classes-Instances-Functions" for more details
export type UOnly = Omit<
  Onlie,
  '_YOU_CANT_USE_FILTER_HERE' | 'priority' | 'priorityName' | '__kind'
>
export type USkipy = Omit<
  Skipy,
  '_YOU_CANT_USE_FILTER_HERE' | 'priority' | 'priorityName' | '__kind'
>

export type T_ONLIE_TypeFunction = {
  (onlieObj?: UOnly): Onlie // lying a little bit here, there's no _YOU_CANT_USE_FILTER_HERE, but we need it to exclude it from specific places
  (reason: string, onlieObj?: Omit<UOnly, 'reason'>): Onlie // lying a little bit here, there's no _YOU_CANT_USE_FILTER_HERE, but we need it to exclude it from specific places
  _YOU_CANT_USE_FILTER_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}
export type T_SKIPY_TypeFunction = {
  (skipyObj?: USkipy): Skipy
  (reason: string, skipyObj?: Omit<USkipy, 'reason'>): Skipy
  _YOU_CANT_USE_FILTER_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}

export type TFilter =
  | Skipy
  | Onlie
  | T_SKIPY_TypeFunction
  | T_ONLIE_TypeFunction

// Filters In UserLand

// ONLY
export const ONLY: T_ONLIE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnly>
): Onlie => new Onlie(EOnliesPriorities.ONLY, args)
export const ME: T_ONLIE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnly>
): Onlie => new Onlie(EOnliesPriorities.ME, args)
export const SOLO: T_ONLIE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnly>
): Onlie => new Onlie(EOnliesPriorities.SOLO, args)
export const PICK: T_ONLIE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnly>
): Onlie => new Onlie(EOnliesPriorities.PICK, args)
export const FOCUS: T_ONLIE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnly>
): Onlie => new Onlie(EOnliesPriorities.FOCUS, args)
export const LOOK: T_ONLIE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnly>
): Onlie => new Onlie(EOnliesPriorities.LOOK, args)
export const FEAT: T_ONLIE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnly>
): Onlie => new Onlie(EOnliesPriorities.FEAT, args)

// SKIP
export const SKIP: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.SKIP, args)
export const FUTURE: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.FUTURE, args)
export const YAGNI: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.YAGNI, args)
export const BREAKS: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.BREAKS, args)
export const IGNORE: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.IGNORE, args)
export const NOPE: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.NOPE, args)
export const TODO: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.TODO, args)
export const WIP: T_SKIPY_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipy>
): Skipy => new Skipy(ESkipiesPriorities.WIP, args)

// helpers isOnly & isSkip
export const isSkipy = (val: any) =>
  val instanceof Skipy ||
  _.includes([FUTURE, YAGNI, BREAKS, IGNORE, NOPE, TODO, WIP, SKIP], val)

export const isOnlie = (val: any) =>
  val instanceof Onlie ||
  _.includes([ME, ONLY, SOLO, PICK, FOCUS, LOOK, FEAT], val)

export const isFilter = (val: any) => isSkipy(val) || isOnlie(val)

/**
 * Check or create a Filter out of value and return it, if val is a legit Filter or Filter Command
 *
 * @param val
 *
 * @returns FilterCmd instance or null
 */
export const legitFilter = (val: any): Filter | null => {
  if (isFilter(val)) {
    if (val instanceof Filter) return val
    else {
      // We have a Function TOKEN like `SKIP` or `ONLY`, without call - Create a valid Filter instance from it
      return (val as any)()
    }
  } else return null
}

/** FilterEnd - ends (stops/cancels) a Filter's effect from a Spec or Suite, below this point */

/**
 * The parent class of OnlieEnd and SkipyEnd (what ONLY_END() & SKIP_END() return)
 *
 * Options and all options params are optional
 */
export abstract class FilterEnd extends CommandWithPriority {
  public _YOU_CANT_USE_FILTER_STOP_HERE: 'JUST_IGNORE_IT_AS_KEY' // search "ObjectWithAnyKeyExceptXxxHack"
}

/** ONLY_END() returns new OnlieEnd() */
export class OnlieEnd extends FilterEnd {
  public __kind? = 'OnlieEnd'

  static prioritiesEnum = EOnliesPriorities
}

/** SKIP_END() returns new SkipyEnd() */
export class SkipyEnd extends FilterEnd {
  public __kind? = 'SkipyEnd'

  static prioritiesEnum = ESkipiesPriorities
}

// UserLand - We use "U" in front, for what user expects to provide - search "choosing-Classes-Instances-Functions" for more details
export type UOnlieEnd = Omit<
  OnlieEnd,
  '_YOU_CANT_USE_FILTER_STOP_HERE' | 'priority' | 'priorityName' | '__kind'
>
export type USkipyEnd = Omit<
  SkipyEnd,
  '_YOU_CANT_USE_FILTER_STOP_HERE' | 'priority' | 'priorityName' | '__kind'
>

export type T_ONLIE_STOP_TypeFunction = {
  (onlieStopObjObj?: UOnlieEnd): OnlieEnd // lying a little bit here, there's no _YOU_CANT_USE_FILTER_STOP_HERE, but we need it to exclude it from specific places
  (reason: string, onlieStopObjObj?: UOnlieEnd): OnlieEnd // lying a little bit here, there's no _YOU_CANT_USE_FILTER_STOP_HERE, but we need it to exclude it from specific places

  _YOU_CANT_USE_FILTER_STOP_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}
export type T_SKIPY_END_TypeFunction = {
  (skipyEndObj?: USkipyEnd): SkipyEnd
  (reason: string, skipyEndObj?: USkipyEnd): SkipyEnd

  _YOU_CANT_USE_FILTER_STOP_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}
export type TFilterEnd =
  | SkipyEnd
  | OnlieEnd
  | T_SKIPY_END_TypeFunction
  | T_ONLIE_STOP_TypeFunction

// OnlieEnds
export const ONLY_END: T_ONLIE_STOP_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlieEnd>
): OnlieEnd => new OnlieEnd(EOnliesPriorities.ONLY, args)
export const ME_END: T_ONLIE_STOP_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlieEnd>
): OnlieEnd => new OnlieEnd(EOnliesPriorities.ME, args)
export const SOLO_END: T_ONLIE_STOP_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlieEnd>
): OnlieEnd => new OnlieEnd(EOnliesPriorities.SOLO, args)
export const PICK_END: T_ONLIE_STOP_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlieEnd>
): OnlieEnd => new OnlieEnd(EOnliesPriorities.PICK, args)
export const FOCUS_END: T_ONLIE_STOP_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlieEnd>
): OnlieEnd => new OnlieEnd(EOnliesPriorities.FOCUS, args)
export const LOOK_END: T_ONLIE_STOP_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlieEnd>
): OnlieEnd => new OnlieEnd(EOnliesPriorities.LOOK, args)
export const FEAT_END: T_ONLIE_STOP_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlieEnd>
): OnlieEnd => new OnlieEnd(EOnliesPriorities.FEAT, args)

// SkipyEnds
export const SKIP_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.SKIP, args)
export const FUTURE_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.FUTURE, args)
export const YAGNI_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.YAGNI, args)
export const BREAKS_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.BREAKS, args)
export const IGNORE_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.IGNORE, args)
export const NOPE_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.NOPE, args)
export const TODO_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.TODO, args)
export const WIP_END: T_SKIPY_END_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyEnd>
): SkipyEnd => new SkipyEnd(ESkipiesPriorities.WIP, args)

export const isSkipyEnd = (val: any) =>
  val instanceof SkipyEnd ||
  _.includes(
    [
      FUTURE_END,
      YAGNI_END,
      BREAKS_END,
      IGNORE_END,
      NOPE_END,
      TODO_END,
      WIP_END,
      SKIP_END,
    ],
    val
  )

export const isOnlieEnd = (val: any) =>
  val instanceof OnlieEnd ||
  _.includes(
    [ME_END, ONLY_END, SOLO_END, PICK_END, FOCUS_END, LOOK_END, FEAT_END],
    val
  )

export const isFilterEnd = (val: any) => isSkipyEnd(val) || isOnlieEnd(val)

/**
 * Check or create an FilterEnd out of value and return it, if val is a legit Filter or Filter Command
 *
 * @param val
 *
 * @returns FilterCmd instance or null
 */
export const legitFilterEnd = (val: any): FilterEnd | null => {
  if (isFilterEnd(val)) {
    if (val instanceof FilterEnd) return val
    else {
      // We have a Function TOKEN like `SKIP` or `ONLY`, without call.
      // Create a Filter instance from it
      return (val as any)()
    }
  } else return null
}

/**
 * OnlieAbove (ONLY_ABOVE) & SkipyAbove (SKIP_ABOVE) Filters - start a Filter ABOVE this point
 */

export abstract class FilterAbove extends CommandWithPriority {
  public _YOU_CANT_USE_FILTER_ABOVE_HERE: 'JUST_IGNORE_IT_AS_KEY' // search "ObjectWithAnyKeyExceptXxxHack"
}

export class OnlieAbove extends FilterAbove {
  public __kind? = 'OnlieAbove'

  static prioritiesEnum = EOnliesPriorities

  // @ts-ignore
  constructor(...args: any[]) {
    super(args[0])
    throw new Error(`SpecZen: OnlieAbove is not implemented yet!`)
  }
}

export class SkipyAbove extends FilterAbove {
  public __kind? = 'SkipyAbove'

  static prioritiesEnum = ESkipiesPriorities

  // @ts-ignore
  constructor(...args: any[]) {
    super(args[0])
    throw new Error(`SpecZen: SkipyAbove is not implemented yet!`)
  }
}

// UserLand - We use "U" in front, for what user expects to provide - search "choosing-Classes-Instances-Functions" for more details
export type UOnlyAbove = Omit<
  OnlieAbove,
  '_YOU_CANT_USE_FILTER_ABOVE_HERE' | 'priority' | 'priorityName' | '__kind'
>
export type USkipyAbove = Omit<
  SkipyAbove,
  '_YOU_CANT_USE_FILTER_ABOVE_HERE' | 'priority' | 'priorityName' | '__kind'
>

export type T_ONLIE_ABOVE_TypeFunction = {
  (onlieAboveObj?: UOnlyAbove): OnlieAbove // lying a little bit here, there's no _YOU_CANT_USE_FILTER_HERE, but we need it to exclude it from specific places
  (reason: string, onlieAboveObj?: UOnlyAbove): OnlieAbove // lying a little bit here, there's no _YOU_CANT_USE_FILTER_HERE, but we need it to exclude it from specific places

  _YOU_CANT_USE_FILTER_ABOVE_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}
export type T_SKIPY_ABOVE_TypeFunction = {
  (skipyAboveObj?: USkipyAbove): SkipyAbove
  (reason: string, skipyAboveObj?: USkipyAbove): SkipyAbove

  _YOU_CANT_USE_FILTER_ABOVE_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}
export type TFilterAbove =
  | T_SKIPY_ABOVE_TypeFunction
  | T_ONLIE_ABOVE_TypeFunction
  | SkipyAbove
  | OnlieAbove

export const ONLY_ABOVE: T_ONLIE_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyAbove>
): OnlieAbove => new OnlieAbove(EOnliesPriorities.ONLY, args)
export const ME_ABOVE: T_ONLIE_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyAbove>
): OnlieAbove => new OnlieAbove(EOnliesPriorities.ME, args)
export const SOLO_ABOVE: T_ONLIE_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyAbove>
): OnlieAbove => new OnlieAbove(EOnliesPriorities.SOLO, args)
export const PICK_ABOVE: T_ONLIE_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyAbove>
): OnlieAbove => new OnlieAbove(EOnliesPriorities.PICK, args)
export const FOCUS_ABOVE: T_ONLIE_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyAbove>
): OnlieAbove => new OnlieAbove(EOnliesPriorities.FOCUS, args)
export const LOOK_ABOVE: T_ONLIE_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyAbove>
): OnlieAbove => new OnlieAbove(EOnliesPriorities.LOOK, args)
export const FEAT_ABOVE: T_ONLIE_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyAbove>
): OnlieAbove => new OnlieAbove(EOnliesPriorities.FEAT, args)

export const SKIP_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.SKIP, args)
export const FUTURE_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.FUTURE, args)
export const YAGNI_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.YAGNI, args)
export const BREAKS_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.BREAKS, args)
export const IGNORE_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.IGNORE, args)
export const NOPE_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.NOPE, args)
export const TODO_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.TODO, args)
export const WIP_ABOVE: T_SKIPY_ABOVE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyAbove>
): SkipyAbove => new SkipyAbove(ESkipiesPriorities.WIP, args)

export const isSkipyAbove = (val: any) =>
  val instanceof SkipyAbove ||
  _.includes(
    [
      FUTURE_ABOVE,
      YAGNI_ABOVE,
      BREAKS_ABOVE,
      IGNORE_ABOVE,
      NOPE_ABOVE,
      TODO_ABOVE,
      WIP_ABOVE,
      SKIP_ABOVE,
    ],
    val
  )

export const isOnlieAbove = (val: any) =>
  val instanceof OnlieAbove ||
  _.includes(
    [
      ME_ABOVE,
      ONLY_ABOVE,
      SOLO_ABOVE,
      PICK_ABOVE,
      FOCUS_ABOVE,
      LOOK_ABOVE,
      FEAT_ABOVE,
    ],
    val
  )

export const isFilterAbove = (val: any) =>
  isSkipyAbove(val) || isOnlieAbove(val)

/**
 * Check or create a FilterAbove out of value and return it, if val is a legit FilterAbove
 * @param val
 * @returns FilterAbove instance or null
 */
export const legitFilterAbove = (val: any): FilterAbove | null => {
  if (isFilterAbove(val)) {
    if (val instanceof FilterAbove) return val
    else {
      // We have a Function TOKEN like `SKIP` or `ONLY`, without call - Create a valid Filter instance from it
      return (val as any)()
    }
  } else return null
}

/**
 * OnlieMerge (ONLY_MERGE) & SkipyMute (SKIP_MUTE) Filters - start a Filter IGNORE this point
 */

export abstract class FilterIgnore extends CommandWithPriority {
  public _YOU_CANT_USE_FILTER_IGNORE_MERGE_MUTE_HERE: 'JUST_IGNORE_IT_AS_KEY' // search "ObjectWithAnyKeyExceptXxxHack"
}

export class OnlieMerge extends FilterIgnore {
  public __kind? = 'OnlieMerge'

  static prioritiesEnum = EOnliesPriorities

  // @ts-ignore
  constructor(...args: any[]) {
    super(args[0])
    throw new Error(`SpecZen: OnlieMerge is not implemented yet!`)
  }
}

export class SkipyMute extends FilterIgnore {
  public __kind? = 'SkipyMute'

  static prioritiesEnum = ESkipiesPriorities
}

// UserLand - We use "U" in front, for what user expects to provide - search "choosing-Classes-Instances-Functions" for more details
export type UOnlyMerge = Omit<
  OnlieMerge,
  | '_YOU_CANT_USE_FILTER_IGNORE_MERGE_MUTE_HERE'
  | 'priority'
  | 'priorityName'
  | '__kind'
>
export type USkipyMute = Omit<
  SkipyMute,
  | '_YOU_CANT_USE_FILTER_IGNORE_MERGE_MUTE_HERE'
  | 'priority'
  | 'priorityName'
  | '__kind'
>

export type T_ONLIE_MERGE_TypeFunction = {
  (onlieIgnoreObj?: UOnlyMerge): OnlieMerge // lying a little bit here, there's no _YOU_CANT_USE_FILTER_HERE, but we need it to exclude it from specific places
  (reason: string, onlieIgnoreObj?: UOnlyMerge): OnlieMerge // lying a little bit here, there's no _YOU_CANT_USE_FILTER_HERE, but we need it to exclude it from specific places
  _YOU_CANT_USE_FILTER_IGNORE_MERGE_MUTE_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}
export type T_SKIPY_MUTE_TypeFunction = {
  (skipyIgnoreObj?: USkipyMute): SkipyMute
  (reason: string, skipyIgnoreObj?: USkipyMute): SkipyMute
  _YOU_CANT_USE_FILTER_IGNORE_MERGE_MUTE_HERE?: 'JUST_IGNORE_IT_AS_KEY'
}
export type TFilterIgnore =
  | T_SKIPY_MUTE_TypeFunction
  | T_ONLIE_MERGE_TypeFunction
  | SkipyMute
  | OnlieMerge

// Onlies Merge (a.k.a Ignore)

export const ONLY_MERGE: T_ONLIE_MERGE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyMerge>
): OnlieMerge => new OnlieMerge(EOnliesPriorities.ONLY, args)
export const ME_MERGE: T_ONLIE_MERGE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyMerge>
): OnlieMerge => new OnlieMerge(EOnliesPriorities.ME, args)
export const SOLO_MERGE: T_ONLIE_MERGE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyMerge>
): OnlieMerge => new OnlieMerge(EOnliesPriorities.SOLO, args)
export const PICK_MERGE: T_ONLIE_MERGE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyMerge>
): OnlieMerge => new OnlieMerge(EOnliesPriorities.PICK, args)
export const FOCUS_MERGE: T_ONLIE_MERGE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyMerge>
): OnlieMerge => new OnlieMerge(EOnliesPriorities.FOCUS, args)
export const LOOK_MERGE: T_ONLIE_MERGE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyMerge>
): OnlieMerge => new OnlieMerge(EOnliesPriorities.LOOK, args)
export const FEAT_MERGE: T_ONLIE_MERGE_TypeFunction = (
  ...args: TCommandWithMetaArgs<UOnlyMerge>
): OnlieMerge => new OnlieMerge(EOnliesPriorities.FEAT, args)

// Skipies Mute (a.k.a Ignore)
export const SKIP_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.SKIP, args)
export const FUTURE_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.FUTURE, args)
export const YAGNI_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.YAGNI, args)
export const BREAKS_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.BREAKS, args)
export const IGNORE_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.IGNORE, args)
export const NOPE_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.NOPE, args)
export const TODO_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.TODO, args)
export const WIP_MUTE: T_SKIPY_MUTE_TypeFunction = (
  ...args: TCommandWithMetaArgs<USkipyMute>
): SkipyMute => new SkipyMute(ESkipiesPriorities.WIP, args)

export const isSkipyMute = (val: any) =>
  val instanceof SkipyMute ||
  _.includes(
    [
      FUTURE_MUTE,
      YAGNI_MUTE,
      BREAKS_MUTE,
      IGNORE_MUTE,
      NOPE_MUTE,
      TODO_MUTE,
      WIP_MUTE,
      SKIP_MUTE,
    ],
    val
  )

export const isOnlieMerge = (val: any) =>
  val instanceof OnlieMerge ||
  _.includes(
    [
      ME_MERGE,
      ONLY_MERGE,
      SOLO_MERGE,
      PICK_MERGE,
      FOCUS_MERGE,
      LOOK_MERGE,
      FEAT_MERGE,
    ],
    val
  )

export const isFilterIgnore = (val: any) =>
  isSkipyMute(val) || isOnlieMerge(val)

/**
 * Check or create a FilterIgnore out of value and return it, if val is a legit FilterIgnore
 * @param val
 * @returns FilterIgnore instance or null
 */
export const legitFilterIgnore = (val: any): FilterIgnore | null => {
  if (isFilterIgnore(val)) {
    if (val instanceof FilterIgnore) return val
    else {
      // We have a Function TOKEN like `SKIP` or `ONLY`, without call - Create a valid Filter instance from it
      return (val as any)()
    }
  } else return null
}

/** COLUMN */

// Internal - search "ObjectWithAnyKeyExceptXxxHack"
export type TAnyObject_ExcludeCOLUMNS = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_EMPTY_COLUMNS_COMMAND_ANYWHERE'
>
export type TAnyObject_ExcludeColumns = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_COLUMNS_COMMAND_HERE'
>

export class ColumnsCmd extends Command {
  public __kind? = 'ColumnsCmd'

  public _YOU_CANT_USE_COLUMNS_COMMAND_HERE: 'JUST_IGNORE_IT_AS_KEY'

  constructor(columnArgs: UColumns) {
    super(columnArgs)
  }

  public columnsNames?: string[] // @todo: make mandatory after Typings are done
}

export type UColumns = Omit<ColumnsCmd, '_YOU_CANT_USE_COLUMNS_COMMAND_HERE'>

export type T_COLUMNS_TypeFunction = {
  (columnName1: string, ...restColumnsNames: string[]): ColumnsCmd

  // (columnsAndTypes: Record<string, // @todo: not implemented
  //   string     // a single type name, eg 'string' or 'number
  //   | string[] // one or more types, eg ['string', 'number']
  //   // @todo: add classes for ValidZen!
  //  >
  // ): ColumnsCmd
  _YOU_CANT_USE_EMPTY_COLUMNS_COMMAND_ANYWHERE?: 'JUST_IGNORE_IT_AS_KEY' // @todo(385): handle empty COLUMNS anywhere
}

export const COLUMNS: T_COLUMNS_TypeFunction = (
  columnName1: string,
  ...columnsNames: string[]
): ColumnsCmd => {
  if (columnName1) columnsNames.unshift(columnName1)
  if (_.isEmpty(columnsNames))
    throw new Error('SpecZen: COLUMNS() called with empty array!')
  else return new ColumnsCmd({ columnsNames })
}

export type TAnyObject_ExcludeFilter = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_FILTER_HERE'
>

export type TAnyObject_ExcludeFilterEnd = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_FILTER_STOP_HERE'
>

export type TAnyObject_ExcludeFilterIgnore = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_FILTER_IGNORE_MERGE_MUTE_HERE'
>

export type TAnyObject_ExcludeFilterAbove = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_FILTER_ABOVE_HERE'
>

// See https://stackoverflow.com/questions/61370779/typescript-understanding-union-and-intersection-types
export type TAnyObject_ExcludeAllCommandsButEachCmd_Intersection =
  TAnyObject_ExcludeFilter &
    TAnyObject_ExcludeFilterEnd &
    TAnyObject_ExcludeFilterIgnore &
    TAnyObject_ExcludeFilterAbove &
    TAnyObject_ExcludeColumns &
    TAnyObject_ExcludeCOLUMNS &
    TAnyObject_ExcludeSuiteCmd &
    TAnyObject_ExcludeSUITE &
    TAnyObject_ExcludeEACH // not EACH without call, deliberately everywhere
// TAnyObject_ExcludeEachCmd missing, therefore allowed!

export type TAny_ExcludeAllCommands =
  | TAny_ExcludeObjectAndFunction
  | (TAnyObject_ExcludeAllCommandsButEachCmd_Intersection &
      TAnyObject_ExcludeEachCmd)

export type TAny_ExcludeAllCommandsExceptFilters =
  | TAny_ExcludeObjectAndFunction
  | (TAnyObject_ExcludeColumns &
      TAnyObject_ExcludeCOLUMNS &
      TAnyObject_ExcludeSuiteCmd &
      TAnyObject_ExcludeSUITE &
      TAnyObject_ExcludeEACH &
      // Filters missing, so allowed!
      TAnyObject_ExcludeEachCmd)

export type TSpecBody_ExcludeAllCommandsButEach =
  | TAny_ExcludeObjectAndFunction
  | TAnyObject_ExcludeAllCommandsButEachCmd_Intersection

export type TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore = (
  | TFilter
  | TFilterEnd
  | TFilterIgnore
) & { _YOU_CANT_USE_SUITE_HERE?: never } & {
  _YOU_CANT_USE_EMPTY_SUITE_ANYWHERE?: never
} & {
  _YOU_CANT_USE_COLUMNS_COMMAND_HERE?: never
} & { _YOU_CANT_USE_EMPTY_COLUMNS_COMMAND_ANYWHERE?: never } & {
  _YOU_CANT_USE_EACH_COMMAND_HERE?: never
} & {
  _YOU_CANT_USE_EMPTY_EACH_ROOT_COMMAND_ANYWHERE?: never
} & {
  _YOU_CANT_USE_EMPTY_EACH_NESTED_COMMAND_ANYWHERE?: never
} & {
  _YOU_CANT_USE_FILTER_ABOVE_HERE?: never
}

// UserLand inputs - The arrays user can write

/**
 * What can go into the UserLand Spec array:
 *  - Any value, except EACH command
 *  - The 1st position can contain a Filter or FilterEnd (but no FilterAbove & FilterIgnore
 */
export type TSpec =
  | [
      TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
      ...TSpecBody_ExcludeAllCommandsButEach[],
    ]
  | TSpecBody_ExcludeAllCommandsButEach[]

// What can be in SUIT args, after "graceful" 1st & 2nd args who accept Columns
export type T_SUITEArray_ExcludeColumnsAndEach = (
  | SuiteCmd<any>
  | TSpec
  | TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore
  | TFilterAbove
) & {
  _YOU_CANT_USE_COLUMNS_COMMAND_HERE?: never
} & {
  _YOU_CANT_USE_EMPTY_COLUMNS_COMMAND_ANYWHERE?: never
} & {
  _YOU_CANT_USE_EACH_COMMAND_HERE?: never
} & {
  _YOU_CANT_USE_EMPTY_EACH_ROOT_COMMAND_ANYWHERE?: never
} & {
  _YOU_CANT_USE_EMPTY_SUITE_ANYWHERE?: never
}

// T_SUITEArray: Specs OR Filters following, with optional COLUMNS 1st (or 2nd after a Filter)
export type T_SUITEArray =
  | T_SUITEArray_ExcludeColumnsAndEach[] // or force 1 Spec at least [T_SUITEArray_ExcludeColumnsAndEach, ...T_SUITEArray_ExcludeColumnsAndEach[]]

  // Restrict Columns to optionally be only 1st or 2nd item
  | [ColumnsCmd, ...T_SUITEArray_ExcludeColumnsAndEach[]]

  // as 2nd item for convenience, but only if Filter is before (to SKIP/ONLY easily)
  | [
      TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
      ColumnsCmd,
      ...T_SUITEArray_ExcludeColumnsAndEach[],
    ]

export type USuite = Omit<SuiteCmd<any>, '_YOU_CANT_USE_SUITE_HERE'>

export interface ISuite<TSpecData> {
  /**
   * Target one or more specific specHandlers.
   *
   * Eg {specHandlers: 'readOneEntity'}
   *     or
   *
   * {specHandlers: ['readOneEntity', 'readOneEntityWithAuthDisabled']
   *
   * Your Specs will be executed against the specHandlers specified
   */
  specHandlers?: TSpecHandlersDeclaration<TSpecData>

  title?: string
  fullTitle?: string

  group?: string | string[]
  columnsCmd?: ColumnsCmd
  filter?: Filter
  filterEnd?: FilterEnd
}

export type TSpecDataTransformer<TSpecData extends Record<string, any>> =
  | TSpecData
  | ((specData: TSpecData) => TSpecData)
export type TExpectedResultTransform =
  | Record<string, any>
  | ((resultOrExpected: any) => any)

export interface ExecutableSpec<TSpecData> {
  // meta?: Record<string, any>
  isVisible: boolean
  filter: Filter | FilterEnd | null
  suiteTitle: string
  suiteFullTitle: string
  nestingLevel: number
  testRunner: Record<string, any>
  specData: TSpecData
}

export type TSpecHandlerFunction<TSpecData> = (
  executableSpec: ExecutableSpec<TSpecData>
) => void // @todo: return something printable, like a JSON that can be converted to markdown, or just text

export type TSpecHandlersDeclaration<TSpecData> =
  | string
  | TSpecHandlerFunction<TSpecData>
  | (string | TSpecHandlerFunction<TSpecData>)[]

/**
 * A dummy Suite command, in User Land
 */
export class SuiteCmd<TSpecData> extends Command implements ISuite<TSpecData> {
  public __kind? = 'SuiteCmd'

  public _YOU_CANT_USE_SUITE_HERE?: 'JUST_IGNORE_IT_AS_KEY'

  constructor(suiteObj?: USuite) {
    super(suiteObj)
  }

  suiteArray?: T_SUITEArray
  // From ISuite  - see https://www.typescriptlang.org/docs/handbook/2/classes.html#cautions

  specHandlers?: TSpecHandlersDeclaration<TSpecData>

  specDataTransformer?: TSpecDataTransformer<TSpecData> // @todo(141): Do we need TSpecData here?

  expectedTransform?: TExpectedResultTransform

  resultTransform?: TExpectedResultTransform

  // fullTitle?: string
  title?: string

  group?: string | string[]

  filter: Filter

  filterEnd: FilterEnd

  filterIgnore: FilterIgnore

  columns: string[] // from options - temporary, we only use columnsCmd @todo: remove somehow

  columnsCmd?: ColumnsCmd
}

export class SUITEOptions<TSpecData extends Record<string, any>> {
  /**
   * You need at least one, in the Top level SUITE
   * @see CommandWithMeta.specHandlers
   */
  specHandlers?: TSpecHandlersDeclaration<TSpecData> // string | string[] | TSpecHandlerFunction<TSpecData> | TSpecHandlerFunction<TSpecData>[]

  /**
   * The Spec wants to transform the Spec data, before it is given to specHandler.
   * - If a function, it receives a Spec to transform it
   * - If an object, it acts as the defaults for the Spec data
   *
   * The specHandler can also transform specData before meeting the expectations, so why this extra step? Becuase the specHandler transformation will apply to all SUITEs that use this SpecHandler, whereas specDataTransformer can provide things like defaults and transformations that apply ONLY to the SUITE scope.
   *
   * Inherited specDataTransformers
   *
   * All specDataTransformers from parentSuites, are inherited and merged together in the nested Suites, from the top level SUITE to the bottom level SUITE.
   *
   * For example, assume we are testing a particular featureA in a top level Suite, and featureA & featureB together in a sub suite.
   * Our specData would have {featureA: true} in the top level Suite, and {featureA: true, featureB: true} in the sub suite.
   * With transformers, we can have just
   *
   * SUITE( {title: 'Top Level Suite', specDataTransformer: {featureA: true}}, [
   *   ...
   *   SUITE( {title: 'Sub Suite', specDataTransformer: {featureB: true}}, [
   *    ...
   *   ])
   * ])
   *
   * and your specData in Sub Suite will be deep merged as {featureA: true, featureB: true}, without having to repeat `featureA: true` in the Sub Suite.
   * If you want a fresh value in your current Suite, use a function in that suite instead of an object, and return a fresh value.
   */
  specDataTransformer?: TSpecDataTransformer<TSpecData>

  /**
   * @todo: NOT IMPLEMENTED
   *
   * The Suite wants to Transform the expected value (what user writes in each spec in this SUITE), before it is compared/matched etc in the handler.
   *
   * For example, the Suite can opt to transform the expected value from a string (what the SPEC user writes) to an Error (with the string as msg), because this is what the specHandler deals with.
   *
   * This saves you from having to be verbose and complicated on your Specs, and instead you can just write a something small (eg string), and the Suite will transform it to something more complicated (eg an Error).
   *
   * Transformations are applied similarly to specDataTransformer, from first Top Level suite, down to this Suite
   */
  expectedTransform?: TExpectedResultTransform

  /**
   * @todo: NOT IMPLEMENTED
   *
   * The Suite wants to Transform the result value (whatever your code returns), before it is compared/matched etc in the handler.
   *
   * For example, the Suite can opt to transform the expected value from a string (what the SPEC user writes) to an Error (with the string as msg), because this is what the specHandler deals with.
   *
   * Transformations are applied similarly to specDataTransformer, from first Top Level suite, down to this Suite
   */
  resultTransform?: TExpectedResultTransform

  /**
   * @default to specHandlers name, or the parent's title (with a ^ prefix)
   */
  title?: string

  /**
   * eg {group: 'UserLogin'}
   */
  group?: string | string[]

  columns?: string[]
}

/**
 * SUITE command supports these call signatures:
 * @see relevant https://stackoverflow.com/questions/52132459/overloaded-function-type-in-typescript/52132754#52132754
 */
export type T_SUITE_TypeFunction = {
  (SUITEarray: T_SUITEArray): SuiteCmd<any>

  // Options before SUITEarray
  <TSpecData>(
    options: SUITEOptions<TSpecData>,
    SUITEarray: T_SUITEArray
  ): SuiteCmd<any>

  // Instead of options {}, we can have a string for title 1st, before SUITEarray
  <TSpecData>(title: string, SUITEarray: T_SUITEArray): SuiteCmd<any>

  // Filter 1st: allow a Filter/FilterEnd 1st, and rest pushed one place to the right

  // Before SUITEarray
  <TSpecData>(
    filterOrfilterEnd: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
    SUITEarray: T_SUITEArray
  ): SuiteCmd<any>
  // Before Options
  <TSpecData>(
    filterOrfilterEnd: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
    options: SUITEOptions<TSpecData>,
    SUITEarray: T_SUITEArray
  ): SuiteCmd<any>
  // Before title
  (
    filterOrfilterEnd: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
    title: string,
    SUITEarray: T_SUITEArray
  ): SuiteCmd<any>

  // Filter 2nd: allow a Filter/FilterEnd 2nd, after options or title

  // Before Options
  <TSpecData>(
    options: SUITEOptions<TSpecData>,
    filterOrfilterEnd: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
    SUITEarray: T_SUITEArray
  ): SuiteCmd<any>
  // Before title
  (
    title: string,
    filterOrfilterEnd: TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore,
    SUITEarray: T_SUITEArray
  ): SuiteCmd<any>

  _YOU_CANT_USE_EMPTY_SUITE_ANYWHERE?: 'JUST_IGNORE_IT_AS_KEY'
}
// Internal - search "ObjectWithAnyKeyExceptXxxHack"
export type TAnyObject_ExcludeSuiteCmd = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_SUITE_HERE'
>

export type TAnyObject_ExcludeSUITE = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_EMPTY_SUITE_ANYWHERE'
>

// type TAnyObject_ExcludeSuiteCmd = { [key: string]: any } & {  _YOU_CANT_USE_SUITE_HERE?: never }
/**
 * The SUITE command - create a new Suite instance, in User Land.
 *
 * A suite is a collection of test cases, Filters and other Suite objects that can be infinitely nested.
 * A COLUMNS command can be used only on 1st position, or 2nd position, after a Filter.
 *
 * @todo(385): Use generics? Implement generics Suite<TUserSpecData> or something to pass it over to the Spec https://stackoverflow.com/questions/68524136/how-to-define-a-generic-function-type-in-typescript-two-similar-ways
 *
 * @param SUITEargs
 *
 * @return Suite in Internal Land
 */
export const SUITE: T_SUITE_TypeFunction = <TSpecData>(
  ...SUITEargs: (
    | string
    | TExclusive_Filter_Or_FilterEnd_Or_FilterIgnore
    | SUITEOptions<TSpecData>
    | T_SUITEArray
  )[]
): SuiteCmd<TSpecData> => {
  // Filters, in _SUITEargs[0] only!
  let filter: Filter = null
  let filterEnd: FilterEnd = null
  let filterIgnore: FilterIgnore = null

  let options: SUITEOptions<TSpecData> = {}
  // Options can contain:

  let title: string
  let specHandlers: TSpecHandlersDeclaration<TSpecData> = null
  let group: string | string[]
  let columns: string[] // from options

  const suiteArgs = [...SUITEargs] // clone

  // Grab & rid of any Filters/FilterEnds in SUITEargs

  // Filter 1st
  // if (isFilter(suiteArgs[0]))
  //   filter = legitFilter(suiteArgs.shift()) as Filter
  // else if (isFilterEnd(suiteArgs[0]))
  //   filterEnd = legitFilterEnd(suiteArgs.shift()) as FilterEnd
  // else if (isFilterIgnore(suiteArgs[0]))
  //   filterIgnore = legitFilterIgnore(suiteArgs.shift()) as FilterIgnore
  // else if (isFilterAbove(suiteArgs[0]))
  //   throw new Error(`SpecZen: FilterAbove commands like ONLY_ABOVE() are not allowed in SUITE(...args), but only in SUITE array, ie. SUITE([ ['spec'], ...,  ONLY_ABOVE(), ....  ])`)

  // reuse the above, allowing filter to be either at 0 or at 1 index
  _.each([0, 1], (idx) => {
    if (isFilter(suiteArgs[idx]))
      filter = legitFilter(suiteArgs.splice(idx, 1)[0]) as Filter
    else if (isFilterEnd(suiteArgs[idx]))
      filterEnd = legitFilterEnd(suiteArgs.splice(idx, 1)[0]) as FilterEnd
    else if (isFilterIgnore(suiteArgs[idx]))
      filterIgnore = legitFilterIgnore(
        suiteArgs.splice(idx, 1)[0]
      ) as FilterIgnore
    else if (isFilterAbove(suiteArgs[idx]))
      throw new Error(
        `SpecZen: FilterAbove commands like ONLY_ABOVE() are not allowed in SUITE(...args), but only in SUITE array, ie. SUITE([ ['spec'], ...,  ONLY_ABOVE(), ....  ])`
      )
  })

  let suiteArray: T_SUITEArray
  let finalSpecHandlers: (string | TSpecHandlerFunction<TSpecData>)[] = null

  // If 1st suiteArg is array, after having removed any filters, its the SUITEarray
  if (_.isArray(suiteArgs[0])) suiteArray = suiteArgs[0] as T_SUITEArray
  // nothing else follows
  else {
    if (_.isString(suiteArgs[0])) {
      // We have a string, it's title
      title = suiteArgs[0]
      // No options if we used string, just suiteArray
      suiteArray = suiteArgs[1] as T_SUITEArray
    } else if (_z.isRealObject(suiteArgs[0])) {
      options = suiteArgs[0] as SUITEOptions<TSpecData>
      suiteArray = suiteArgs[1] as T_SUITEArray
      ;({ specHandlers, title, group, columns } = options)
    } else {
      // we dealt with Filters as 1st arg, so what's left?
      throw new Error(
        `SpecZen: SUITE() called with invalid args: ${objectToString(
          SUITEargs
        )}`
      )
    }
  }

  if (specHandlers) {
    // ? _z.arrayize(specHandlers) : null
    if (_.isString(specHandlers))
      finalSpecHandlers = specHandlers.split('|').map((s) => s.trim())
    else if (_.isFunction(specHandlers)) finalSpecHandlers = [specHandlers]
    else if (_.isArray(specHandlers)) {
      // validate array!
      _.each(specHandlers, (specHandler, i) => {
        if (_.isString(specHandler)) return
        if (_.isFunction(specHandler)) return
        throw new Error(
          `SpecZen: SUITE() called with invalid specHandlers[${i}]: ${objectToString(
            specHandler
          )}`
        )
      })

      finalSpecHandlers = specHandlers as any[]
    } else {
      throw new TypeError(
        `SpecZen: SUITE() called with invalid specHandlers: ${objectToString(
          specHandlers
        )}`
      )
    }

    title ||= finalSpecHandlers
      ? finalSpecHandlers
          .map((fsh) => {
            if (_.isString(fsh)) return fsh
            if (_.isFunction(fsh)) return fsh.name

            throw new TypeError(
              `SpecZen: SUITE() called with invalid specHandlers: ${objectToString(
                specHandlers
              )}`
            )
          })
          .join('|')
      : null
  }

  // Finished with SUITEargs - we have options & suiteArray

  // Get & rid any possible legit ColumnsCmd, if any
  let columnsCmd: ColumnsCmd = null
  if (suiteArray[0] instanceof ColumnsCmd)
    columnsCmd = suiteArray.shift() as ColumnsCmd
  else {
    if (
      suiteArray[1] instanceof ColumnsCmd &&
      (isFilter(suiteArray[0]) ||
        isFilterEnd(suiteArray[0]) ||
        isFilterIgnore(suiteArray[0]))
    ) {
      columnsCmd = suiteArray[1] as ColumnsCmd
      suiteArray.splice(1, 1)
    }
  }

  // Note: No sanity checks / throws here, eg
  //  - if there's any COLUMNS in wrong place OR both options.columns & COLUMNS in same SUITE,
  //  - or if no COLUMNS at all (because we might inherit from parent Suite also).
  // Instead, we let Suite take care of it.
  // Reason is the `new Columns()` takes place in the SpecZen DSL, and it will break,
  // for nested Suites that have no columns at all, which is fine for nested Suites that inherit.

  return new SuiteCmd({
    specHandlers: finalSpecHandlers,
    specDataTransformer: options.specDataTransformer,
    expectedTransform: options.expectedTransform,
    resultTransform: options.resultTransform,
    title,
    columns,
    filter,
    filterEnd,
    filterIgnore,
    group,
    columnsCmd,
    suiteArray,
  })
}

// Other commands

/** EACH */

export type UEach = Omit<EachCmd, '_YOU_CANT_USE_EACH_COMMAND_HERE'>

export class EachCmd extends Command {
  public __kind? = 'EachCmd'

  public _YOU_CANT_USE_EACH_COMMAND_HERE?: 'JUST_IGNORE_IT_AS_KEY'

  constructor(eachObj?: UEach) {
    super(eachObj)

    if (_.isEmpty(this.eachArguments))
      throw new TypeError('SpecZen: EachCmd called with no eachArguments')
  }

  eachArguments: TAny_ExcludeAllCommands[]

  toString() {
    return 'EACH(' + this.eachArguments.join(', ') + ') '
  }
}

// Internal - search "ObjectWithAnyKeyExceptXxxHack"
export type TAnyObject_ExcludeEachCmd = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_EACH_COMMAND_HERE'
>

export type TAnyObject_ExcludeEACH = ExcludeByKey<
  { [key: string]: any },
  '_YOU_CANT_USE_EMPTY_EACH_NESTED_COMMAND_ANYWHERE'
>

/**
 * Eg [1, EACH([2], [22], [222]), 3]
 *  => [1,2,3],
 *     [1,22,3],
 *     [1,222,3]
 *
 * @todo(232): NOT applied, we can't have both T_EACH_AtSpecRoot_TypeFunction & T_EACH_Nested_TypeFunction
 */
export type T_EACH_AtSpecRoot_TypeFunction = {
  (
    eachArg1:
      | TFilter
      | TFilterEnd
      | TFilterIgnore
      | TAny_ExcludeAllCommandsExceptFilters[],
    ...eachArguments: (
      | TFilter
      | TFilterEnd
      | TFilterIgnore
      | TAny_ExcludeAllCommandsExceptFilters[]
    )[]
  ): EachCmd
  _YOU_CANT_USE_EMPTY_EACH_ROOT_COMMAND_ANYWHERE?: 'JUST_IGNORE_IT_AS_KEY'
}

/**
 * Eg [1, {a: EACH([2], [22], [222])}, 3]
 *  => [1, { a: 2 }, 3],
 *     [1, { a: 22 }, 3],
 *     [1, { a: 222 }, 3]
 */
export type T_EACH_Nested_TypeFunction = {
  (
    eachArg1:
      | TFilter
      | TFilterEnd
      | TFilterIgnore
      | TAny_ExcludeAllCommandsExceptFilters,
    ...eachArguments: (
      | TFilter
      | TFilterEnd
      | TFilterIgnore
      | TAny_ExcludeAllCommandsExceptFilters
    )[]
  ): EachCmd
  _YOU_CANT_USE_EMPTY_EACH_NESTED_COMMAND_ANYWHERE?: 'JUST_IGNORE_IT_AS_KEY'
}

// @todo: Document we allow Onlies & Skipies inside EACHes, to selectively run only a subset of the EACH generated Specs!
export const EACH: T_EACH_Nested_TypeFunction = (
  // @todo(232): T_EACH_AtSpecRoot_TypeFunction
  ...eachArguments: any[] // TAny_ExcludeAllCommandsExceptFilters[][] | TAny_ExcludeAllCommandsExceptFilters[]
): EachCmd => {
  if (_.isEmpty(eachArguments))
    throw new Error('SpecZen: EACH() called with empty array!')
  else return new EachCmd({ eachArguments })
}
