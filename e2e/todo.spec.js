import { test, expect } from '@playwright/test';

function createMockApi() {
  const tasks = new Map();
  let idCounter = 0;

  return async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const id = url.pathname.split('/').pop();

    if (method === 'GET' && url.pathname.endsWith('/api/todos')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([...tasks.values()]),
      });
      return;
    }

    if (method === 'POST' && url.pathname.endsWith('/api/todos')) {
      // Récupération de toutes les nouvelles données envoyées par le formulaire
      const { title, category, responsible, duration, dueDate, createdAt } = JSON.parse(route.request().postData());
      const task = {
        _id: `mock-id-${++idCounter}`,
        title,
        category: category || 'Perso',
        responsible: responsible || '',
        duration: duration || { value: 1, unit: 'jours' },
        dueDate: dueDate || new Date(),
        createdAt: createdAt || new Date(),
        status: 'en cours',
      };
      tasks.set(task._id, task);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(task),
      });
      return;
    }

    if (method === 'PUT' && url.pathname.includes('/api/todos/')) {
      const putData = JSON.parse(route.request().postData() || '{}');
      const existing = tasks.get(id);
      if (!existing) {
        await route.fulfill({ status: 404, body: '{}' });
        return;
      }
      const updated = { ...existing, ...putData };
      tasks.set(id, updated);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(updated),
      });
      return;
    }

    if (method === 'DELETE' && url.pathname.includes('/api/todos/')) {
      tasks.delete(id);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.continue();
  };
}

test.describe('E2E - Application Todo Redux', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/todos**', createMockApi());
    await page.goto('/');
  });

  test('1. Doit afficher l\'interface initiale et les filtres', async ({ page }) => {
    await expect(page.getByPlaceholder('Nouvelle tâche...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toutes', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Terminées', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'En cours', exact: true })).toBeVisible();
  });

  test('2. Doit ajouter une tâche et réinitialiser l\'input', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Test Integration - Unitaire - E2E');
    // Le texte du bouton est devenu "Ajouter la tâche"
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    await expect(page.getByText('Test Integration - Unitaire - E2E')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('3. Ne doit pas ajouter de tâche vide', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('   ');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    await expect(page.getByText('Aucune tâche trouvée !')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
  });

  test('4. Doit marquer une tâche comme terminée', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche à cocher');
    // Si on fait press('Enter') sur l'input, cela soumet le formulaire s'il y a un gestionnaire, 
    // mais le clic sur le bouton "Ajouter la tâche" est plus sûr vu la structure.
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    const checkbox = page.getByRole('checkbox').first();
    await checkbox.click();

    await expect(checkbox).toBeChecked();
  });

  test('5. Doit éditer le texte d\'une tâche existante', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Ancien texte');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    const taskCard = page.locator('div').filter({ hasText: /^Ancien texte/ }).first();
    await taskCard.getByRole('button', { name: 'Modifier', exact: true }).click();

    const editInput = page.locator('input[type="text"]').last();
    await editInput.fill('Texte mis à jour');
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    await expect(page.getByText('Texte mis à jour')).toBeVisible();
    await expect(page.getByText('Ancien texte')).not.toBeVisible();
  });

  test('6. Doit supprimer une tâche spécifique', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche à supprimer');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    const taskCard = page.locator('div').filter({ hasText: /^Tâche à supprimer/ }).first();
    await taskCard.getByRole('button', { name: 'Supprimer', exact: true }).click();

    await expect(page.getByText('Tâche à supprimer')).not.toBeVisible();
  });

  test('7. Doit filtrer les tâches (Toutes / Terminées / En cours)', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');

    await input.fill('Tâche A (En cours)');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    await input.fill('Tâche B (Terminée)');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    const taskB = page.locator('div').filter({ hasText: /^Tâche B \(Terminée\)/ }).first();
    await taskB.getByRole('checkbox').click();

    await page.getByRole('button', { name: 'En cours', exact: true }).click();
    await expect(page.getByText('Tâche A (En cours)')).toBeVisible();
    await expect(page.getByText('Tâche B (Terminée)')).not.toBeVisible();

    await page.getByRole('button', { name: 'Terminées', exact: true }).click();
    await expect(page.getByText('Tâche A (En cours)')).not.toBeVisible();
    await expect(page.getByText('Tâche B (Terminée)')).toBeVisible();

    await page.getByRole('button', { name: 'Toutes', exact: true }).click();
    await expect(page.getByText('Tâche A (En cours)')).toBeVisible();
    await expect(page.getByText('Tâche B (Terminée)')).toBeVisible();
  });

  test('8. Doit conserver les tâches après rechargement de page (F5)', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche persistante');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    await expect(page.getByText('Tâche persistante')).toBeVisible();
    await page.reload();
    await expect(page.getByText('Tâche persistante')).toBeVisible();
  });

  test('9. Doit supprimer plusieurs tâches une par une', async ({ page }) => {
    const input = page.getByPlaceholder('Nouvelle tâche...');
    await input.fill('Tâche 1');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    await input.fill('Tâche 2');
    await page.getByRole('button', { name: 'Ajouter la tâche', exact: true }).click();

    await page.getByRole('button', { name: 'Supprimer', exact: true }).first().click();
    await page.getByRole('button', { name: 'Supprimer', exact: true }).first().click();

    await expect(page.getByText('Aucune tâche trouvée !')).toBeVisible();
  });
});