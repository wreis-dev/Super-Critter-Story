# CLAUDE.md

Este arquivo orienta edições futuras no site *Super Critter Story: Backyard Legends*.

## Projeto

Site marketing single-page em português (pt-BR) para *Super Critter Story: Backyard Legends*, um RPG tático. O projeto não tem build, package manager, testes automatizados ou repositório git local.

Arquivos principais:

- `index.html`: HTML, CSS e JS do site em um único arquivo.
- `cornfield_tile.png`: imagem tileable do milharal no hero.
- `Raizes.png`: faixa de raízes usada logo abaixo do milharal para transição cromática.
- `assets/characters/*.png`: renders voxel 3D dos animais nos cards de personagens.
- `assets/scarecrow/scarecrow-day-voxel.png` e `assets/scarecrow/scarecrow-night-voxel.png`: versões voxel transparentes do espantalho no hero.
- `assets/scarecrow/scarecrow-night-sprite-sheet.png`: sprite sheet horizontal do espantalho noturno, mantida como asset legado da versão anterior da moldura de história.

## Como visualizar

Abra `index.html` diretamente no navegador ou sirva a pasta com um servidor estático, por exemplo:

```bash
python -m http.server 8000
```

O site carrega Google Fonts via `fonts.googleapis.com`; a página funciona sem build, mas a tipografia depende de rede.

## Estrutura do `index.html`

O arquivo é organizado em blocos longos. Ao editar, encontre a região certa primeiro:

- CSS base: tokens de tema, nav, hero, milharal, raízes, seções, cards, footer e responsividade.
- Overrides de `body.day-theme`: paleta do modo dia, atualmente reescrita como terra profunda para encaixar com `Raizes.png`.
- Markup: `nav`, `hero` (`#inicio`), `historia`, pilares (`#mecanicas`), personagens (`#personagens`), bestiário (`#classes`), plataformas (`#plataformas`) e footer.
- JS: scroll do nav, elementos procedurais do céu, reveal on scroll e alternância dia/noite.

## Temas e cores

- O site inicia em modo dia com `<body class="day-theme">`.
- O modo dia não é mais uma paleta clara de céu/prado. Ele usa tons subterrâneos para combinar com a faixa de raízes:
  - `--night: #1f0b04`
  - `--deep: #2a1408`
  - `--gold: #e8a040`
  - `--parchment: #e8d4ae`
- O modo noite mantém a paleta original escura/esverdeada.
- Evite hardcodes novos quando existir token de tema equivalente.
- Elementos interativos têm transições mais rápidas que a transição global de cor; preserve esse padrão para hover não ficar lento.

## Hero e transição de raízes

- O espantalho do hero usa duas imagens voxel transparentes:
  - `.scarecrow-day`, visível em `body.day-theme`;
  - `.scarecrow-night`, visível no tema noite e propositalmente um pouco mais assustadora.
- As duas imagens ficam sobrepostas dentro de `.scarecrow-wrap`; a troca acontece por opacidade.
- A moldura da seção `historia` (`.art-frame`) usa um painel de camadas em `.backyard-layer-scene`, inspirado em interfaces de vidro fosco com profundidade isométrica.
- O painel é feito em HTML/CSS, sem assets externos: `.layer-glass` aplica `backdrop-filter`, `.iso-stack` organiza as camadas do quintal e `.layer-callout` posiciona labels em português.
- As camadas representam milharal, caminhos, zona do Espantalho, solo escuro e raízes; os pontos âmbar/verde usam animações sutis de brilho.
- O milharal usa três camadas `.crops-back`, `.crops-mid` e `.crops-front`, todas baseadas em `cornfield_tile.png`.
- A primeira fileira visual (`.crops-front`) deve ficar estática.
- As camadas de trás continuam usando `crops-drift`.
- Logo após o hero há `<div class="roots-transition" aria-hidden="true"></div>`, que usa `Raizes.png`.
- A base da faixa de raízes é `#1f0b04`, e o `::after` aplica fade para `var(--night)` para esconder costuras subpixel.

## Cards de personagens

- Os antigos SVGs pixel art dos animais foram substituídos por PNGs voxel 3D em `assets/characters/`.
- Cada card usa:
  - `<img class="char-sprite char-voxel" ... loading="lazy" decoding="async">`
  - `alt=""` e `aria-hidden="true"`, pois os nomes e papéis já aparecem em texto no próprio card.
- Se trocar imagens, mantenha proporção quadrada, personagem centralizado e fundo escuro/terroso para combinar com os cards.
- O hover do card escurece `.char-bg` tanto no tema noite quanto no tema dia.

## Texto e idioma

