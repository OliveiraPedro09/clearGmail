function cleanGmail() {
  const DAYS = 1; // Idade dos emails para serem excluidos
  const EXCLUSIONS = '-is:starred -label:important'; // não apagar estrelados/importantes

  const QUERIES = [
    `in:spam older_than:${DAYS}d`,
    `category:promotions older_than:${DAYS}d ${EXCLUSIONS}`,
    `category:social older_than:${DAYS}d ${EXCLUSIONS}`,
    `category:updates older_than:${DAYS}d ${EXCLUSIONS}`,
    `category:forums older_than:${DAYS}d ${EXCLUSIONS}`,
  ];

  const BATCH = 100; // processa em lotes
  let total = 0;

  for (const q of QUERIES) {
    let start = 0;
    while (true) {
      const threads = GmailApp.search(q, start, BATCH);
      if (threads.length === 0) break;
      GmailApp.moveThreadsToTrash(threads); // manda para a Lixeira (apaga de vez após 30 dias)
      total += threads.length;
      start += threads.length;
      Utilities.sleep(300); // evita limite de cota
    }
  }

  Logger.log(`Total de conversas enviadas para a Lixeira: ${total}`);
}
