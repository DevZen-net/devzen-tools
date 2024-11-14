import {
  ValidationError,
  // eslint-disable-next-line import/named
  // ValidationArguments,
} from 'class-validator'

export interface ValidZenValidationError extends Omit<Partial<ValidationError>, 'children'> {
  validationArgumentsConstraints?: any[] // ValidationArguments.constraints
  children?: Partial<ValidZenValidationError>[]
}
