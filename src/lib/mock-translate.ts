// Stand-in for the real translation API. Swap this one function for a
// fetch() call once the backend exists — nothing in the loading flow
// that calls it needs to change.
export async function runTranslation(query: string): Promise<void> {
  void query;
  await new Promise((resolve) => setTimeout(resolve, 5200));
}