- Todo texto visível deve ficar em português (pt-BR), exceto nomes próprios ou títulos de produto.
- Evite termos em inglês soltos na UI; traduza quando não forem marca ou nome de gênero indispensável.
- Atenção à concordância de classe/personagem. Exemplo atual: `Pato · Batedor`, `Bombardeiro d'Água`, `Mensageiro Veloz`.
- Preserve acentos reais em UTF-8. Não regrave o HTML por ferramentas que decodifiquem UTF-8 como ANSI/Windows-1252.

## Áudio

- Não há áudio ativo no site.
- O arquivo `cigarras-dia.mp3` foi removido da pasta do projeto.
- Não reintroduza autoplay sem um controle explícito, porque navegadores bloqueiam som antes de interação do usuário.

## Registro de alterações - 2026-04-25

- Corrigido o mojibake que quebrou acentos, travessões, marcadores e emojis no `index.html`.
- Revisados textos visíveis da interface:
  - subtítulo do hero traduzido para `Um RPG tático no quintal ensolarado`;
  - `Líder de facto` corrigido para `Líder de fato`;
  - `Comic relief vital` corrigido para `Alívio cômico vital`;
  - classe do pato ajustada para `Batedor`, com evoluções masculinas no bestiário.
- Removida a lógica de áudio das cigarras e eliminado o asset `cigarras-dia.mp3`.
- Mantidos os cards voxel 3D dos seis animais em `assets/characters/`, com lazy loading e async decoding.
- Melhorada a apresentação dos renders voxel:
  - `image-rendering: auto`;
  - sombra mais adequada para PNGs 3D;
  - transição combinando `transform` e `filter`;
  - hover do fundo restaurado no tema dia.
- Adicionado `type="button"` ao botão de alternância de tema.
- Normalizada a indentação de `body.day-theme .classes-wrap`.

## Registro de alterações - 2026-04-25, espantalho voxel

- Geradas duas versões voxel do espantalho:
  - `assets/scarecrow/scarecrow-day-voxel.png`, para o modo dia;
  - `assets/scarecrow/scarecrow-night-voxel.png`, para o modo noite, com leitura um pouco mais assustadora.
- As versões finais foram processadas como PNG RGBA com fundo transparente a partir de fontes chroma-key.
- O SVG inline antigo do espantalho foi substituído por duas tags `<img>` sobrepostas no hero.
- O CSS de `.scarecrow-wrap` e `.scarecrow-art` agora controla tamanho, filtro, sombra e alternância por tema.

## Registro de alterações - 2026-04-25, cena animada da história

- A arte estática dentro de `.art-frame` foi substituída por uma cena animada:
  - fundo de céu tempestuoso;
  - relâmpagos com `@keyframes`;
  - três corvos em loop com batida de asas;
  - espantalho voxel noturno no centro com oscilação suave.
- Removido o override antigo `body.day-theme .art-frame svg rect:first-child`, que só existia para o SVG anterior.
- A cena usa uma sprite sheet derivada de `assets/scarecrow/scarecrow-night-voxel.png` para manter consistência visual com o hero.

## Registro de alterações - 2026-04-25, sprite do espantalho

- Criada a sprite sheet `assets/scarecrow/scarecrow-night-sprite-sheet.png`.
- A sprite tem 8 quadros horizontais, 384x512 cada, totalizando 3072x512.
- Os quadros foram derivados do espantalho voxel noturno transparente, com balanço sutil e variação de brilho nos olhos.
- A sprite foi usada na versão anterior da cena da seção de história; a moldura atual usa o painel `.backyard-layer-scene`.

## Registro de alterações - 2026-04-25, efeito de camadas da história

- Substituída a cena de tempestade dentro de `.art-frame` por `.backyard-layer-scene`.
- Criado um painel de vidro fosco com `backdrop-filter`, névoa desfocada, brilho âmbar e pontos verdes para sugerir energia/segredo.
- Montada uma pilha isométrica em CSS com camadas de milharal, caminho, zona do Espantalho e raízes.
- Adicionados labels em português: `MAPA DO QUINTAL`, `Milharal`, `Raízes`, `Zona do Espantalho` e `Segredo vivo`.
- Incluídos ajustes responsivos para manter labels e camadas dentro da moldura em telas menores.

## Convenções

- Comentários de seção usam cabeçalhos com box-drawing, como `/* ── NAV ── */` e `<!-- ── HERO ── -->`.
- Pixel-art SVGs remanescentes usam `shape-rendering="crispEdges"` e coordenadas inteiras.
- Imagens bitmap novas devem ser salvas dentro do projeto, não apenas em diretórios gerados do Codex.
