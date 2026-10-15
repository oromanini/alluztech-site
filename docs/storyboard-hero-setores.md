# Storyboard · Hero "Um dia na sua empresa"

Proposta de 14/10/2026 para trocar o topo em fluxograma (seção 12 do pacote de design). Uma tomada contínua, comandada pelo scroll, que atravessa uma empresa em maquete escura. Um único fio de luz verde-água entra pela porta, passa por cinco setores, organiza cada um e termina na linha do horizonte com o Q (o quadro final já aprovado, job 49a8a51f do Higgsfield).

Ferramenta de produção: **Kling** (klingai.com), Image 3.0 para os quadros e Video 3.0 para os clipes. O piloto da sala 1 foi aprovado em 14/10/2026 (seção 12). Este documento já incorpora o que o piloto ensinou.

**Corte de 14/10/2026: o filme passa a ter 3 salas, não 5.** Ficam Atendimento, Financeiro e Diretoria (nesta ordem: sala 1, sala 2, sala 3). Cobrança e Estoque saem do filme; os prompts deles ficam abaixo só como referência. A maquete continua com cinco salas na planta (M0 v2 e M1), o filme é que pula duas. A aprovação passa a ser **por sala**: A, B, passagem e clipe da sala de uma vez.

| Filme (3 salas) | Quadros | Clipes |
|---|---|---|
| Abertura | K0 | C0 (K0 → A1) |
| Sala 1 · Atendimento | A1, B1 (aprovados) | C1 (aprovado) |
| Sala 2 · Financeiro | A2, B2 | T1 (B1 → A2), C2 (A2 → B2) |
| Sala 3 · Diretoria | A5, B5 | T2' (B2 → A5), C5 (A5 → B5) |
| Final | M1, KF | T5 (B5 → M1), C6 (M1 → KF) |

Custo restante com 3 salas: 6 quadros (6 créditos) e 7 clipes (280), cerca de 290 créditos mais refações.

**Produção concluída em 14/10/2026.** Os 8 clipes do filme estão na conta Kling, na ordem C0, C1, T1, C2, T2, C5, T5, C6 (o corte para 3 salas deixou T2 ligando B2 direto ao A5). Quadros escolhidos: A2 v2, B2 v2, A5 v2, B5 v2, K0 v1, M1 v2. O KF foi extraído do último quadro de `_producao/brutos/hero-v2-raw.mp4` e enviado como upload. Saldo final: 435 créditos.

| Clipe | Resultado |
|---|---|
| C0 | ótimo: a câmera atravessa a porta até a recepção |
| C1, C2 | luz e arrumação boas; câmera quase parada |
| T1 | a luz desce ao chão e contorna a porta; na metade vira fusão com a recepção sobreposta |
| T2 | câmera atravessa a porta até a Diretoria, sem fusão |
| C5 | pilha diminui, luz chega pelo chão até a mesa |
| T5 | sobe da Diretoria até a vista aérea com o fio ligando as salas |
| C6 | a maquete vira contorno de luz e assenta na linha do Q, igual ao KF; sem salto de cor |

**Montagem e encode (15/10/2026).** Clipes baixados sem marca d'água (Assets, Batch Actions, "Download without Watermark") para `_producao/hero-salas/clipes/`, numerados na ordem do filme. `_producao/hero-salas/montar.sh` junta os 8 tirando o 1º quadro dos clipes 2 a 8 (igual ao último do anterior, para o scrub não engasgar) e gera:

| Arquivo (`public/assets/hero/salas/`) | Conteúdo | Tamanho |
|---|---|---|
| `hero-salas.mp4` | filme inteiro, 961 quadros, 40 s | 5,6 MB |
| `cap-0-abertura.mp4` | C0 (quadros 0 a 120) | 0,6 MB |
| `cap-1-atendimento.mp4` | C1 + T1 (121 a 360) | 1,2 MB |
| `cap-2-financeiro.mp4` | C2 + T2 (361 a 600) | 1,3 MB |
| `cap-3-diretoria.mp4` | C5 + T5 (601 a 840) | 1,5 MB |
| `cap-4-final.mp4` | C6 (841 a 960) | 0,9 MB |
| `hero-salas-poster.jpg`, `hero-salas-aerea.jpg`, `hero-salas-final.jpg` | 1º quadro, vista aérea (movimento reduzido), linha do Q | |

