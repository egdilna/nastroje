# Changelog

Všechny podstatné změny nástroje **Šanony** (designový správce souborů nad repozitářem na GitHubu)
jsou zaznamenány v tomto souboru.

Formát vychází z [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/)
a nástroj se drží [sémantického verzování](https://semver.org/lang/cs/).

## [1.1.4] - 2026-08-23

### Změněno

- Titulek okna prohlížeče nyní ukazuje, kde se uživatel v archivu nachází, ve tvaru
  `místo · nadřazené místo · název archivu`. Dosud se zobrazoval jen název archivu,
  takže se otevřené záložky nedaly od sebe rozeznat.
  - kartotéka: `Právo · Můj archiv`
  - šanon: `Nájmy · Právo · Můj archiv` (police se neuvádí, protože nemá vlastní obrazovku)
  - desky: `Byty · Nájmy · Můj archiv`
  - soubor: `smlouva.pdf · Nájmy · Můj archiv` (u souboru se uvádí šanon i tehdy,
    když soubor leží v deskách)
  - hledání a nastavení: `Hledání · Můj archiv`, `Nastavení · Můj archiv`
  - úvodní přehled kartoték ponechává samotný název archivu
- Označení offline kopie zůstává zachováno na konci titulku:
  `Byty · Nájmy · Můj archiv (offline kopie)`.

[1.1.4]: https://github.com/egdilna/nastroje/tree/main/sanony
