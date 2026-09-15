// Společná výbava testů PIM.
//
// Testy jezdí proti skutečnému pim/index.html v bezhlavém Chromiu. Nic se nemockuje –
// aplikace se načte tak, jak ji dostane uživatel, nasypou se do ní data a klikne se.
// Kontroluje se výsledek v DOM a v db, ne vnitřní implementace.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ZDE = path.dirname(fileURLToPath(import.meta.url));
export const CESTA_APLIKACE = 'file://' + path.resolve(ZDE, '..', 'index.html');

export function novySoucet(nazevSady) {
  return { nazev: nazevSady, proslo: 0, selhalo: 0, chyby: [], selhani: [] };
}

export function ok(soucet, podminka, popis, detail) {
  if (podminka) {
    soucet.proslo++;
    console.log('  ✓ ' + popis);
  } else {
    soucet.selhalo++;
    soucet.selhani.push(popis);
    console.log('  ✗ SELHALO: ' + popis);
    if (detail !== undefined) console.log('      ' + JSON.stringify(detail));
  }
}

export function nadpis(text) { console.log('\n— ' + text); }

// Otevře aplikaci a začne sbírat chyby stránky. Každá nezachycená výjimka je selhání:
// tiché chyby jsou přesně to, co nám uteklo minule.
export async function otevriAplikaci(soucet, opts = {}) {
  const prohlizec = await chromium.launch();
  const stranka = await (await prohlizec.newContext({
    viewport: opts.viewport || { width: 1280, height: 1000 }
  })).newPage();
  stranka.on('pageerror', e => { soucet.chyby.push('pageerror: ' + e.message); });
  stranka.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    // Síť tady stejně není – aplikace je offline jednosouborovka a případné
    // externí zdroje (ikony, fonty) nejsou předmětem testu.
    if (/Failed to load resource|ERR_(TUNNEL|CERT|NAME|INTERNET|CONNECTION)/.test(t)) return;
    soucet.chyby.push('console.error: ' + t.slice(0, 200));
  });
  await stranka.goto(CESTA_APLIKACE);
  await stranka.waitForTimeout(1400);
  return { prohlizec, stranka };
}

// Nasype entity a překreslí. `entity` jsou prosté objekty, doplní se přes newEntity.
export async function nasypej(stranka, entity, dalsi = {}) {
  await stranka.evaluate(({ entity, dalsi }) => {
    db.entities = entity.map(e => newEntity(e));
    if (dalsi.savedViews) db.savedViews = dalsi.savedViews;
    if (dalsi.customAspects) db.customAspects = dalsi.customAspects;
    state.view = 'dashboard';
    state.detailId = null;
    state.detailMode = 'read';
    state.sectionEditMode = false;
    state._secEditIdx = null;
    state.cmReview = null; state.spellCheck = null; state.mdLint = null;
    state.annotationMode = false;
    render();
  }, { entity, dalsi });
  await stranka.waitForTimeout(400);
}

export const telo = (stranka, id) => stranka.evaluate((id) => (findEntity(id) || {}).body, id);
export const atribut = (stranka, id, klic) =>
  stranka.evaluate(({ id, klic }) => ((findEntity(id) || {}).attributes || {})[klic], { id, klic });
export const hodnotaPole = (stranka, sel) =>
  stranka.evaluate((sel) => { const el = document.querySelector(sel); return el ? el.value : null; }, sel);

export async function otevriDetail(stranka, id, rezim = 'read') {
  await stranka.evaluate(({ id, rezim }) => setView('detail', { detailId: id, detailMode: rezim }), { id, rezim });
  await stranka.waitForTimeout(500);
}

export async function zapniEditaciSekci(stranka) {
  await stranka.evaluate(() => { state.sectionEditMode = true; render(); });
  await stranka.waitForTimeout(500);
}

export async function otevriSekci(stranka, id, idx) {
  await stranka.evaluate(({ id, idx }) => openSectionEditor(findEntity(id), idx), { id, idx });
  await stranka.waitForTimeout(400);
}

// Potvrzování je v aplikaci dvojí: nativní window.confirm a vlastní dialog
// #dialog-confirm. Testy musí zvládnout obojí, jinak tiše „proklikají" něco jiného,
// než si myslí.
export async function odpovidejNaPotvrzeni(stranka, prijmout) {
  stranka.removeAllListeners('dialog');
  stranka.on('dialog', d => { prijmout ? d.accept() : d.dismiss(); });
}

// Odklikne vlastní potvrzovací dialog aplikace, pokud je otevřený. Vrací true,
// když se opravdu klikalo – test tak pozná, že se aplikace vůbec zeptala.
export async function odklikniPotvrzeni(stranka, prijmout) {
  await stranka.waitForTimeout(250);
  const kliknuto = await stranka.evaluate((prijmout) => {
    const d = document.getElementById('dialog-confirm');
    if (!d || !d.open) return false;
    document.getElementById(prijmout ? 'confirm-yes' : 'confirm-no').click();
    return true;
  }, prijmout);
  await stranka.waitForTimeout(400);
  return kliknuto;
}

export function uzavri(soucet) {
  console.log('\n' + '='.repeat(60));
  const cistoChyby = soucet.chyby.filter((v, i, a) => a.indexOf(v) === i);
  if (cistoChyby.length) {
    console.log('CHYBY STRÁNKY (' + cistoChyby.length + '):');
    cistoChyby.forEach(c => console.log('  ! ' + c));
  }
  const celkem = soucet.proslo + soucet.selhalo;
  console.log(soucet.nazev + ': ' + soucet.proslo + '/' + celkem + ' prošlo' +
    (soucet.selhalo ? ', ' + soucet.selhalo + ' SELHALO' : '') +
    (cistoChyby.length ? ', ' + cistoChyby.length + ' chyb stránky' : ''));
  if (soucet.selhani.length) soucet.selhani.forEach(s => console.log('  ✗ ' + s));
  console.log('='.repeat(60));
  return (soucet.selhalo === 0 && cistoChyby.length === 0) ? 0 : 1;
}
