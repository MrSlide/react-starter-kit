import fs from 'fs'
import { promisify } from 'util'
import originalGlob from 'glob'

const glob = promisify(originalGlob)

export const stat = promisify(fs.stat)
export const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)

export async function find (path: string, pattern = '*'): Promise<string[]> {
  return await (glob(pattern, {
    cwd: path,
    dot: false,
    matchBase: false,
    nocase: true,
    nonull: false,
    strict: true
  }) as Promise<string[]>)
}