Todos em 1728×974, 24 fps, H.264 crf 25, `-g 8`, sem áudio, faststart (mesmo padrão do hero anterior). Master em alta: `_producao/hero-salas/master-1916.mp4` (crf 14, fora do git). A linha do Q no `hero-salas-final.jpg` precisa ser medida de novo antes de pousar o Q por cima.

## 1. Lições da seção 11 que este roteiro respeita

O vídeo "do ruído ao sinal" saiu por dois motivos. Os dois viram regra aqui:

1. **Falava de tecnologia, não do empresário.** Agora cada cena é um lugar da empresa dele, com o problema que ele reconhece (WhatsApp, notas, cobrança, estoque, "tudo passa por mim"). A IA nunca aparece como robô ou tela: aparece só como o fio que arruma.
2. **O brilho atrapalhava a leitura.** Todo quadro reserva o **terço esquerdo escuro e sem fio** para o texto em HTML. O fio vive no centro e no terço direito. Nenhum texto entra no vídeo.

## 2. A planta (fixa para todos os quadros)

Um andar só, longo e estreito, visto como maquete de arquitetura em escala 1:50. As salas ficam em fila reta, da esquerda para a direita, como vagões de trem:

```
 [porta] → 1 Atendimento → 2 Financeiro → 3 Cobrança → 4 Estoque → 5 Diretoria (janela)
```

- Paredes baixas, sem teto (como toda maquete), o que permite a vista aérea no final.
- Cada sala tem uma abertura de porta na parede direita que leva à próxima.
- A Diretoria é a única sala com janela. O M0 v2 aprovado ainda mostra janelas na parede externa comprida: ignorar nos quadros de sala e corrigir no M1.

## 3. Regras de continuidade

| Regra | Valor |
|---|---|
| Direção da câmera | sempre para a frente e para a direita; nunca volta |
| Altura da câmera | olho de bonequinho (≈1,7 m na escala), exceto fachada e aérea |
| Lente | equivalente a 35 mm, tilt-shift leve, profundidade de campo rasa |
| Entrada do fio | sempre pelo canto inferior esquerdo do quadro (eco do gradiente da marca) |
| **Saída do fio** | **sempre pelo chão, atravessando a porta da direita, rumo à próxima sala** (regra que o piloto mostrou ser a mais fácil de perder; ver seção 4) |
| Zona de texto | terço esquerdo escuro, sem fio, sem brilho |
| Estado "antes" | quase escuro, luz ambiente fria e fraca vinda de cima, só brilhos pálidos de tela |
| Estado "depois" | o fio aceso ilumina a sala por baixo em verde-água; nenhuma outra fonte nova |
| Pessoas | bonequinhos brancos de maquete; nunca gente realista. Continuam brancos mesmo perto do fio |
| Proibido | texto legível, números, logos, tons quentes, madeira, reflexo de lente, robôs, hologramas |

## 4. O que o Kling ensinou no piloto

Regras de redação que valem para todos os prompts das seções 6 e 7:

1. **Planta:** só saiu certa com "exactly FIVE rooms in ONE STRAIGHT ROW, like train carriages", piso escuro dito com todas as letras ("including the floors... no light or beige floors, no wood tones") e "plain seamless black background". Sem isso, o Kling fez 3 salas em L com piso bege.
2. **Quadro "antes" a partir da planta:** começar com "Use image1 only as the reference for the building, materials, colors and figurine style; do NOT copy its aerial viewpoint." Sem essa frase, o Kling copia o ângulo aéreo.
3. **Quadro "depois" a partir do "antes":** começar com "Same room, same scale model, same camera position and framing as image1, keep the composition identical; only the state of the room changes." Funcionou muito bem: o B1 saiu com o mesmo enquadramento do A1, que é o que o clipe com início e fim travados precisa.
4. **O fio vira fita de LED se a gente deixar.** No B1, "thread runs along the counter" virou uma fita de LED na borda do balcão, que não sai pela porta. A partir da sala 2, descrever o fio como **uma linha fina deitada no chão**, do canto inferior esquerdo até a porta da direita, e dizer o que ele não é. Trecho fixo para todo quadro "depois":
   ```
   The teal light is ONE thin glowing line lying flat ON THE FLOOR, like a laser line or a
   fiber-optic cable, never an LED strip on furniture edges. It enters the frame at the lower
   left corner, crosses the floor, touches the base of the room's key object, and continues
   across the floor until it disappears through the open doorway on the right wall.
   ```
