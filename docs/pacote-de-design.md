# Pacote de design · Valiqon

Entrega da Fase 5 da skill "Site de 10K", adaptada: o manual da marca Valiqon (v9, traço cortado) manda em cores, tipografia e logotipo; o texto espelha o site atual da Alluz Tech com o nome trocado. Nível 1: uma tomada única controlada pelo scroll.

## 1. Premissa da marca

**Do ruído ao sinal.** A operação de uma PME chega como ruído: tarefas repetidas, sistemas que não conversam, equipe atolada. A Valiqon tira o excesso até sobrar o sinal, do mesmo jeito que o wordmark perde só o necessário para continuar legível ("Precisão no que falta"). O hero mostra isso literalmente: partículas embaralhadas que, conforme o visitante rola, se alinham em fios finos de luz e assentam numa única linha calma, onde o Q se desenha. Cada seção abaixo serve a essa ideia e afunila para UMA chamada: agendar o diagnóstico gratuito.

## 2. Paleta (tokens, do manual v9)

```css
:root{
  --canvas:#04192B;        /* marinho, base dominante (60%) */
  --deep:#08324A;          /* profundo */
  --panel:#061F33;         /* superfícies elevadas, do manual */
  --petroleo:#0C5E6B;      /* secundária */
  --accent:#129A9C;        /* verde-água: CTA e ênfase rara (10%) */
  --accent-hover:#6FE3E0;  /* água clara */
  --accent-muted:#154660;  /* linhas e bordas do manual */
  --text-primary:#FFFFFF;
  --text-secondary:#A9C6CD;
}
```

Gradiente da marca: verde-água no canto inferior esquerdo até marinho no superior direito. Texto sobre verde-água sempre em marinho.

## 3. Tipografia

Desvio declarado da skill (que pede trio display/texto/mono): o manual define **uma família só, Manrope**. Hierarquia do manual: Título 1 Light 56, Título 2 Light 40, Título 3 Medium 28, texto Regular 18, descritor Medium com 0,5em, legenda Regular 13 com 0,3em em caixa alta. Rótulos pequenos usam a legenda no lugar da mono. O wordmark nunca é digitado: sempre o SVG oficial.

## 4. Mapa de faixas do hero (pontos de partida, validar com o teste de flick)

Hero de 460vh. Progresso 0 a 1.

| Faixa | Intervalo | Momento da filmagem | Texto (ao pé da letra) | Entrada |
|---|---|---|---|---|
| 1 | 0.00 a 0.22 | tempestade densa de partículas no marinho | IA · Automação · Engenharia / "Inteligência que devolve tempo, foco e margem." | dispersão (abre assentada) |
| 2 | 0.27 a 0.50 | as partículas começam a ganhar direção | "Sua equipe gasta horas no que repete." / "Digitação, e-mails padrão, relatórios manuais, planilhas que não conversam." | alinhamento em grade |
| 3 | 0.55 a 0.76 | fios paralelos de verde-água, quase calmos | "A Valiqon automatiza esse trabalho." / "Com engenharia de IA séria, pensada para o pequeno e médio empresário brasileiro." | desfoque para nítido |
| 4 | 0.82 a 1.00 | uma linha única de luz; o Q se desenha sobre ela | "Em 30 minutos, a gente mostra onde a IA paga sozinha." + Agendar diagnóstico / Conhecer o método DRI | subida palavra por palavra em etapas |

## 5. Hero estático (celular e movimento reduzido)

Quadro final composto (linha de luz e Q) com: IA · Automação · Engenharia / "Inteligência que devolve tempo, foco e margem." / "A Valiqon automatiza o trabalho que repete na sua operação, com engenharia de IA séria, pensada para o pequeno e médio empresário brasileiro." / Agendar diagnóstico.

## 6. Abaixo da dobra (texto espelhado do site atual, travessões trocados por pontuação)

1. **Números** (faixa logo após o hero): 8 anos de engenharia de software · 80% de tarefas automatizadas em média · 12k/mês economizado vs. dev interno · R$ 0 para o diagnóstico inicial.
2. **O problema**: três sintomas (custo de oportunidade, silos de dados, operação como gargalo).
3. **A solução, 5 engrenagens**: LLMs, RAG, n8n, MCP, OpenClaw.
4. **Método DRI**: Diagnóstico, Réplica de Comportamento, Implementação, em abas.
5. **Valiqon IA**: chat de demonstração ligado ao /api/chat.
6. **Por que confiar**: 8 anos, parceria Anthropic, NDA, 2 trocas de escopo.
7. **Diagnóstico gratuito** (a chamada única) com o momento interativo.
8. **Rodapé** com a assinatura completa (wordmark + INTELLIGENCE SOLUTIONS).

