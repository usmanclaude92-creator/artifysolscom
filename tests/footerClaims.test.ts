import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(process.cwd(), 'src/components/Footer.tsx'), 'utf8');

describe('footer makes no unverifiable claims', () => {
  it.each(['SOC2', '99.99', 'Production SLA', 'SYSTEM TELEMETRY', 'Nodes: Active'])('does not contain "%s"', (needle) => {
    expect(src).not.toContain(needle);
  });
});
