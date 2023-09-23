export function isNil(value: any): value is null {
  return value === null
}

export function isUndefined(value: any): value is undefined {
  return typeof value === "undefined"
}

type Empty = null | undefined

export function isEmpty(value: any): value is Empty {
  return isNil(value) || isUndefined(value)
}

export function hasProperty<T>(value: any, propertyName: string): value is T {
  return propertyName in value
}

export enum RiStorageKey {
  loggedUserId = "loggedUserId"
}