Formulário: modal existente, envia para /api/contact (Resend), sucesso real.

**Momento interativo:** na seção do diagnóstico, segurar o Q desenha o arco (que nunca fecha, regra do manual) e solta a barra embaixo: "a pergunta encontra a resposta". Soltar cedo desfaz suave; movimento reduzido mostra o estado final. O botão de agendar funciona sempre, sem depender do gesto.

## 7. Camada vetorial

- **Assinatura: o traço cortado.** Divisórias de 1,5px com um corte deliberado, que se traçam no scroll. Se fossem removidas, a página perderia a ligação com o wordmark.
- O Q do manual como motivo: no assentamento do hero, no momento interativo e no favicon.
- Ambiente fixo: brilho verde-água vindo do canto inferior esquerdo, derivando em ciclo de 60s, mais grão leve.

## 8. Engenharia

Tudo de `pipeline-scrub.md`: Blob com anel e watchdog, interpolação normalizada por dt, seeks travados, DOM só na mudança, faixas em vh com smoothstep, legibilidade em 4 camadas, 5 portões ao vivo, completo sem vídeo. Enquanto o vídeo não existir, o mesmo motor de progresso desenha o "ruído ao sinal" em canvas; com o vídeo, o canvas vira recuo.

## 9. Gate de texto

Zero travessões e zero palavras de estoque (alavancar, robusto, empoderar, destravar, acionável, orientado a dados, soluções, sinergia, escalável) no HTML voltado ao visitante. Exceção da marca: o descritor SOLUTIONS vive dentro do SVG oficial.

## 10. Filmagem aprovada (10/10/2026)

- Quadro inicial: GPT Image 2.5, 2k, 16:9 (job 122cc322). Quadro final: mesma ferramenta, com o inicial como referência (job 49a8a51f).
- Vídeo: Seedance 1.5 Pro, 1080p, 8 s, sem áudio, início e fim travados (job a8a46b57). O v1 (só início travado) foi rejeitado no gate: virou "hiperespaço" e não descansava.
- Fases medidas: 0 a 2 s ruído; 1,5 a 3 s os fios formam um arco aberto (eco do Q); 4 a 6 s a luz despenca na linha; 6,5 a 8 s repouso.
- Linha do horizonte a 76,1% da altura do quadro; o JS recalcula a posição para o corte "cover" de cada tela e pousa a barra do Q sobre ela.
- Encode: 1728px, crf 25, `-g 8`, sem áudio, 6,6 MB (`public/assets/hero/hero-scrub.mp4`). Pôster e quadro final extraídos do encode.
- Brutos e cópias de revisão em `_producao/` (fora do git e do container).

## 11. Revisão do topo (10/10/2026): a fila do dia

O vídeo "do ruído ao sinal" foi retirado depois da prévia: falava de tecnologia, não do empresário, e o brilho atrapalhava a leitura dos títulos. Arquivos guardados em `_producao/descartado/`.

- Pesquisa: Sebrae (grupos de discussão, maio 2026: tempo perdido em tarefas repetitivas e cansativas; WhatsApp como maior fonte de interrupção; "tudo passa por mim") e Nu Empresas com Bridge Research (julho 2026, 1.200 empresários: 9 h por semana com burocracia financeira).
- Título: "O trabalho repetitivo da sua empresa, feito por uma IA." Subtítulo: "Automação com IA para todos os tipos de negócios."
- Visual: cartão "A fila do seu dia" com 6 tarefas (WhatsApp, notas fiscais, recebimentos de Pix, cartão e boleto, cobranças, planilha de estoque, relatório do mês). O scroll risca cada uma, marca com o Q e o selo "Valiqon IA", e o contador sobe até 9h por semana de volta (fonte citada no cartão). No fim, "Tudo em dia." com o Q desenhado.
- Fundo: gradiente da marca, sem vídeo. Hero fixado por 250vh. Celular: a fila se resolve sozinha uma vez ao aparecer. Movimento reduzido: estado final.
- Custo em créditos do Higgsfield: zero.

## 12. Topo em fluxograma (10/10/2026)

A lista virou fluxograma, a pedido: "tudo passa pelo Q". As 6 tarefas entram pela esquerda, convergem no Q (Valiqon IA) e saem resolvidas à direita (Respondidas na hora, Notas emitidas, Recebimentos conferidos, Atrasados cobrados, Estoque atualizado, Relatório pronto). Os fios são medidos das caixas reais em JS (ResizeObserver) e o scroll faz o pulso ir da entrada ao Q e do Q à saída, uma tarefa por vez; o Q brilha quando um pulso passa; contador até 9h. Em telas estreitas o fluxo fica vertical (entradas em cima, Q no meio, saídas embaixo) e roda sozinho uma vez quando o topo do fluxo passa de 75% da tela.