5. **Mudanças pequenas não acontecem sozinhas.** Os celulares não ganharam o ponto verde-água pedido. O que importa para a história precisa ser grande e visível (pilhas que somem, caixas alinhadas), não detalhe de tela.
6. **Bonequinhos:** o Kling coloca rosto e postura de funcionário. Aceitamos no piloto (no A1 eles ficaram sentados atrás do balcão, como atendentes). Nas próximas salas, manter a regra "faceless" e não depender de bonequinho sair de cena para contar a história.
7. **Clipe:** a câmera ficou parada, mesmo com "slow dolly forward" no prompt. Nos próximos, pedir o movimento como primeira frase e com consequência visível (ver prefixo da seção 7). Os tons do fio "vazaram" para o bonequinho que saiu; reforçar "figurines stay white".

## 5. Bíblia visual (prefixo de todo prompt de quadro)

Colar antes de cada prompt da seção 6 (nos quadros "depois", o prefixo vem depois da frase de referência da regra 3):

```
Architectural scale model (maquette) of a small company office, 1:50 scale, photographed
in a dark studio with a macro lens, subtle tilt-shift and shallow depth of field.
Materials: matte dark navy painted MDF and basswood (#04192B, #061F33, #08324A), floors
included, frosted acrylic panels, hairline brushed-metal details. Unpainted, faceless white
architectural figurines. Low-key lighting, almost dark. The only strong light source is
a single thin luminous fiber-optic thread in teal (core #129A9C, glow #6FE3E0) when present.
Quiet, precise, minimal, cinematic, fine film grain. The left third of the frame stays dark
and empty for text overlay.
No readable text, no letters, no numbers, no logos, no realistic humans, no robots,
no holograms, no warm or orange tones, no wood, no lens flares, nothing outside the model.
```

## 6. Quadros

Kling Image 3.0, **2K HD, 16:9, 1 saída** (conferir a cada vez: a página volta para 3:4 · 2 depois de recarregar). Referência: arrastar a imagem do histórico para "Image Reference"; ela vira "image1".

| Quadro | Status | Referência (image1) |
|---|---|---|
| M0 v2 | **aprovado** (14/10) | nenhuma |
| A1 | **aprovado** (14/10) | M0 v2 |
| B1 | **aprovado** (14/10), com o fio em fita de LED | A1 |
| K0 | a fazer | M0 v2 |
| A2 a A5 | a fazer | B da sala anterior |
| B2 a B5 | a fazer | A da mesma sala |
| M1 | a fazer | M0 v2 |
| KF | já existe (job 49a8a51f) | não refazer |

### M0 v2 · Planta mestre, escura (aprovado; não entra no filme)
```
Architectural scale model (maquette) of a small company office, 1:50 scale, photographed in
a dark studio with a macro lens, subtle tilt-shift. High three-quarter aerial view. The model
is one long, narrow rectangular single-floor building, no ceiling, laid out as exactly FIVE
rooms in ONE STRAIGHT ROW from left to right, like train carriages, each room separated by a
thin wall with one doorway leading to the next room on the right. Room 1 (far left):
reception with a counter, four small phones on stands and a waiting bench with figurines.
Room 2: finance, two desks buried in paper piles. Room 3: collections, a large pinboard wall
covered in cards and tangled grey string. Room 4: stockroom, metal shelving with misaligned
boxes, some on the floor. Room 5 (far right): director's office, one desk under a tall stack
of papers, and the ONLY window in the whole model. All other walls are solid with no windows.
Everything is painted matte dark navy, including the floors (#04192B, #061F33, #08324A); no
light or beige floors, no wood tones. Unpainted, faceless white architectural figurines.
Almost dark, lit only by faint cold ambient light from above, with small pale blue screen
glows. Background: plain seamless black, no texture. The model occupies the center and right
of the frame; the left third of the frame is empty and dark. Quiet, precise, minimal,
cinematic, fine film grain. No readable text, no letters, no numbers, no logos, no realistic
humans, no warm or orange tones, no lens flares.
```

### M1 · Planta mestre, acesa (fim do T5, início do C6)
Ref: M0 v2.
```
Same model, same aerial camera and framing as image1. Remove every window from the long
outside wall; the only window is in the far right room. Every room is now tidy and calm.
A single continuous teal fiber-optic thread lies flat on the floor: it enters through the
front door at the lower left, runs through every room in order, passing through each
doorway, and connects them all. The thread lights each room softly from below. The rest of
the model stays dark navy. Background plain seamless black.
```

