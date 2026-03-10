import { Visitor, parseSync } from 'oxc-parser'
import MagicString from 'magic-string'

import type { Plugin } from 'rolldown'

function extractPropsIndexesAndMergeProp(
  file: string,
  code: string
): {
  propsIndexes: number[]
  mergePropsIndexes: number[]
} {
  const result = parseSync(file, code)
  const propsIndexes: number[] = []
  const mergePropsIndexes: number[] = []

  const visitor = new Visitor({
    Property(node) {
      if (node.key.type === 'Identifier' && node.key.name === 'props') {
        if (propsIndexes.length) {
          return
        }
        propsIndexes.push(node.start, node.end)
      }
    },
    ImportDeclaration(node) {
      for (const specifier of node.specifiers) {
        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          specifier.imported.name === 'mergeDefaults'
        ) {
          mergePropsIndexes.push(specifier.start, specifier.end + 1)
        }
      }
    },
  })
  visitor.visit(result.program)

  return {
    propsIndexes,
    mergePropsIndexes,
  }
}

function extractImportPropsStatements(
  file: string,
  code: string,
  name: string
): { start: number; end: number }[] {
  const result = parseSync(file, code)
  const importPropsStatements: { start: number; end: number }[] = []

  const visitor = new Visitor({
    ImportDeclaration(node) {
      for (const specifier of node.specifiers) {
        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          specifier.imported.name === name
        ) {
          importPropsStatements.push({ start: node.start, end: node.end + 1 })
        }
      }
    },
  })
  visitor.visit(result.program)

  return importPropsStatements
}

function extractDefinePropsWithDefaults(
  file: string,
  code: string
): { start: number; end: number }[] {
  const result = parseSync(file, code)
  const definePropsWithDefaults: { start: number; end: number }[] = []

  const visitor = new Visitor({
    CallExpression(node) {
      if (
        node.callee.type === 'Identifier' &&
        node.callee.name === 'withDefaults'
      ) {
        definePropsWithDefaults.push({ start: node.start, end: node.end })
      }
    },
  })
  visitor.visit(result.program)

  return definePropsWithDefaults
}

export function SupplyValidator(): Plugin {
  return {
    name: 'supply-validator-plugin',
    transform: {
      filter: {
        id: /\.(js|ts|vue)$/,
      },
      handler(code, id) {
        if (!id.includes('packages')) {
          return null
        }

        const s = new MagicString(code)
        const { propsIndexes, mergePropsIndexes } =
          extractPropsIndexesAndMergeProp(id, code)

        if (propsIndexes.length === 2) {
          const importPropsStatements = extractImportPropsStatements(
            id,
            code,
            'props'
          )
          for (const { start, end } of importPropsStatements) {
            s.remove(start, end)
          }

          const definePropsWithDefaults = extractDefinePropsWithDefaults(
            id,
            code
          )
          for (const { start, end } of definePropsWithDefaults) {
            s.overwrite(start, end, 'defineProps')
          }

          const [propsStart, propsEnd] = propsIndexes
          s.overwrite(propsStart, propsEnd, `/* removed props */`)

          const importMergePropsStatements = extractImportPropsStatements(
            id,
            code,
            'mergeDefaults'
          )
          for (const { start, end } of importMergePropsStatements) {
            s.remove(start, end)
          }

          if (mergePropsIndexes.length === 2) {
            const [mergeStart, mergeEnd] = mergePropsIndexes
            s.remove(mergeStart, mergeEnd)
          }

          return {
            code: s.toString(),
            map: s.generateMap({ source: id, includeContent: true }),
          }
        }

        return null
      },
    },
  }
}
