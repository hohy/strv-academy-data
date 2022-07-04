export async function delay({ start = null, duration = 0 }): Promise<void> {
  const elapsed = start ? Date.now() - start : 0
  const pause = duration - elapsed

  if (pause <= 0) {
    return
  }

  await new Promise(resolve => setTimeout(resolve, pause).unref())
}
