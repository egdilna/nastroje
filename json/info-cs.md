# Vizuální JSON Editor

Intuitivní webový editor pro prohlížení a úpravu JSON dat bez nutnosti psát závorky a uvozovky. Ideální pro práci s konfiguračními soubory, API odpověďmi a datovými strukturami.

**[Otevřít editor online](https://mrt.site44.com/json-editor.html)** | [Stáhnout pro offline použití](https://mrt.site44.com/json-editor.html)

> Editor je jeden HTML soubor. Stáhněte si ho a používejte offline pro práci s citlivými daty.

---

## Proč tento editor?

- **Vizuální úpravy** – Žádné ruční psaní JSON syntaxe
- **Stromová struktura** – Přehledná navigace ve složitých datech
- **Validace** – Automatická kontrola datových typů
- **Žádná instalace** – Funguje přímo v prohlížeči
- **Plně přístupný** – Podpora odečítačů obrazovky

---

## Základní ovládání

### Načítání dat

- **Načíst soubor** – Importuje .json soubor z disku
- **Vložit JSON** – Vloží JSON z clipboardu
- **Načíst z URL** – Komprimovaná data v URL (pro sdílení)

### Práce s hodnotami

Editor rozpoznává a správně zobrazuje všechny JSON typy:

| Typ | Zobrazení | Příklad |
|-----|-----------|---------|
| Object | 📁 složka | `{"key": "value"}` |
| Array | 📋 seznam | `[1, 2, 3]` |
| String | 📝 text | `"hello"` |
| Number | 🔢 číslo | `42`, `3.14` |
| Boolean | ✓/✗ | `true`, `false` |
| Null | ∅ prázdné | `null` |

### Úprava hodnot

1. Klikněte na hodnotu pro její úpravu
2. Změňte typ pomocí dropdown menu
3. Upravte hodnotu v příslušném poli
4. Klikněte mimo pro uložení

### Přidávání a mazání

- **➕** u objektu – Přidá nový klíč
- **➕** u pole – Přidá novou položku
- **🗑️** – Smaže položku

---

## Pokročilé funkce

### 🔄 Změna datových typů

U každé hodnoty můžete změnit její typ. Editor automaticky převede:
- String → Number (pokud je to číslo)
- Cokoliv → Array (zabalí do pole)
- Cokoliv → Object (vytvoří objekt s klíčem "value")

### 📑 Sbalování

Klikněte na šipku u objektů a polí pro sbalení/rozbalení. Sbalená větev zobrazuje náhled obsahu.

### 🔍 Přehledná navigace

- Objekty zobrazují počet klíčů: `{3 keys}`
- Pole zobrazují počet položek: `[5 items]`
- Hluboce vnořené struktury mají vizuální odsazení

### 📋 Kopírování

- **Kopírovat JSON** – Zkopíruje celý dokument do schránky
- **Kopírovat URL** – Vytvoří sdílitelný odkaz s daty

### 🔗 Propojení s dalšími editory

V toolbaru najdete odkazy pro otevření dat v:
- OPML editoru (pro hierarchická data)
- Markdown editoru (pro textový obsah)

---

## Přístupnost

Editor je navržen pro všechny uživatele:

- **Klávesová navigace** – Tab pro pohyb mezi prvky
- **ARIA atributy** – Správné role pro strom a položky
- **Vysoký kontrast** – Čitelné barvy splňující WCAG 2.1 AA
- **Viditelný focus** – Jasně označený aktivní prvek
- **Popisky** – Všechna tlačítka mají textové alternativy

---

## Formát

Editor pracuje se standardním JSON:

```json
{
  "name": "Projekt",
  "version": 1.0,
  "active": true,
  "tags": ["web", "tool"],
  "config": {
    "theme": "dark",
    "language": "cs"
  }
}
```

Výstup je validní JSON formátovaný s odsazením pro čitelnost.

---

## Tipy

### Práce s velkými soubory

1. Sbalte nepotřebné větve pro lepší přehled
2. Použijte prohlížeč (Ctrl+F) pro hledání v renderovaném obsahu

### Validace před uložením

Editor automaticky validuje:
- Čísla musí být platná čísla
- Boolean může být jen true/false
- Klíče objektů musí být unikátní

### Bezpečnost

Editor běží kompletně v prohlížeči. Vaše JSON data:
- Se neposílají na žádný server
- Zůstávají ve vaší paměti
- Lze bezpečně použít pro citlivé konfigurace

---

## Offline použití

1. Stáhněte HTML soubor editoru
2. Otevřete lokálně v prohlížeči
3. Pracujte s JSON soubory bez internetu
4. Ukládejte výsledky na disk

Ideální pro práci s konfiguračními soubory na zabezpečených systémech.