### K0 · Fachada (abre o filme)
Ref: M0 v2. Frase de referência da regra 2.
```
Exterior of the office model at night, seen from the street side at figurine eye level.
A plain dark navy facade with a single front door slightly ajar. Through the gap, faint
signs of a messy interior. A thin teal thread of light lies flat on the ground, enters the
frame from the lower left corner and slips through the door gap. One white figurine stands
outside, small, on the right side.
```

### Sala 1 · Atendimento (aprovada)

**A1 · antes** (aprovado). Ref: M0 v2.
```
Use image1 only as the reference for the building, materials, colors and figurine style; do
NOT copy its aerial viewpoint. New shot: inside room 1 (the reception, far left room of that
same model), camera at figurine eye level, looking in from the front door, 35mm lens, macro,
subtle tilt-shift, shallow depth of field. Architectural scale model 1:50, no ceiling, matte
dark navy walls and floor (#04192B, #061F33, #08324A). A reception counter with four small
smartphones on little stands, each screen glowing pale blue with stacked abstract message
bubbles (no text). Sticky notes scattered on the counter. A queue of five unpainted, faceless
white architectural figurines waits on a bench, one standing. Dim and cold, faint ambient
light from above. On the right wall, an open doorway to the next room, dark. The left third
of the frame stays dark and empty. Quiet, precise, minimal, cinematic, fine film grain. No
light thread, no readable text, no letters, no numbers, no logos, no realistic humans, no
warm or orange tones, no wood, no lens flares.
```
Resultado: três bonequinhos sentados atrás do balcão (atendentes), um em pé, bilhetes no chão. Aceito como está.

**B1 · depois** (aprovado). Ref: A1.
```
Same room, same scale model, same camera position and framing as image1, keep the
composition identical; only the state of the room changes. A single thin luminous
fiber-optic thread of teal light (core #129A9C, glow #6FE3E0) enters the frame from the lower
left corner along the floor, rises onto the counter, runs along the counter touching each
phone stand, then continues across the floor and exits through the open doorway on the right
wall. The thread softly lights the room from below in teal; it is the only new light source.
The phone screens are now calm and dim, each showing one small teal dot. The sticky notes on
the floor are gone; the floor is clean. The three seated figurines sit upright and relaxed.
The standing figurine is gone. Matte dark navy walls and floor, unpainted white figurines.
The left third of the frame stays dark. Quiet, precise, minimal, cinematic, fine film grain.
No readable text, no letters, no numbers, no logos, no warm or orange tones, no lens flares.
```
Resultado: enquadramento idêntico ao A1, bilhetes e bonequinho em pé somem, mas o fio virou fita de LED na borda do balcão e não sai pela porta. O T1 resolve isso (seção 7).

### Sala 2 · Financeiro

**A2 · antes**
Ref: B1. Frase de referência da regra 2, trocando "aerial viewpoint" por "room".
```
New shot: inside room 2 (finance), entering through the doorway from reception, camera at
figurine eye level. Two desks buried in paper: invoices, receipts, a small receipt printer
spilling a long curled paper strip onto the floor, a calculator, loose cardboard folders,
a payment card terminal. One faceless white figurine hunched over a desk. Dim and cold.
A thin teal line of light lies faint on the floor at the lower left, entering from the
previous room. Doorway to the next room on the right wall, dark.
```

**B2 · depois**
Ref: A2. Frase da regra 3 e trecho fixo do fio (regra 4), com "key object" = the receipt printer.
```
Papers are in clean, squared stacks; folders filed upright on a shelf; the printer strip is
neatly cut and gone from the floor. The figurine sits upright.
```

### Sala 3 · Cobrança

**A3 · antes**
Ref: B2.
```
New shot: inside room 3 (collections), camera at figurine eye level. A large pinboard wall
covered with dozens of small blank cards pinned at random, connected by a tangle of grey
strings. A wall calendar with no numbers, many squares crossed out in grey. A desk with a
landline phone off the hook. Dim and cold. A thin teal line of light lies faint on the floor
at the lower left. Doorway on the right wall, dark.
```

**B3 · depois**
Ref: A3. Frase da regra 3 e trecho fixo do fio, com "key object" = the pinboard wall.
```
The grey tangle is gone. The cards are aligned in a clean grid on the pinboard. The phone is
back on its cradle.
```

