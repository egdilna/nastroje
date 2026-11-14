multisection

## Novinky k našim nástrojům

13.11.2026: Máme pro vás bombu. U [[opendata]] prohlížeče jsme dodělali kompletní hledání a filtrování a načítání datových sad z Národního katalogu dat (NKD). Takže teď už nemusíte někde na webu NKD hledat schémata a sady a ručně to kopírovat do prohlížeč.



2.9.2026: Skvělé zprávy pro všechny datysty. Nástroj [DKM manažer](#dkm) pro modelování datových modelů i správu ostrých dat nyní umí validní export dat do json včetně schémat a JSX popisů. Je to kompatibilní s požadavky správy dat pro import. Výsledkem je, že můžete data z DKM exportovat buď jako popis dat, nebo jako datové balíčky v ZIP se schématem a popisem v readme. Na tohle jsme se těšili a je to tady.


28.7.2026: Abyste neřekli, že vám taky nic nedopřeju, pamatujete si na Feather wiki? Malý jednosouborový wiki systém? Tak jsem konečně dodělal český překlad a českou skriptovou mutaci. Najdete to tady na https://nastroje.egdilna.cz/featherwiki ale je to nástroj EGdílny jen tak napůl.


5.7.2026: Teď celý tenhle web spravuju a pushuju přes funkce nástroje PIM, ale to vás asi nezajímá. Co by vás ale zajímat mohlo je nový nástroj Outliner (jak název napovídá je to outliner editor) a dnes jsem vydal novou fakt nabušenou verzi DKM manažeru dat.


2.7.2026: U těch nástrojů, kde to dává smysl (opml, markdown, jsondb a nově plantuml, dkm apod,) lze teď projekty nejen ukládat a načítat ze souborů, ale i přes schránku. Malé ale hrozně užitečné vylepšení.



1.7.2026: Jejej, jaksi jsem sem nedal informaci o nástroji TIN editor, přesto že nástroj samotný existuje. Pardon, napraveno, je v sekci Editory.


28.6.2026: Tak konečně jsou tady funkční tabulky changelogů tedy historie změn a oprav pro jednotlivé nástroje, z toho mám radost. Červen byl i měsícem hodně nových funkcí a mám moc velkou radost i z rozvoje PlantUML editoru, který teď sám už taky vlastně denně používám.

27.6.2026: Jaksi se stalo, že na tomhle mikrowebu se ne vždycky všechno ukazovalo. Velký pardon, je to způsobeno přechodem z původního nástroje na PIM, kde taky jako jeden soubor spravuju tenhle web a include mají jinou syntaxi. Stane se, omlouvám se.

2.6.2026: Web teď konečně funguje i na adrese https://nastroje.egdilna.cz a na této adrese fungují i jednotlivé nástroje.

7.4.2026: Nový nástroj [Správce záložek] - Bookmark je komplexním správcem sady záložek (bookmarků). Data o záložkách v katalogu lze ukládat a načítat buď z lokálního JSON souboru, ale především z GitHubu a GIT repozitáře a to včetně privátních cest. První funkční betaverze publikována v nástrojích a to na adrese https://nastroje.egdilna.cz/bookmark

6.4.2026: Pozor, většina našich nástrojů teď mimo jiných metod pro načítání a ukládání dat <mark>podporuje i plnou itegraci s GIT úložištěm, třeba GitHub přes API</mark>. Pro zápisy budete potřebovat vlastní GitHub API klíč, ale ten zůstane jen ve vašem prohlížeči a nikdy se neukládá ani k nám a ani do příslušného datového souboru.

30.3.2026: Vydali jsme zatím v betaverzi nový a hodně žádaný nástroj a to [[Správce datových katalogů]]. Jak sám název napovídá, umí to spravovat datové katalogy, datové slovníky, konceptuální datové modely, číselníky apod. Bohužel jsem se zatím nedostal k tvorbě dokumentace.

23.3.2026: Už je tady nástrojů fakt docela dost a tak je asi fakt na čase rozběhnout samotný web https://egdilna.github.io/nastroje tak uvidíme.

## Změny a novinky v ArchiMate editoru


| Datum | Typ | Popis |
| --- | --- | --- |
| 20. 4. 2026 | Oprava | Oprava, kdy někdy nefungoval CSV import po exportu do DOCX. |
| 13. 4. 2026 | Vylepšení | Teď se nově v titulku okna prohlížeče objevuje i právě otevřený model, protože řada z vás má otevřených více modelů najednou a je v tom chaos. A taky to znamená, že jde mít otevřených více modelů ve stejné instanci browseru. |
| 12. 4. 2026 | Funkce | Dokumentace k diagramu: Nyní u diagramu můžete vygenerovat DOCX dokument s jeho dokumentací, včetně popisu diagramu a přehledu a popisů vazeb i prvků na něm, samozřejmě i s tím diagramem. Prý je to velice užitečné, tak proč to nepřidat. Zatím ale jde jen pro jeden diagram. |
| 9. 4. 2026 | Vylepšení | V tabulkovém editoru diagramu se nyní nemusejí přidávat jen prvky, ale lze přidávat i vazby (a prvky se samozŕejmě přidají také), což může urychlit tvorbu diagramu. Dále U prvků se v různých zobrazeních nyní zobrazují dvě malá tlačítka "Z" a "DO", kterými si lze zobrazit rychlý popup se seznamem prvků s vazou na tento prvek, což zvýší přehled o vazbách bez nutnosti si filtrovat v celém samostatném zobrazení vazeb. Karta pro export a import a slučování už byla dost nepřehledná, takže teď je rozdělena na jednotlivé taby s jednotlivými funkcemi pro lepší přehlednost. |
| 6. 4. 2026 | Funkce | Nová integrace s GitHubem: Modely ve formátu AJX (soubor i datové objekty) lze nyní mít na repozitáři přes GIT a to zejména na GitHubu. Načítání a ukládání přímo do repozitáře |


## Změny a novinky v DKM


| Datum | Typ | Popis |
| --- | --- | --- |
| 9. 11. 2026 | Funkce | Nové funkce pro český EG. Dva nové atributy a to Ustanovení (zadá se ustanovení a načte se jeho text do aplikace a vypíšou se odkazy) a RPP (zadá se typ a identifikátor objektu a načtou se o něm informace a odkaz na jeho detail v prohlížeči RPP). |
| 2. 9. 2026 | Funkce | Úplný export do schématického JSON. Po průvodci exportem se vytvoří datový json a json schéma soubor a vše se podá jako kompletně zdokumentovaný ZIP valíček i s detailním popisem v readme.md. Export je kompatibilní se standardy JSX a JSONscheme a validní i pro otevřená a dynamická data a splňuje i požadavky na popis dat pro import. |
| 3. 7. 2026 | Funkce | Konečně máme pokročilé a dynamické filtry. Nově jsou v pohledech možnosti přidávat a měnit pokročilé filtry, které jsou chytré jak podle typu atributu, tak i podle jejich kombinací (to si musíte vyzkoušet). A navíc se dá vymazlený filtr uložit jako nový pohled, což přináší ohromné možnosti filtrace a hledání přes celý projekt. |
| 3. 7. 2026 | Funkce | Další dnešní novinka a to je export a tisk entity jako dokumentu. Můźete si vybrat, co chcete, aby tam bylo a nebylo a export je buď do Markdown, do HTML a nebo do DOCX. |
| 2. 7. 2026 | Funkce | Nová možnost pracovat s daty projektu přes schránku. Nová tlačítka pro načtení ze schránky (CTRL+SHIFT+O) a uložit do schránky (CTRL+SHIFT+S). |
| 29. 6. 2026 | Vylepšení | Nyní v editaci typu entity či v editaci aspektu u každého atributu je zaškrtávací pole, které udává, zda bude daný atribut vidět hned ve výpisu entit. Takže teď kvůli nejdůležitějším hodnotám nemusíte každou entitu otevírat. |
| 8. 6. 2026 | Funkce | Zcela nová komplexní funkce a to přenos entit mezi jednotlivými projekty. V Nastavení / Projekt je k dispozici export balíčku (.dkmpackage) a import, který je realizovánm detailním průvodcem, takže se při migraci i mezi různými datovýmio modely nic neztratí. |



## Změny a novinky v RPP prohlížeči


| Datum | Typ | Popis |
| --- | --- | --- |
| (žádný záznam) | | |


## Změny a novinky v Opendata prohlížeči


| Datum | Typ | Popis |
| --- | --- | --- |
| 19. 4. 2026 | Funkce | Po načtení lze vytvořit statický URL odkaz, kterým se rovnou načtou data připravené datové sady. Tímhle se z toho stává opravdu univerzální prohlížeč, kterým lze rovnou přes odkaz zobrazit jakoukoliv datovou sadu otevřených dat. |
| 18. 4. 2026 | Vylepšení | Nyní načítá datové sady ve formátech JSON, JSONLD, JSONTABLE a CSV, TSV. |


## Změny a novinky v PlantUML editoru


| Datum | Typ | Popis |
| --- | --- | --- |
| 5. 8. 2026 | Funkce | U diagramů lze nyní v detailu diagramu zkrývat určité prvky, halíčky a vazby. Diagram má tak vlastně dvě verze, všechno a jen nezkryté. Přepíná se to právě na kartě Diagram, funguje i pro vykreslování a výpisy textové dokumentace diagramu. |
| 3. 8. 2026 | Oprava | Oprava chyby, kdy se někdy při složitém diagramu s více úrovněmi entit třeba u class diagramu špatně kódovalo URL. Syntax byla správná, chyba je jen v kódu pro plantuml.com, teď náhled a veškeré vykreslení funguje správně. |
| 2. 7. 2026 | Funkce | Nová možnost pracovat s daty projektu přes schránku. Nová tlačítka pro načtení ze schránky (CTRL+SHIFT+O) a uložit do schránky (CTRL+SHIFT+S). |
| 28. 6. 2026 | Vylepšení | U gantt diagramů se teď může nechat pole začátku projektu prázdné a tedy nebudou vykreslena absolutní data |
| 28. 6. 2026 | Oprava | Opraven problém, kdy se někdy nesprávně nevyfiltrovaly jen hotové či nehotové prvky v seznamu prvků diagramu v levé části |
| 9. 4. 2026 | Vylepšení | Možnost u packages srovnat prvky i vertikálně a více možností layoutu vykreslování, aby výstupem nebyly nevzhledné široké nudle. |
| 9. 4. 2026 | Funkce | Nové typy diagramů a to mindmap a WBS |


## Změny a novinky v PIM



| Datum | Typ | Popis |
| --- | --- | --- |
| 4. 11. 2026 | Funkce | Přílohy v balíčcích: offline prohlížeč i přenos entit mezi PIMy se stáhnou jako ZIP se soubory příloh (attachments/<id>/<název>); opakovaný import nic nezdvojí. Opraveno tiché vynechávání příloh v ZIP záloze a pád prohlížeče na zabezpečené entitě. |
| 30. 10. 2026 | Vylepšení | Přílohu jde přidat rovnou z režimu čtení — tlačítko v sekci Přílohy a příkaz v paletě; z pohledu čtení se rovnou uloží a naplánuje nahrání na GitHub. |
| 29. 10. 2026 | Vylepšení | Plán: v tabulce WBS přibylo tlačítko příznaku před názvem úkolu a select stavu; příznak v úkolu plánu vidí i pohled Příznaky. |
| 27. 10. 2026 | Oprava | Wiki odkaz ve výstupu je tučný název a za ním aspekty kurzívou v závorce — stejně v Markdownu, formátované kopii, tisku i Wordu. |
| 27. 10. 2026 | Oprava | Zvuky přepnuty na plnou hlasitost; export a kopie už neobsahují interní odkazy. |
| 27. 10. 2026 | Vylepšení | Začátek a konec nahrávání na GitHub znějí odlišně; průběh nahrávání se odečítačem nepředčítá. |
| 27. 10. 2026 | Vylepšení | Úspěšné uložení na GitHub dostalo vlastní zvuk, odlišený od začátku nahrávání. |
| 27. 10. 2026 | Vylepšení | Změna provedená během nahrávání se neztratí; Alt+M (i Alt+Shift+M) spustí sloučení s GitHubem. |
| 27. 10. 2026 | Funkce | Dva lidé na jednom souboru: cizí změny se slučují místo přepsání, střety jdou do pruhu. Autosave zkrácen z 15 na 4 sekundy. |
| 26. 10. 2026 | Funkce | Include srovnává úrovně nadpisů podle místa vložení — na obrazovce i při rozbalení do Markdownu. |
| 26. 10. 2026 | Vylepšení | Dialog Vybrat entitu hledá i podle organizace osoby a stavu úkolu, ne jen podle názvu. |
| 16. 10. 2026 | Vylepšení | Rychlé zakládání: z řádku se odřízne značka seznamu a Enter odesílá i na softwarové klávesnici telefonu. |
| 16. 10. 2026 | Funkce | Víc řádků v názvu = víc položek, ve všech pěti formulářích rychlého zakládání. |
| 16. 10. 2026 | Vylepšení | Tabulka entit: tlačítko ↗ otevřít v novém panelu hned za názvem entity. |
| 16. 10. 2026 | Vylepšení | Panel úkolu nad atributy se stavem, termínem (i prázdným) a přeplánováním slovy. |
| 13. 10. 2026 | Funkce | Rychlá úprava aspektů klávesou K a filtr „jen bez v hlavičce sloupce tagové matice. |
| 11. 10. 2026 | Funkce | Rychlá úprava tagů entity: klávesa L, tlačítko v liště a seznam se zaškrtávátky místo textového pole. |
| 8. 10. 2026 | Vylepšení | Datum z názvu se doplní na všech cestách, kudy entita vzniká. |
| 8. 10. 2026 | Funkce | Termín a čas z názvu funguje i u + Nová entita; parser rozumí „do pátku, „za týden i názvům měsíců. |
| 8. 10. 2026 | Oprava | Samostatné okno entity si bere data od okna, které ho otevřelo, místo stahování z GitHubu. |
| 7. 8. 2026 | Vylepšení | Přidáno víc než 20 klávesových zkratek pro funkce v editoru textu. Od prostého formátování až po ovládání critic revizí apod. Sem to nebudu celé vypisovat, podívejte se do aktualizované nápovědy v aplikaci. |
| 3. 8. 2026 | Vylepšení | I v detailu pokud je někde vazba na prvek, lze jej nyní otevŕít jedním kliknutím v novém panelu, takže neztratíte kontext. A taky přidána maličkost při editaci, u vazeb je nyní možno rovnou rychle vazbu editovat, což šlo před tím jen z přehledu Nástroje / Vazby / Všechny vazby / Upravit vazbu. |
| 28. 7. 2026 | Oprava | Oprava korektoru češtiny, kdy při určitém výskytu některých písmen s diakritikou na konci slova chybně označoval za chybu a nabízel to samé slovo jako opravu. |
| 28. 7. 2026 | Vylepšení | Nyní se při otevření entity překreslí adresa URL rovnou na tuto entitu, takže teď můžete odkazovat na konkrétní entitu a používat i funkce prohlížeče, jako jsou záložky a sdílení apod. |
| 22. 7. 2026 | Vylepšení | V syntaxi databasetext výpisech lze teď do výsledku přidat nový řádek prostřednictvím zpětného lomítka n |
| 22. 7. 2026 | Oprava | Opravena chyba, kdy se někdy nemusela načíst ze souboru nová verze uloženého objektu, pokud měla entita objekty. |
| 20. 7. 2026 | Vylepšení | Kromě funkce database pro include tabulky z databáze je nová funkce databasetext která dle filtrů a stringu format vykreslí obsah databáze a jejích polí jako libovolný zahrnutý výstup. Tohle je hrozně univerzální parser skoro na všechno. A také doplněna nápověda o popis syntaxe. |
| 7. 7. 2026 | Vylepšení | Předělán pohled Úkoly, nyní s rozbalovacími sekcemi, pokročilejšími filtry a také s pár funkcemi na tlačítka pro každý úkol, teď je to daleko užitečnější karta. |
| 2. 7. 2026 | Funkce | Nová možnost uchovávt a pracovat s datovými objekty, nově atributy typu object, přístup buď přes rozhraní a nebo tlačítka zkopírovqt a vložit přes schránku a uložit a nahradit přes soubor. |
| 30. 6. 2026 | Oprava | Opravena chyba v exportu do DOCX a PDF, kdy se někdy nevykreslovaly správně revize přes critic markup, pokud šlo o přímé nahrazení textu. DOCX nic takového neumí, takže teď je to odstraněný a za ním hned vložený text. |
| 28. 6. 2026 | Oprava | Někdy se při složitých dotazech do databáze přes database placeholder nepromítla tabulka správně do zkopírovaného obsahu entity, opraveno. |
| 25. 6. 2026 | Oprava | Opravena chyba, kdy se někdy po pokročilém filtrování a uložení pohledu s více pokročilými filtry do pohledu neuložily filtry, ale jen aspekty. Pardon. |
| 13. 6. 2026 | Vylepšení | V procházení struktury okolí entity se nyní u každé entity s komentářem ukazuje tlačítko, díky kterému si můžete komentáře zobrazit. |
| 12. 6. 2026 | Oprava | Důležitá oprava generování offline prohlížeče, teď už vše v offline režimu v samostatném prohlížeči funguje jak má. |
| 8. 6. 2026 | Funkce | Nyní se databáze includují do jiných entit přes nový příkaz picluide database místo include, podporuje celou řadu parametrů jako jsou vybrané sloupce filtrování, apod. Ostatně i tento výpis je tvořen filtrovaným exportem databáze změn aplikací |
| 2. 6. 2026 | Funkce | Poměrně výrazná nová verze se spoustou funkcí. Time tracking pro jakoukoliv entitu, sledování času napříč projektem, detaily projektu vylepšeny, zcela přepracováno rozhraní pro události... |
| 9. 4. 2026 | Vylepšení | Zpřehlednění detailu u diagramu a databáze a zpřehlednění time tracker pohledů. |
| | Vylepšení | Když používáte projekty, vytváříte-li z entity v projektu novou entitu jakýmkoliv způsobem, nabídne se vám ji rovnou přidat do jednoho či více souvisejících projektů, přičemž to inteligentně rozpozná projekty kterých se to může týkat. Do teď tohle bylo jen při tvorbě z detailu projektu nebo schůzky. |




