// TypeScript static validation with error messages https://catchts.com/email-validation

type Email = `${string}@${string}.${string}`
type AllowedChars =
  | '='
  | '+'
  | '-'
  | '.'
  | '!'
  | '#'
  | '$'
  | '%'
  | '&'
  | "'"
  | '*'
  | '/'
  | '?'
  | '^'
  | '_'
  | '`'
  | '{'
  | '|'
  | '}'
  | '~'

type Sign = '@'

type IsLetter<Char extends string> = Lowercase<Char> extends Uppercase<Char> ? false : true
{
  type _ = IsLetter<'!'> // false
  type __ = IsLetter<'a'> // true
}

type IsAllowedSpecialChar<Char extends string> = Char extends AllowedChars ? true : false

type FirstState = 'FirstState'
type SecondState = 'SecondState'
type ThirdState = 'ThirdState'

type Strategy<Char extends string, State extends FirstState | SecondState | ThirdState> = {
  FirstState: IsLetter<Char> extends true
    ? true
    : IsAllowedSpecialChar<Char> extends true
      ? true
      : Char extends `${number}`
        ? true
        : false
  SecondState: IsLetter<Char> extends true ? true : false
  ThirdState: IsLetter<Char> extends true ? true : Char extends '.' ? true : false
}[State]

type Validate<
  Str extends string,
  Cache extends string = '',
  State extends string = FirstState,
  PrevChar extends string = '',
> = Str extends ''
  ? Cache extends Email
    ? IsLetter<PrevChar> extends true
      ? Cache
      : 'Last character should be valid letter'
    : 'Email format is wrong'
  : Str extends `${infer Char}${infer Rest}`
    ? State extends FirstState
      ? Strategy<Char, State> extends true
        ? Validate<Rest, `${Cache}${Char}`, State, Char>
        : Char extends Sign
          ? Cache extends ''
            ? "Symbol [@] can't appear at the beginning"
            : Validate<Rest, `${Cache}${Char}`, SecondState, Char>
          : `You are using disallowed char [${Char}] before [@] symbol`
      : State extends SecondState
        ? Char extends Sign
          ? 'You are not allowed to use more than two [@] symbols'
          : Strategy<Char, State> extends true
            ? Validate<Rest, `${Cache}${Char}`, State, Char>
            : Char extends '.'
              ? PrevChar extends Sign
                ? 'Please provide valid domain name'
                : Validate<Rest, `${Cache}${Char}`, ThirdState, Char>
              : `You are using disallowed char [${Char}] after symbol [@] and before dot [.]`
        : State extends ThirdState
          ? Strategy<Char, State> extends true
            ? Validate<Rest, `${Cache}${Char}`, State, Char>
            : `You are using disallowed char [${Char}] in domain name]`
          : never
    : never

type Ok = Validate<'+++@gmail.com'>

type _ = Validate<'gmail.com'> // "Email format is wrong"
type __ = Validate<'.com'> // "Email format is wrong"
type ___ = Validate<'hello@a.'> // "Last character should be valid letter"
type ____ = Validate<'hello@a'> // "Email format is wrong"
type _____ = Validate<'1@a'> // "Email format is wrong"
type ______ = Validate<'+@@a.com'> // "You are not allowed to use more than two [@] symbols"
type _______ = Validate<'john.doe@_.com'> // "You are using disallowed char [_] after symbol [@] and before dot [.]"
type ________ = Validate<'john.doe.com'> // "Email format is wrong"
type _________ = Validate<'john.doe@.com'> // "Please provide valid domain name"
type __________ = Validate<'john.doe@.+'> // "Please provide valid domain name"
type ___________ = Validate<'-----@a.+'> // "You are using disallowed char [+] in domain name]"
type ____________ = Validate<'@hello.com'> // "Symbol [@] can't appear at the beginning"

function validateEmail<Str extends string>(
  email: Str extends Validate<Str> ? Str : Validate<Str>
) {
  return email
}

// @ts-expect-error OK
const result = validateEmail('@hello.com') // error
