export function evaluarExpresion(expresion, variables = {}) {
  try {
    if (typeof expresion !== 'string' || expresion.length > 120) return { ok: false, error: 'EXPRESION_INVALIDA' }
    const tokens = expresion.replaceAll(',', '.').match(/(?:\d+(?:\.\d*)?|\.\d+)|[A-Za-z_][A-Za-z_0-9]*|[()+\-*/^]/g) || []
    if (!tokens.length || tokens.join('') !== expresion.replaceAll(',', '.').replace(/\s/g, '')) return { ok: false, error: 'EXPRESION_INVALIDA' }
    let cursor = 0
    const parseExpression = () => { let value = parseTerm(); while (tokens[cursor] === '+' || tokens[cursor] === '-') { const op = tokens[cursor++]; const right = parseTerm(); value = op === '+' ? value + right : value - right } return value }
    const parseTerm = () => { let value = parsePower(); while (tokens[cursor] === '*' || tokens[cursor] === '/') { const op = tokens[cursor++]; const right = parsePower(); if (op === '/' && right === 0) throw new Error('DIVISION_CERO'); value = op === '*' ? value * right : value / right } return value }
    const parsePower = () => { let value = parseAtom(); if (tokens[cursor] === '^') { cursor += 1; value **= parsePower() } return value }
    const parseAtom = () => {
      const token = tokens[cursor++]
      if (token === '+' || token === '-') return (token === '-' ? -1 : 1) * parseAtom()
      if (token === '(') { const value = parseExpression(); if (tokens[cursor++] !== ')') throw new Error('EXPRESION_INVALIDA'); return value }
      if (token && /^\d/.test(token) || token?.startsWith('.')) return Number(token)
      if (token && Object.hasOwn(variables, token) && Number.isFinite(Number(variables[token]))) return Number(variables[token])
      throw new Error('EXPRESION_INVALIDA')
    }
    const valor = parseExpression()
    if (cursor !== tokens.length || !Number.isFinite(valor)) return { ok: false, error: 'EXPRESION_INVALIDA' }
    return { ok: true, valor }
  } catch (error) { return { ok: false, error: error.message === 'DIVISION_CERO' ? 'DIVISION_CERO' : 'EXPRESION_INVALIDA' } }
}
