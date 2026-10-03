import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ESLint } from 'eslint';

test('requires returned values while allowing void and polymorphic this', async () => {
  const lines = [
    'declare function value(): number;',
    'declare function effect(): void;',
    'declare function asyncValue(): Promise<number>;',
    'declare function asyncEffect(): Promise<void>;',
    'declare function consume(value: number): void;',
    'declare function overloaded(value: string): void;',
    'declare function overloaded(value: number): number;',
    'declare class Builder { chain(): this; asyncChain(): Promise<this>; copy(): Builder; }',
    'declare const builder: Builder;',
    'value();',
    'void value();',
    'await asyncValue();',
    'asyncValue();',
    'builder.copy();',
    'overloaded(1);',
    'true && value();',
    'true ? value() : effect();',
    '(value(), effect());',
    'for (value(); false; value()) {}',
    'effect();',
    'asyncEffect();',
    'await asyncEffect();',
    'builder.chain();',
    'builder.asyncChain();',
    'await builder.asyncChain();',
    'overloaded(`text`);',
    'const assigned = value();',
    'consume(value());',
    'consume(await asyncValue());',
    'if (value()) effect();',
    'builder.copy().chain();',
    'export function forwarded() { return value(); }',
    'export {};',
  ];
  const [result] = await new ESLint().lintText(lines.join('\n'), {
    filePath: 'src/core/text/graphemes.ts',
  });
  assert.equal(result.errorCount, 0);
  const warnings = result.messages.filter(
    (message) => message.ruleId === 'local/require-used-return-value',
  );
  assert.deepEqual(
    warnings.map((message) => message.line),
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19],
  );
  assert(warnings.every((message) => message.severity === 1));
});
