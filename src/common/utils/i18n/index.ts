import type Polyglot from 'node-polyglot'

export type t = Polyglot['t']

export { default as createT } from './create-t'
export { default as getLangCodeAttributes } from './get-lang-code-attributes'
export { default as normalizeLangCode } from './normalize-lang-code'
