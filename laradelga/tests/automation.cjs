const { _electron: electron } = require('playwright');

async function automation () {
  const electronApp = await electron.launch({ args: ['.'] });
  const window = await electronApp.firstWindow();

  // Login inicial
  await window.getByRole('textbox', { name: 'Matrícula:' }).fill('22065');
  await window.getByRole('textbox', { name: 'Senha:' }).fill('teste');
  await window.getByRole('button', { name: 'Entrar' }).click();

  // Aguarda a próxima tela
  await window.waitForSelector('input[name="matricula"]');
  await window.getByRole('textbox', { name: 'Ex: LOT001234' }).fill('55454');
  await window.getByRole('button', { name: 'Confirmar' }).click();

  // Função para repetir passos
  async function executarPassos() {
    await window.getByRole('button', { name: 'SOLAMAX' }).click();
    await window.locator('div').filter({ hasText: /^Base =$/ }).getByRole('textbox').fill('3.25');
    await window.locator('div').filter({ hasText: /^Base =$/ }).getByRole('textbox').press('Enter');
    await window.locator('div').filter({ hasText: /^Adição =$/ }).getByRole('textbox').fill('3.00');
    await window.locator('div').filter({ hasText: /^Adição =$/ }).getByRole('textbox').press('Enter');
    await window.getByRole('button', { name: '⬅⬅⬅ L ⬅⬅⬅' }).click();
    await window.getByRole('button', { name: 'SET' }).click();
    await window.getByRole('button', { name: 'Imprimir Etiqueta' }).click();

    // Espera pelo texto "Resultados" visível na tela
    await window.waitForSelector('text=Resultados', { timeout: 5000 });
  }

  while (true) {
    try {
      await executarPassos();
    } catch (e) {
      console.error('Erro ao executar passo:', e.message);
    }

    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  // nunca chega aqui, mas caso precise fechar:
  // await electronApp.close();
}

module.exports = {automation}