### Sala 4 · Estoque

**A4 · antes**
Ref: B3.
```
New shot: inside room 4 (stockroom), camera at figurine eye level. Metal shelving with small
cardboard boxes misaligned, some tilted, two fallen on the floor. A clipboard with loose
sheets on a crate. A faceless figurine climbing a small ladder. Dim and cold. A thin teal
line of light lies faint on the floor at the lower left. Doorway on the right wall, dark.
```

**B4 · depois**
Ref: A4. Frase da regra 3 e trecho fixo do fio, com "key object" = the metal shelving.
```
Every box aligned in straight rows on the shelves, none on the floor. The ladder is folded
against the wall; the figurine stands on the floor.
```

### Sala 5 · Diretoria

**A5 · antes**
Ref: B4.
```
New shot: inside room 5 (director's office), camera at figurine eye level. One desk under a
tall tower of papers and binders. A single faceless white figurine sits hunched behind it,
head down, almost hidden. Behind, the only window of the model, showing a dark night sky.
Dim and cold. A thin teal line of light lies faint on the floor at the lower left.
```

**B5 · depois**
Ref: A5. Frase da regra 3. Exceção ao trecho fixo: é a última sala, o fio não sai pela porta.
```
The paper tower is gone; the desk holds a single thin report sheet. The figurine stands
upright at the window, looking out. The teal light is ONE thin glowing line lying flat on the
floor, entering at the lower left corner and ending under the desk, lighting the room softly
from below. Never an LED strip on furniture edges.
```

## 7. Clipes

Kling Video 3.0, **1080p, 5 s, 1 saída, Native Audio desligado** (com áudio custa 60 em vez de 40). Quadros: botão "History" na caixa "Add start and end frames"; marcar primeiro o quadro inicial (vira 1) e depois o final (vira 2); conferir a ordem na seta antes de gerar.

Prefixo comum (a primeira frase é o movimento, regra 7):
```
The camera physically moves the whole time: a slow, steady dolly forward of about one
table-length, with visible parallax between the counter, the figurines and the back wall.
One continuous shot, no cuts. Physical scale-model realism, everything stays a 1:50
architectural model. The teal light is one continuous object that never breaks.
Figurines stay white. No text, no warm tones, no lens flares, no sudden changes.
```

| Clipe | De → Para | Status | Prompt (depois do prefixo) |
|---|---|---|---|
| C0 | K0 → A1 | a fazer | The camera glides forward at ground level, following the teal line through the gap of the front door and into the dark reception room. |
| C1 | A1 → B1 | **aprovado** (14/10) | ver nota abaixo |
| T1 | B1 → A2 | a fazer | The glow at the counter edge flows down to the floor and becomes one thin line that runs across the floor and through the doorway on the right; the camera follows it into the next dark room. |
| C2 | A2 → B2 | a fazer | The teal line advances along the floor to the printer; papers slide into squared stacks, folders rise onto the shelf, the paper strip coils and disappears. The figurine straightens. |
| T2 | B2 → A3 | a fazer | The camera follows the teal line on the floor through the doorway on the right into the next dark room. |
| C3 | A3 → B3 | a fazer | The teal line reaches the pinboard; the grey strings slacken and fall away and the cards slide into a clean grid. The phone settles on its cradle. |
| T3 | B3 → A4 | a fazer | The camera follows the teal line on the floor through the doorway on the right. |
| C4 | A4 → B4 | a fazer | The teal line runs along the base of the shelving; tilted boxes straighten, fallen boxes rise into place. The figurine steps down and the ladder folds. |
| T4 | B4 → A5 | a fazer | The camera follows the teal line on the floor through the doorway on the right. |
| C5 | A5 → B5 | a fazer | The paper tower shrinks sheet by sheet until one report remains. The figurine lifts its head, stands, and walks to the window. |
| T5 | B5 → M1 | a fazer | The camera rises straight up and pulls back until the whole model is seen from above, every room lit by the single thread. |
| C6 | M1 → KF | a fazer | The rooms slowly fade into darkness while the thread straightens into one perfectly horizontal line of light low in the frame; the open arc of the Q draws itself above it. Then stillness. |

