// POHLED ÚKOLY — tlačítko „⏰ Termín".
//
// Používá stejný dialog jako přeplánování v Připomenutích, včetně zadání
// termínu slovy (parseNaturalDate — tentýž parser jako v Kalendáři).
// Hlídá se i to, co dřív chybělo: návrat fokusu po překreslení a že „Vymazat"
// se nabízí jen tam, kde je co mazat.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, atribut, uzavri } from './lib.mjs';

const s = novySoucet('Úkoly — termín');
const { prohlizec, stranka } = await otevriAplikaci(s);

async function priprav() {
  await stranka.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
  await nasypej(stranka, [
    { id: 'u1', title: 'Alfa ukol', aspects: ['Task'], attributes: { status: 'todo', deadline: '2026-01-10' } },
    { id: 'u2', title: 'Beta ukol', aspects: ['Task'], attributes: { status: 'todo', deadline: '2026-02-20' } },
    { id: 'u3', title: 'Gama bez terminu', aspects: ['Task'], attributes: { status: 'todo' } }
  ]);
  await stranka.evaluate(() => setView('tasks'));
  await stranka.waitForTimeout(500);
}

const termin = (id) => atribut(stranka, id, 'deadline');
const dialogOtevren = () => stranka.evaluate(() => !!(document.getElementById('dialog-datum') || {}).open);
const fokus = () => stranka.evaluate(() => {
  const a = document.activeElement;
  return a ? (a.tagName + (a.dataset && a.dataset.taskReschedule ? '#' + a.dataset.taskReschedule : '') + (a.id ? '@' + a.id : '')) : null;
});
const otevriUkol = async (id) => {
  await stranka.click('button[data-task-reschedule="' + id + '"]');
  await stranka.waitForTimeout(450);
};

nadpis('Tlačítko otevře společný dialog');
await priprav();
await otevriUkol('u1');
ok(s, await dialogOtevren(), 'dialog s datem se otevřel');
const info = await stranka.evaluate(() => ({
  titulek: document.getElementById('dialog-datum-title').textContent,
  popis: document.getElementById('dialog-datum-popis').textContent,
  datum: document.getElementById('dialog-datum-input').value,
  maText: !!document.getElementById('dialog-datum-text'),
  vymazatVidet: !document.getElementById('datum-vymazat').hidden,
  fokus: document.activeElement.id
}));
ok(s, info.maText, 'má pole pro termín slovy', info);
ok(s, info.datum === '2026-01-10', 'předvyplní stávající termín', info);
ok(s, /Alfa ukol/.test(info.popis), 'a říká, o který úkol jde', info);
ok(s, info.fokus === 'dialog-datum-text', 'fokus je v poli pro termín slovy', info);
ok(s, info.vymazatVidet, 'u úkolu s termínem se nabízí Vymazat', info);

nadpis('Zadání slovy');
await stranka.fill('#dialog-datum-text', 'za 2 týdny');
await stranka.waitForTimeout(350);
const poSlovech = await stranka.evaluate(() => ({
  datum: document.getElementById('dialog-datum-input').value,
  nahled: document.getElementById('dialog-datum-nahled').textContent
}));
ok(s, /^\d{4}-\d{2}-\d{2}$/.test(poSlovech.datum), '„za 2 týdny" se vyhodnotí na datum', poSlovech);
ok(s, poSlovech.nahled.startsWith('→'), 'a je vidět náhled', poSlovech);
await stranka.click('#datum-ok');
await stranka.waitForTimeout(700);
ok(s, (await termin('u1')) === poSlovech.datum, 'termín se uložil', await termin('u1'));
ok(s, !(await dialogOtevren()), 'dialog se zavřel');
ok(s, (await fokus()) === 'BUTTON#u1', 'fokus se vrátil na tlačítko téhož úkolu', await fokus());

nadpis('Úkol bez termínu');
await priprav();
await otevriUkol('u3');
const bezTerminu = await stranka.evaluate(() => ({
  popis: document.getElementById('dialog-datum-popis').textContent,
  datum: document.getElementById('dialog-datum-input').value,
  vymazatVidet: !document.getElementById('datum-vymazat').hidden
}));
ok(s, /bez termínu/.test(bezTerminu.popis), 'dialog to řekne', bezTerminu);
ok(s, bezTerminu.datum === '', 'pole s datem je prázdné', bezTerminu);
ok(s, !bezTerminu.vymazatVidet, 'a Vymazat se nenabízí, není co mazat', bezTerminu);
await stranka.fill('#dialog-datum-text', 'zítra');
await stranka.waitForTimeout(300);
await stranka.press('#dialog-datum-text', 'Enter');
await stranka.waitForTimeout(700);
ok(s, /^\d{4}-\d{2}-\d{2}$/.test((await termin('u3')) || ''), 'Enter přidá termín i úkolu, který žádný neměl', await termin('u3'));

nadpis('Vymazat termín');
await priprav();
await otevriUkol('u2');
await stranka.click('#datum-vymazat');
await stranka.waitForTimeout(700);
ok(s, !(await termin('u2')), 'termín je pryč', await termin('u2'));
ok(s, (await termin('u1')) === '2026-01-10', 'a ostatní úkoly zůstaly', await termin('u1'));
ok(s, (await fokus()) !== 'BODY', 'fokus nespadl na stránku', await fokus());

nadpis('Zrušení a Esc nic nezmění');
await priprav();
await otevriUkol('u1');
await stranka.fill('#dialog-datum-text', 'za rok');
await stranka.waitForTimeout(300);
await stranka.click('#datum-cancel');
await stranka.waitForTimeout(500);
ok(s, (await termin('u1')) === '2026-01-10', 'Zrušit termín nezmění', await termin('u1'));
ok(s, (await fokus()) === 'BUTTON#u1', 'a fokus je zpátky na tlačítku', await fokus());

await otevriUkol('u1');
await stranka.fill('#dialog-datum-text', 'zítra');
await stranka.waitForTimeout(300);
await stranka.keyboard.press('Escape');
await stranka.waitForTimeout(500);
ok(s, (await termin('u1')) === '2026-01-10', 'Esc taky nic nezmění', await termin('u1'));
ok(s, !(await dialogOtevren()), 'a dialog je zavřený');

nadpis('Nesrozumitelný text');
await priprav();
await otevriUkol('u1');
await stranka.fill('#dialog-datum-text', 'někdy potom');
await stranka.waitForTimeout(300);
await stranka.click('#datum-ok');
await stranka.waitForTimeout(500);
ok(s, (await termin('u1')) === '2026-01-10', 'nesrozumitelný text termín nezmění', await termin('u1'));
ok(s, await dialogOtevren(), 'dialog zůstane otevřený, ať jde text opravit');
ok(s, /nerozumím/i.test(await stranka.evaluate(() => document.getElementById('alert-region').textContent)),
  'a odečítač se dozví proč');

nadpis('Datum z kalendáře funguje i bez textu');
await priprav();
await otevriUkol('u1');
await stranka.evaluate(() => {
  const i = document.getElementById('dialog-datum-input');
  i.value = '2026-08-08'; i.dispatchEvent(new Event('input', { bubbles: true }));
});
await stranka.click('#datum-ok');
await stranka.waitForTimeout(700);
ok(s, (await termin('u1')) === '2026-08-08', 'samotné pole s datem pořád funguje', await termin('u1'));

await prohlizec.close();
process.exit(uzavri(s));
