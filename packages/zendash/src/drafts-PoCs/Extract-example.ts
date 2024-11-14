declare function uniqueId(): number
const ID = Symbol('ID')

interface SimplePerson {
  [ID]: number
  name: string
  age: number
}

// Allows change of person data as long as the property key is of string type.
function changePersonData<
  Obj extends SimplePerson,
  Key extends Extract<keyof SimplePerson, string>,
  Value extends Obj[Key],
>(obj: Obj, key: Key, value: Value): void {
  obj[key] = value
}

// Tiny Andrew was born.
const andrew = {
  [ID]: uniqueId(),
  name: 'Andrew',
  age: 0,
}

// Cool, we're fine with that.
changePersonData(andrew, 'name', 'Andrea')

// Goverment didn't like the fact that you wanted to change your identity.
// @ts-expect-error
changePersonData(andrew, ID, uniqueId())