**C1 (aprovado):** prompt usado, antes do prefixo novo existir:
```
Slow, steady, continuous camera dolly forward into the room. No cuts. Physical scale-model
realism, everything stays a 1:50 architectural model. A single thin luminous teal
fiber-optic thread of light slowly advances from the lower left corner along the floor and
up onto the counter, gradually lighting the room softly from below in teal. As it passes,
the paper notes on the floor slide away and disappear, the phone screens calm down, and the
standing figurine walks out of frame. The seated figurines stay seated and relax. The light
grows smoothly until the final frame. Quiet, precise, minimal, cinematic. No people other
than the white figurines, no text, no warm tones, no lens flares, no sudden changes.
```
Resultado: tomada limpa, sem corte; a luz nasce no canto inferior esquerdo e cresce até a fita do balcão; o bonequinho sai pela porta da direita. Pontos fracos aceitos: câmera parada, bonequinho tingido de verde-água ao sair, bilhete no chão some devagar.

**Por que o T1 é especial:** como o B1 termina com a fita no balcão, é o T1 que leva o fio para o chão e para a porta. Daí em diante, todo B já termina com o fio saindo pela porta (regra 4) e os T são só "seguir o fio".

## 8. Mapa do scroll e texto (HTML por cima, terço esquerdo)

Com o corte para 3 salas, saem as linhas de Cobrança e Estoque, o hero cai para cerca de 500vh e as faixas se redistribuem por igual entre abertura, 3 salas e final. O mini-mapa mostra "0X / 04".

Hero fixado por 700vh (versão de 5 salas). Progresso 0 a 1, um capítulo por faixa. O mini-mapa no canto mostra a planta (traço fino, estilo wordmark) com a sala atual acesa e "0X / 06 · Setor"; clicar pula para a faixa.

| Faixa | Clipes | Rótulo | Título | Linha de apoio | Contador |
|---|---|---|---|---|---|
| 0.00 a 0.10 | K0, C0 | IA · Automação · Engenharia | O trabalho repetitivo da sua empresa, feito por uma IA. | Entre e veja um dia na sua empresa. | |
| 0.10 a 0.26 | C1, T1 | 01 · Atendimento | WhatsApp o dia inteiro. | Respondido na hora, com o histórico do cliente. | sobe |
| 0.26 a 0.42 | C2, T2 | 02 · Financeiro | Notas, Pix, cartão e boleto. | Notas emitidas e recebimentos conferidos. | sobe |
| 0.42 a 0.56 | C3, T3 | 03 · Cobrança | Cliente atrasado toda semana. | Cobrado no tom certo, sem você lembrar. | sobe |
| 0.56 a 0.70 | C4, T4 | 04 · Estoque | A planilha que ninguém atualiza. | Estoque em dia, sozinho. | sobe |
| 0.70 a 0.84 | C5, T5 | 05 · Diretoria | Tudo passava por você. | Agora sobra tempo para o que faz a empresa crescer. | sobe |
| 0.84 a 1.00 | C6 | 06 · Sua empresa | 9h por semana de volta. | Agendar diagnóstico / Conhecer o método DRI | 9h + fonte |

Gate de texto do pacote vale aqui: zero travessões e zero palavras de estoque.

## 9. Celular e movimento reduzido

- **Celular:** sem scrub de vídeo. Carrossel horizontal com os quadros B1 a B5 (estado "depois") em retrato recortado, o mesmo rótulo e título por cartão, e o contador no topo. Fecha no KF com o CTA.
- **Movimento reduzido:** M1 parado, com a lista dos cinco setores e o CTA.
- Recorte retrato: por isso a bíblia pede o assunto no centro e no terço direito; testar o corte 9:16 de cada B antes de aprovar.

## 10. Custos e ordem de produção

Preços no Kling (plano Standard, 14/10/2026):

| Item | Créditos |
|---|---|
| Quadro, Image 3.0, 2K, 1 saída | 1 |
| Clipe, Video 3.0, 1080p, 5 s, sem áudio, início e fim travados | 40 |
| O mesmo clipe com Native Audio | 60 (não usar) |

Gasto até aqui: piloto = 44 créditos (M0, M0 v2, A1, B1 e C1). Saldo depois do piloto: 702.

Falta produzir:

| Bloco | Itens | Créditos |
|---|---|---|
| Quadros | K0, A2 a A5, B2 a B5, M1 | 10 |
| Clipes de sala | C2 a C5 | 160 |
| Clipes de passagem | C0, T1 a T5, C6 | 280 |
| **Subtotal** | | **450** |
| Margem de refações (≈20%, quase toda em clipe) | | ≈90 |
| **Total estimado** | | **≈540 dos 702** |

