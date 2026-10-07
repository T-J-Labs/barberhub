// HTML SSR pode estar visível antes de os recursos de hidratação terminarem.
// As jornadas aqui exercitam a página preparada, sem clicar no HTML ainda inerte.
async function navigate(page, ...args) {
  const response = await page.goto(...args);
  await page.waitForLoadState('networkidle');
  return response;
}
async function reload(page, ...args) {
  const response = await page.reload(...args);
  await page.waitForLoadState('networkidle');
  return response;
}
async function waitForURL(page, ...args) {
  await page.waitForURL(...args);
  await page.waitForLoadState('networkidle');
}
module.exports = { navigate, reload, waitForURL };
