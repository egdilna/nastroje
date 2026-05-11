# TIN — Target Instruction Notation


(přeloženo z anglické specifikace)

**Verze:** 1.0
**Stav:** Návrh
**Schéma:** `tin-schema.json` (JSON Schema draft 2020-12)

## Co je TIN?

TIN (Target Instruction Notation) je JSON formát pro popis toho, co má AI model pro danou roli nebo úkol dělat a co naopak dělat nemá. V jednom souboru sdružuje:

- **Co model dělat má** (pokyny, pravidla)
- **Co model dělat nemá** (zákazy, oblasti mimo záběr)
- **S jakými materiály má pracovat** a jak má každý z nich chápat
- **Jak má vypadat výstup**
- **Metadata** (identita, verze, jazyk, účel)
- **Odkazy na související TINy** pro kompozici

TIN je navržen tak, aby byl:

- **Jednoduchý** — minimum povinné struktury, vše volitelné je skutečně volitelné
- **Jazykově neutrální v obsahu** — jeden TIN je v jednom jazyce; překlady jsou samostatné TINy
- **Anglický ve schématu** — klíče, hodnoty enumů a názvy typů jsou anglicky bez ohledu na jazyk obsahu
- **Rozšiřitelný** — volný objekt `extensions` pokryje cokoli, co není v základním schématu

## Struktura nejvyšší úrovně

```
{
  "tin": "1.0",
  "metadata": { ... },
  "context": { ... },        // volitelné
  "sections": [ ... ],
  "files": [ ... ],          // volitelné
  "output": { ... },         // volitelné
  "related": [ ... ],        // volitelné
  "extensions": { ... }      // volitelné
}
```

Povinná pole: `tin`, `metadata`, `sections`.

## Pole

### `tin` (povinné)

Verze TIN formátu, kterému tento dokument odpovídá. Aktuálně `"1.0"`.

### `metadata` (povinné)

Identifikace a popisné informace o TINu samotném.

| Pole | Povinné | Popis |
|---|---|---|
| `id` | ano | Stabilní identifikátor. Doporučeno reverse-DNS (`cz.egdilna.nsesss-auditor`) nebo UUID. |
| `name` | ano | Krátký lidsky čitelný název. |
| `lang` | ano | Jazyk obsahu (ISO 639-1, např. `cs`, `en`, `en-US`). |
| `version` | ano | Semver obsahu TINu (např. `1.0.0`). |
| `description` | ne | Jednořádkové shrnutí. |
| `purpose` | ne | Delší vysvětlení, proč TIN existuje a kdy ho použít. |
| `type` | ne | Druh TINu. Doporučené hodnoty: `role`, `task`, `guideline`, `workflow`, `evaluation`. Vlastní hodnoty povoleny. |
| `created` | ne | ISO 8601 datum nebo datum-čas. |
| `modified` | ne | ISO 8601 datum nebo datum-čas. |
| `author` | ne | Jméno, e-mail nebo organizace. |
| `tags` | ne | Pole stringů pro kategorizaci. |
| `license` | ne | Doporučen SPDX identifikátor (např. `CC-BY-4.0`). |

### `context` (volitelné)

Popisuje celkový kontext, ve kterém TIN platí. Užitečné pro nastavení očekávání ještě před tím, než se model dostane k jednotlivým pravidlům.

| Pole | Popis |
|---|---|
| `scope` | Na co se TIN vztahuje. |
| `assumptions` | Co se předpokládá o uživateli, prostředí nebo vstupech. |
| `out_of_scope` | Co výslovně NENÍ pokryto. |

### `sections` (povinné)

Uspořádaný seznam instrukčních sekcí. Každá sekce má:

| Pole | Povinné | Popis |
|---|---|---|
| `id` | ano | Identifikátor unikátní v rámci TINu. |
| `title` | ano | Krátký název sekce. |
| `instructions` | * | Seznam instrukcí (viz níže). |
| `areas` | * | Vnořené pod-sekce, stejný tvar jako Section (rekurzivně). |

\* Musí být přítomné aspoň jedno z `instructions`, `areas`, nebo obojí.

#### Instrukce

Každá instrukce má `type` a `text`:

| `type` | Význam |
|---|---|
| `do` | Model toto MUSÍ dělat. |
| `dont` | Model toto NESMÍ dělat. |
| `note` | Kontext, poznámka nebo upřesnění — ani příkaz, ani zákaz. |

`text` může obsahovat Markdown; aplikace ho mohou vykreslit nebo předat modelu beze změny.

### `files` (volitelné)

Odkazované materiály, které má model konzultovat. Každý soubor má:

| Pole | Povinné | Popis |
|---|---|---|
| `id` | ano | Identifikátor unikátní v rámci TINu. |
| `uri` | ano | Relativní cesta nebo absolutní URL. |
| `understand` | ano | Jak souboru rozumět — co to je a jakou má autoritu. |
| `use` | ano | Co ze souboru vzít a jak ho použít. |
| `ignore` | ne | Co v souboru ignorovat nebo přeskočit. |
| `scope` | ne | Volný textový popis relevantní části (např. „Kapitola 3", „Řádky 40–120"). |

### `output` (volitelné)

Popisuje očekávaný výstup.

| Pole | Popis |
|---|---|
| `description` | Volný textový popis toho, jak má výstup vypadat. |
| `language` | MIME-like specifikátor: `text/czech`, `code/javascript`, `application/json`, `text/markdown` atd. |

### `related` (volitelné)

Pole identifikátorů TINů, se kterými tento TIN souvisí. Prostý seznam ID; druh vztahu se neukládá — pokud je potřeba, popiš ho v `context` nebo v instrukci.

### `extensions` (volitelné)

Volný objekt pro doménově specifická pole. Aplikace MUSÍ ignorovat neznámé klíče zde. Konvence: prefixuj vlastní klíče `x-` (např. `x-nazev-organizace-pole`).

## Návrhové principy

1. **Jeden TIN, jeden jazyk.** Překlady jsou samostatné TINy se stejným vzorem `id`, ale jiným `lang`.
2. **Anglické schéma, lokalizovaný obsah.** Tvar je anglicky; obsah uvnitř řetězců je v jazyce deklarovaném v `metadata.lang`.
3. **Markdown se detekuje automaticky.** Neuvádí se formát obsahu — modely Markdown rozpoznají samy.
4. **Plocho kde to jde, vnořeno kde je třeba.** `sections` jsou výchozí ploché; `areas` poskytují volitelnou rekurzi.
5. **Kompozice přes `related`, ne dědičnost.** TIN nemá dědičnost; udržuj každý TIN jako samostatný celek a přes `related` na sebe TINy pouze odkazují.

## Validace

TIN soubor validuj proti `tin-schema.json` libovolným validátorem JSON Schema draft 2020-12. Příklad v Pythonu:

```python
import json
from jsonschema import Draft202012Validator

with open('tin-schema.json') as f:
    schema = json.load(f)
with open('muj-tin.json') as f:
    tin = json.load(f)

Draft202012Validator(schema).validate(tin)
```

## Příklad

Kompletní TIN popisující roli asistenta pro audit NSESSS najdeš v `tin-example.json`.

## Verzování

- Pole `tin` v dokumentu sleduje verzi TIN formátu.
- `metadata.version` sleduje verzi obsahu TINu (semver).
- Nekompatibilní změny formátu zvyšují hlavní verzi (`2.0`); zpětně kompatibilní rozšíření zvyšují vedlejší verzi (`1.1`).
