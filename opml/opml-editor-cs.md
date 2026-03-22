# Hierarchický OPML Editor

Výkonný webový editor pro tvorbu hierarchických seznamů, úkolů a projektů ve formátu OPML. Ideální pro outlining, GTD, plánování projektů a organizaci myšlenek.

**[Otevřít editor online](https://mrt.site44.com/opml-editor.html)** | [Stáhnout pro offline použití](https://mrt.site44.com/opml-editor.html)

> Editor je jeden HTML soubor bez závislostí. Stáhněte si ho a provozujte lokálně nebo na vlastním serveru.

---

## Proč tento editor?

- **Neomezená hierarchie** – Vnořujte položky do libovolné hloubky
- **OPML formát** – Standardní formát kompatibilní s mnoha aplikacemi
- **Projektové řízení** – Sledování termínů, procent dokončení a Ganttův diagram
- **Žádná registrace** – Vše běží lokálně, data zůstávají u vás
- **Plně přístupný** – Navrženo pro odečítače obrazovky a klávesnici

---

## Základní ovládání

### Práce s položkami

- **➕ Přidat položku** – Vytvoří novou položku na nejvyšší úrovni
- U každé položky můžete:
  - ☑️ Označit jako dokončenou (checkbox)
  - Přidat poznámky (víceřádkový text)
  - Vytvořit podpoložky
  - Přesunout nahoru/dolů nebo změnit úroveň

### Dva režimy zobrazení

- **Režim úprav** – Kompaktní zobrazení s inline editací
- **Režim prohlížení** – Přehledné zobrazení s vizuálními indikátory změn

### Ukládání

- **Uložit OPML** – Stáhne soubor (moderní prohlížeče otevřou dialog pro výběr umístění)
- **Kopírovat URL** – Vytvoří odkaz obsahující celý dokument
- **Kopírovat jako Markdown** – Pro vložení do jiných nástrojů

---

## Pokročilé funkce

### 📊 Projektové řízení

Přidejte do poznámek položky projektové atributy:

```
Type: Projekt
Status: In Progress
Start: 2025-01-01
End: 2025-03-31
Completion: 45
```

Editor automaticky:
- Zobrazí projektovou tabulku s přehledem podúkolů
- Vypočítá procento dokončení z podpoložek
- Určí nejdřívější Start a nejpozdější End z potomků
- Zobrazí zbývající čas do termínu
- Varuje před překročením termínu 🚨

### 📈 Ganttův diagram

U položek s projektovými daty se zobrazí tlačítko **📊**. Kliknutím otevřete interaktivní Ganttův diagram:

- Časová osa s dny a měsíci
- Barevné pruhy podle stavu (nezahájeno / probíhá / dokončeno / po termínu)
- Zobrazení procenta dokončení
- Zvýraznění dnešního dne
- Plně přístupné pro odečítače obrazovky

### 🧹 Smazat dokončené

U položek s dokončenými podpoložkami se zobrazí tlačítko **🧹**, které jedním kliknutím odstraní všechny dokončené potomky.

### 📥 Import OPML do sekce

Tlačítko **📥** umožňuje importovat jiný OPML soubor jako podstrom vybrané položky. Ideální pro:
- Vkládání šablon (meeting notes, projektová struktura)
- Kombinování více dokumentů
- Opakované použití struktur

### 📋 Kopírovat do schránky

Tlačítko **📋** zkopíruje název položky a její poznámky do schránky.

### 🎯 Zaměření (Hoist)

Klikněte na **🎯** pro zobrazení pouze vybrané větve. Breadcrumb navigace umožňuje rychlý návrat nebo přechod na nadřazené položky.

### 🔍 Vyhledávání a filtrování

- **Fulltextové vyhledávání** – Prohledává názvy i poznámky
- **Skrýt dokončené** – Zobrazí pouze nedokončené položky
- **Filtrování podle tagů** – Tagy v poznámkách jako `#urgent` nebo `#waiting`
- **Abecední řazení tagů** – Snadná orientace ve velkém počtu tagů

### 📊 Statistiky

V toolbaru vidíte aktuální statistiky:
- Celkový počet položek
- Počet dokončených
- Procento dokončení

---

## Přístupnost

Editor je plně přístupný:

- **Klávesová navigace** – Všechny akce bez myši
- **ARIA atributy** – Sémantické značení pro odečítače obrazovky
- **Vysoký kontrast** – WCAG 2.1 AA kompatibilní barvy
- **Viditelný focus** – Jasně zvýrazněný aktivní prvek
- **Ganttův diagram** – ARIA role a popisky, čitelný screen readery
- **Modální okna** – Správná správa focusu a Escape pro zavření

---

## Formát OPML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Můj dokument</title>
  </head>
  <body>
    <outline text="Položka 1" _checked="false">
      <_note>Poznámky k položce</_note>
      <outline text="Podpoložka" _checked="true"/>
    </outline>
  </body>
</opml>
```

Soubory jsou kompatibilní s OmniOutliner, Dynalist, WorkFlowy a dalšími OPML editory.

---

## Tipy a triky

### Projektové šablony

Vytvořte si OPML soubory s typickými strukturami:
- Meeting notes (účastníci, agenda, poznámky, akční body)
- Sprint planning (backlog, in progress, review, done)
- Týdenní přehled (pondělí–pátek, cíle, reflexe)

Poté je importujte pomocí 📥 kamkoliv potřebujete.

### WBS číslování

Položky automaticky dostávají WBS čísla (1, 1.1, 1.1.1...) pro snadné reference v projektové dokumentaci.

### Rychlé značení dokončení

V režimu prohlížení stačí kliknout na checkbox pro označení položky jako dokončené – není třeba otevírat editor.

---

## Offline použití

Editor funguje zcela offline:

1. Stáhněte HTML soubor
2. Otevřete v prohlížeči
3. Pracujte bez připojení k internetu
4. Ukládejte lokálně na disk

Žádná data se neposílají na server.
