// eslint-disable-next-line @typescript-eslint/naming-convention
export function is_constructor(f: any) {
  try {
    Reflect.construct(String, [], f)
  } catch (e) {
    return false
  }

  return true
}
