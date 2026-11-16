// Režim editace sekcí (klávesa D) patří k panelu: po přepnutí na jiný panel
// a zpět musí být zase zapnutý — a nesmí se přenést do panelu, kde zapnutý nebyl.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const s = novySoucet('panely-rezim-sekci');
const { prohlizec, stranka } = await otevriAplikaci(s);
await nasypej(stranka, [
  { id: 'a', title: 'Entita A', aspects: ['Note'], body: '# Nadpis\n\n- položka\n' },
  { id: 'b', title: 'Entita B', aspects: ['Note'], body: 'Text B' },
]);
await otevriDetail(stranka, 'a');

nadpis('Zapnutí klávesou D a přepnutí panelů');
await stranka.evaluate(() => document.body.focus());
await stranka.keyboard.press('d');
await stranka.waitForTimeout(400);
ok(s, await stranka.evaluate(() => state.sectionEditMode === true), 'D zapne editaci sekcí');

await stranka.evaluate(() => openEntityInNewPanel('b'));
await stranka.waitForTimeout(400);
ok(s, await stranka.evaluate(() => state.detailId === 'b' && !state.sectionEditMode),
  'nový panel s jinou entitou režim nemá');

// V druhém panelu se pracuje — přechod na jiný pohled režim (správně) vypne.
await stranka.evaluate(() => setView('all'));
await stranka.waitForTimeout(300);
await stranka.evaluate(() => setView('detail', { detailId: 'b' }));
await stranka.waitForTimeout(300);
await stranka.evaluate(() => switchToPanel(0));
await stranka.waitForTimeout(400);
const zpet = await stranka.evaluate(() => ({ id: state.detailId, rezim: state.sectionEditMode,
  tl: (document.getElementById('btn-toggle-sec-edit') || {}).getAttribute?.('aria-pressed') }));
ok(s, zpet.id === 'a' && zpet.rezim === true, 'po návratu na panel je režim zase zapnutý', zpet);
ok(s, zpet.tl === 'true', 'tlačítko režimu ukazuje zapnuto', zpet);

await stranka.evaluate(() => switchToPanel(1));
await stranka.waitForTimeout(400);
ok(s, await stranka.evaluate(() => state.detailId === 'b' && !state.sectionEditMode),
  'do druhého panelu se režim nepřenesl');

nadpis('Vypnutí se pamatuje taky');
await stranka.evaluate(() => switchToPanel(0));
await stranka.waitForTimeout(300);
await stranka.evaluate(() => document.body.focus());
await stranka.keyboard.press('d');
await stranka.waitForTimeout(300);
await stranka.evaluate(() => switchToPanel(1));
await stranka.waitForTimeout(300);
await stranka.evaluate(() => switchToPanel(0));
await stranka.waitForTimeout(300);
ok(s, await stranka.evaluate(() => state.sectionEditMode === false), 'vypnutý režim zůstane vypnutý');

await prohlizec.close();
uzavri(s);
