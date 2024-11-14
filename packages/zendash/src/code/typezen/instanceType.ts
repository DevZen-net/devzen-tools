import { classType } from './classes'
import { isInstance } from './isInstance'

export type InstanceTypeNames = 'systemInstance' | 'userInstance'

export const INSTANCE_TYPE_NAMES: InstanceTypeNames[] = ['systemInstance', 'userInstance']

/**
 * Given an instance, it returns the class type: 'systemClass' | 'userClass'
 *
 * @param value
 */
export const instanceType = (value: InstanceType<any>): InstanceTypeNames | undefined => {
  const theClassType = classType(value?.constructor)
  switch (theClassType) {
    case 'systemClass': {
      return 'systemInstance'
    }
    case 'userClass': {
      return 'userInstance'
    }

    default: {
      return isInstance(value) ? 'systemInstance' : undefined
    }
  }
}