Ordem, com gate em cada passo:

1. **Sala por sala**, na ordem do filme: A, depois B, depois o clipe C da sala. Gate do B: mesmo enquadramento do A e fio saindo pela porta no chão. Gate do C: câmera se move, fio contínuo, sem objeto surgindo do nada.
2. **T1 logo depois do A2**, porque é ele que corrige a fita do B1. Se o T1 não levar o fio para o chão em 2 tentativas, refazer B1 e C1 (≈41 créditos).
3. **K0 e C0**, depois **M1, T5 e C6**.
4. **Baixar tudo** para `_producao/` (fora do git, como nos brutos de 10/10). Hoje o piloto só existe na conta do Kling.
5. Montagem e encode: um arquivo por capítulo (carregamento progressivo), 1728px, `-g 8` como o atual, alvo abaixo de 2 MB por capítulo.
6. Prévia com texto por cima nos 3 tamanhos de tela. Gate de leitura: contraste do título sobre o terço esquerdo em todos os quadros.

## 11. Pontos em aberto

- **A fonte dos 9h.** A pesquisa Nu Empresas e Bridge Research mede 9h por semana com **burocracia financeira**. Distribuir essas horas por Atendimento e Estoque seria afirmar algo que a pesquisa não diz. Proposta: o contador sobe sem rótulo de horas por sala e só mostra "9h por semana de volta" no fim, com a fonte, como hoje. A outra opção é contar só no Financeiro e na Cobrança.
- **Duração.** O Kling gera 5 s por clipe; o mapa do scroll foi pensado para clipes de 6 s nas salas. Com 12 clipes de 5 s o filme tem cerca de 60 s, o que basta para 700vh. Reavaliar depois da montagem.
- **KF veio de outro modelo** (GPT Image 2.5 no Higgsfield). Conferir se o C6 do Kling pousa nele sem salto de cor; se não, gerar um KF novo no Kling a partir do antigo.

## 12. Piloto no Kling (14/10/2026)

Aprovado: M0 v2, A1, B1 e C1. Tudo gerado pelo Chrome em klingai.com, na conta do Oscar, plano Standard.

- **Higgsfield descartado** por custo (0 créditos na conta, 24 créditos por clipe de 8 s). O Kling não tem conector nesta sessão; a produção roda pelo navegador.
- **M0 v1 reprovado:** 3 salas em L, piso bege, janelas em várias salas. O v2 resolveu a planta com o prompt da seção 6.
- **A1:** bom de clima e de luz; bonequinhos viraram atendentes sentados. Aceito.
- **B1:** enquadramento idêntico ao A1 (ótimo para o clipe), mas o fio virou fita de LED.
- **C1:** 5 s limpos, sem corte nem "hiperespaço"; câmera parada.

## 13. Hero no site (15/10/2026)

- `public/index.html`, `public/styles.css` e `public/hero.js` trocaram o fluxograma pelo filme. Hero fixado por 560vh; o scroll vira o tempo do vídeo (0 a 40 s), carregado como Blob, com seeks travados e suavização por dt, no mesmo motor do topo anterior.
- Textos no terço esquerdo, um por faixa de tempo: abertura (0 a 4,2 s), Atendimento (5,6 a 14), Financeiro (15,6 a 24), Diretoria (25,6 a 33,6) e "9h por semana de volta" com a fonte e os dois CTAs (a partir de 36,6). Um degradê escurece o terço esquerdo para a leitura.
- O Q se desenha no fim e a barra dele pousa sobre a linha de luz (76,1% da altura do quadro, recalculada para o corte "cover" de cada tela).
- Mini-mapa no canto superior direito (o inferior é do botão do chat): três salas em traço fino, porta cortada entre elas, o fio acende conforme o filme avança, rótulo "0X / 04 · Sala" e contador de horas. Clicar numa sala leva o scroll até ela.
- Enquanto o vídeo carrega, o fundo troca entre os quadros fixos de cada sala, então o hero funciona mesmo sem vídeo.
- Celular, tablet em retrato e movimento reduzido (os mesmos cinco portões do topo anterior): sem vídeo. Abertura com o quadro da fachada e, abaixo, carrossel com o estado "depois" de cada sala e o cartão final com os CTAs. O vídeo nem é baixado nesses casos.
