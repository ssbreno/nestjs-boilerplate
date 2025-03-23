import { ValidationError } from 'class-validator'

/**
 * Converts a string to snake_case format
 * @param string The input string to convert
 * @returns The snake_case formatted string, or empty string if input is undefined/null
 */
function toSnakeCase(string?: string): string {
  if (!string) return ''

  const matches = string.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)

  return matches ? matches.map(x => x.toLowerCase()).join('_') : ''
}

/**
 *
 * Extract the stringified error code
 *
 * @param exception - exception response
 * @returns - string that describes the error
 */
export function getErrorCode(exception: ExceptionResponse | string): string {
  if (typeof exception === 'string') {
    return formatErrorCode(exception)
  }

  if ('error' in exception && typeof exception.error === 'string') {
    return formatErrorCode(exception.error)
  }

  return ''
}

/**
 * Extract the error messages.
 *
 * @param exception
 */
export function getErrorMessage(exception: ExceptionResponse | string): string | Array<string> {
  if (typeof exception === 'string') {
    return exception
  }

  const exceptionObj = exception

  if (typeof exceptionObj?.message === 'string') {
    return exceptionObj.message
  }

  // Check if the message is an array of strings
  if (
    Array.isArray(exceptionObj?.message) &&
    exceptionObj.message.every(msg => typeof msg === 'string')
  ) {
    return exceptionObj.message
  }

  // Handle case where message is an array
  if (Array.isArray(exceptionObj?.message)) {
    const firstError = exceptionObj.message[0]

    if (typeof firstError === 'string') {
      return firstError
    }

    // Handle ValidationError objects
    if ('constraints' in firstError || 'children' in firstError) {
      return parseErrorMessage(firstError as ValidationError)
    }
  }

  return 'INTERNAL_SERVER_ERROR'
}

/**
 * Format a string to uppercase and snakeCase.
 *
 * @param error - string
 * @returns - ex `Bad Request` become `BAD_REQUEST`
 */
function formatErrorCode(error: string): string {
  return toSnakeCase(error).toUpperCase()
}

/**
 * Aggregation of error messages for a given ValidationError
 * @param error
 */
function parseErrorMessage(error: ValidationError): string {
  const constraints = findConstraints(error)

  if (!constraints) {
    return 'Invalid parameter'
  }

  // Concatenate all constraint messages
  return Object.values(constraints).join(' -- ')
}

/**
 * Find constraints in an error object.
 *
 * @param error
 */
function findConstraints(error: ValidationError): Constraint | undefined {
  // If there are constraints at this level, return them
  if (error.constraints) {
    return error.constraints
  }

  // If there are children, recursively check them
  if (error.children && error.children.length > 0) {
    for (const child of error.children) {
      const constraints = findConstraints(child)
      if (constraints) {
        return constraints
      }
    }
  }

  return undefined
}

/**
 * Constraints of the validation.
 */
interface Constraint {
  [type: string]: string
}

/**
 * Exception response.
 */
interface ExceptionResponse {
  error?: string
  message?: string | string[] | ValidationError[]
}
