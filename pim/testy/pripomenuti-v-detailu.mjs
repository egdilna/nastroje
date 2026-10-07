// Připomenutí přímo z detailu entity: tlačítko v liště otevře společný dialog
// na datum (včetně zadání slovy), a když už je připomenutí nastavené, jde ho
// odtamtud i zrušit.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, atribut, uzavri } from './lib.mjs';

const soucet = novySoucet('Připomenutí v detailu entity');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const zitra = await stranka.evaluate(() => {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
});

const priprav = (remind) => nasypej(stranka, [
  { id: 'e1', title: 'Entita', aspects: ['Note'], attributes: remind ? { reminder_at: remind } : {} },
  { id: 'kanarek', title: 'Kanarek', aspects: ['Note'], attributes: { reminder_at: '2030-01-01' } }
]).then(() => otevriDetail(stranka, 'e1'));

const tlacitka = () => stranka.evaluate(() => ({
  hlavni: (document.getElementById('btn-reminder') || {}).textContent || null,
  zrusit: !!document.getElementById('btn-reminder-clear')
}));

nadpis('Tlačítko v liště podle stavu');
await priprav(null);
let t = await tlacitka();
ok(soucet, t.hlavni && /Připomenutí/.test(t.hlavni), 'bez připomenutí je tlačítko „🔔 Připomenutí"', t);
ok(soucet, t.zrusit === false, 'a tlačítko na zrušení tam není', t);

await priprav('2026-12-24');
t = await tlacitka();
ok(soucet, t.hlavni && /24/.test(t.hlavni), 's nastaveným připomenutím ukazuje tlačítko to datum', t);
ok(soucet, t.zrusit === true, 'a přibylo tlačítko na zrušení', t);

nadpis('Nastavení termínu slovy');
await priprav(null);
const nastaveno = await stranka.evaluate(async () => {
  document.getElementById('btn-reminder').click();
  await new Promise(z => setTimeout(z, 300));
  const txt = document.getElementById('dialog-datum-text');
  if (!txt) return { chyba: 'dialog na datum se neotevřel' };
  txt.value = 'zítra';
  txt.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(z => setTimeout(z, 300));
  const nahled = document.getElementById('dialog-datum-nahled');
  const vDialogu = document.getElementById('dialog-datum-input').value;
  document.getElementById('datum-ok').click();
  await new Promise(z => setTimeout(z, 500));
  return { nahled: nahled ? nahled.textContent : null, vDialogu: vDialogu };
});
if (nastaveno.chyba) ok(soucet, false, nastaveno.chyba);
else {
  ok(soucet, nastaveno.vDialogu === zitra, '„zítra" se vyhodnotí na zítřejší datum', nastaveno);
  ok(soucet, (await atribut(stranka, 'e1', 'reminder_at')) === zitra,
    'a uloží se do připomenutí entity', await atribut(stranka, 'e1', 'reminder_at'));
}
ok(soucet, (await atribut(stranka, 'kanarek', 'reminder_at')) === '2030-01-01',
  'jiné entitě se připomenutí nezměnilo (kanárek)');

nadpis('Změna už nastaveného připomenutí');
await priprav('2026-12-24');
await stranka.evaluate(async () => {
  document.getElementById('btn-reminder').click();
  await new Promise(z => setTimeout(z, 300));
  const inp = document.getElementById('dialog-datum-input');
  inp.value = '2027-03-15';
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById('datum-ok').click();
  await new Promise(z => setTimeout(z, 500));
});
ok(soucet, (await atribut(stranka, 'e1', 'reminder_at')) === '2027-03-15',
  'dialog předvyplní stávající datum a změní ho', await atribut(stranka, 'e1', 'reminder_at'));

nadpis('Zrušení z dialogu');
await priprav('2026-12-24');
const zDialogu = await stranka.evaluate(async () => {
  document.getElementById('btn-reminder').click();
  await new Promise(z => setTimeout(z, 300));
  const vym = document.getElementById('datum-vymazat');
  if (!vym || vym.hidden) return { chyba: 'tlačítko Vymazat v dialogu není vidět' };
  vym.click();
  await new Promise(z => setTimeout(z, 500));
  return { ok: true };
});
ok(soucet, !zDialogu.chyba, 'dialog nabízí Vymazat, když je datum nastavené', zDialogu.chyba);
ok(soucet, (await atribut(stranka, 'e1', 'reminder_at')) === undefined,
  'a připomenutí se opravdu zrušilo', await atribut(stranka, 'e1', 'reminder_at'));

nadpis('Zrušení rovnou z lišty detailu');
await priprav('2026-12-24');
await stranka.evaluate(async () => {
  document.getElementById('btn-reminder-clear').click();
  await new Promise(z => setTimeout(z, 500));
});
ok(soucet, (await atribut(stranka, 'e1', 'reminder_at')) === undefined,
  'tlačítko 🔕 Zrušit odstraní připomenutí bez otevírání dialogu');
const poZruseni = await tlacitka();
ok(soucet, poZruseni.zrusit === false, 'a tlačítko na zrušení zmizí', poZruseni);
ok(soucet, (await atribut(stranka, 'kanarek', 'reminder_at')) === '2030-01-01',
  'jiné entitě se nic nezměnilo (kanárek)');

nadpis('Dialog bez nastaveného data Vymazat nenabízí');
await priprav(null);
const bezData = await stranka.evaluate(async () => {
  document.getElementById('btn-reminder').click();
  await new Promise(z => setTimeout(z, 300));
  // Dialog tlačítko nemaže z DOM, jen ho skrývá.
  const vym = document.getElementById('datum-vymazat');
  const je = !!vym && !vym.hidden;
  document.getElementById('datum-cancel').click();
  await new Promise(z => setTimeout(z, 200));
  return je;
});
ok(soucet, bezData === false, 'bez data není co mazat, tlačítko se nenabízí');
ok(soucet, (await atribut(stranka, 'e1', 'reminder_at')) === undefined,
  'a po zrušení dialogu se nic nenastavilo');

nadpis('Příkaz v paletě');
await priprav('2026-12-24');
const paleta = await stranka.evaluate(() =>
  paletaSestavPrikazy().filter(p => p.id === 'pripomenuti-entity').map(p => p.label));
ok(soucet, paleta.length === 1 && /24/.test(paleta[0]),
  'paleta nabízí připomenutí i s aktuálním datem', paleta);

await prohlizec.close();
process.exit(uzavri(soucet));
