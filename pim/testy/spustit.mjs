// Spustí všechny testové sady a shrne výsledek.
//   node pim/testy/spustit.mjs            … všechno
//   node pim/testy/spustit.mjs integrita  … jen sady, jejichž název obsahuje „integrita"
//
// Sada je úspěšná, když skončí nulovým kódem A nevypíše ✗ / SELHALO / pageerror.
// Druhá podmínka je schválně: přenesené starší sady exit kód vždycky nenastavují
// a tiché selhání je přesně to, čemu se tady snažíme zabránit.
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ZDE = path.dirname(fileURLToPath(import.meta.url));
const filtr = process.argv[2] || '';

const sady = readdirSync(ZDE)
  .filter(f => f.endsWith('.mjs') && f !== 'lib.mjs' && f !== 'spustit.mjs')
  .filter(f => !filtr || f.includes(filtr))
  .sort();

if (sady.length === 0) { console.log('Žádná sada neodpovídá filtru „' + filtr + '".'); process.exit(1); }

function spust(soubor) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [path.join(ZDE, soubor)], { cwd: ZDE });
    let vystup = '';
    p.stdout.on('data', d => { vystup += d; });
    p.stderr.on('data', d => { vystup += d; });
    p.on('close', kod => {
      const proslo = (vystup.match(/✓/g) || []).length;
      const selhalo = (vystup.match(/✗|SELHALO/g) || []).length;
      const chybyStranky = (vystup.match(/pageerror|PAGEERROR/g) || []).length;
      resolve({ soubor, kod, proslo, selhalo, chybyStranky, vystup });
    });
  });
}

console.log('Testy PIM — ' + sady.length + ' sad\n');
const vysledky = [];
for (const s of sady) {
  process.stdout.write('  ' + s.padEnd(28));
  const v = await spust(s);
  vysledky.push(v);
  const vPoradku = v.kod === 0 && v.selhalo === 0 && v.chybyStranky === 0;
  console.log((vPoradku ? 'OK  ' : 'CHYBA') + '  ' + v.proslo + ' kontrol' +
    (v.selhalo ? ', ' + v.selhalo + ' selhalo' : '') +
    (v.chybyStranky ? ', ' + v.chybyStranky + ' chyb stránky' : '') +
    (v.kod !== 0 && !v.selhalo ? ', exit ' + v.kod : ''));
}

const spatne = vysledky.filter(v => v.kod !== 0 || v.selhalo > 0 || v.chybyStranky > 0);
console.log('\n' + '='.repeat(64));
const celkem = vysledky.reduce((a, v) => a + v.proslo, 0);
console.log('Celkem ' + celkem + ' kontrol v ' + sady.length + ' sadách; ' +
  (spatne.length === 0 ? 'všechny sady prošly.' : spatne.length + ' sad selhalo.'));
if (spatne.length) {
  spatne.forEach(v => {
    console.log('\n--- ' + v.soubor + ' ---');
    v.vystup.split('\n').filter(r => /✗|SELHALO|pageerror|PAGEERROR|Error/.test(r)).slice(0, 12)
      .forEach(r => console.log(r));
  });
}
console.log('='.repeat(64));
process.exit(spatne.length ? 1 : 0);
