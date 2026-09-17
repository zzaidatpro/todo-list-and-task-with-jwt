import { test, expect, describe } from 'vitest';
import taskReducer, {
  fetchTasks,
  addTask,
  toggleTaskStatus,
  deleteTask as deleteTaskThunk,
  updateTask,
  setFilter,
  deleteAllDoneTask,
  deleteAllTask
} from './taskSlice';

describe('Tests du Reducer taskSlice', () => {

  // 1. État initial par défaut
  test('doit retourner l état initial par défaut si aucun state n est fourni', () => {
    const nextState = taskReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(nextState).toEqual({
      items: [],
      filter: 'ALL',
      status: 'idle',
      error: null
    });
  });

  // 2. Tests de fetchTasks (pending, fulfilled, rejected)
  describe('fetchTasks thunk', () => {
    test('doit passer le status à loading lors de fetchTasks.pending', () => {
      const initialState = { items: [], filter: 'ALL', status: 'idle', error: null };
      const nextState = taskReducer(initialState, fetchTasks.pending('requestId'));

      expect(nextState.status).toBe('loading');
    });

    test('doit charger la liste des tâches lors de fetchTasks.fulfilled', () => {
      const initialState = { items: [], filter: 'ALL', status: 'loading', error: null };
      const mockTasks = [
        { _id: '1', title: 'Tâche 1', status: 'en cours' },
        { _id: '2', title: 'Tâche 2', status: 'terminée' }
      ];

      const nextState = taskReducer(
        initialState,
        fetchTasks.fulfilled(mockTasks, 'requestId')
      );

      expect(nextState.status).toBe('succeeded');
      expect(nextState.items).toEqual(mockTasks);
    });

    test('doit enregistrer l erreur lors de fetchTasks.rejected', () => {
      const initialState = { items: [], filter: 'ALL', status: 'loading', error: null };
      const action = {
        type: fetchTasks.rejected.type,
        error: { message: 'Erreur lors du chargement des tâches' }
      };

      const nextState = taskReducer(initialState, action);

      expect(nextState.status).toBe('failed');
      expect(nextState.error).toBe('Erreur lors du chargement des tâches');
    });
  });

  // 3. Ajout de tâche (addTask.fulfilled)
  test('doit ajouter une nouvelle tâche (addTask.fulfilled)', () => {
    const initialState = { items: [], filter: 'ALL', status: 'succeeded', error: null };
    const newTask = {
      _id: '101',
      title: 'Acheter du pain',
      status: 'en cours',
      category: 'Perso'
    };

    const nextState = taskReducer(
      initialState,
      addTask.fulfilled(newTask, 'requestId', { title: 'Acheter du pain' })
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual(newTask);
  });

  // 4. Mettre à jour le statut (toggleTaskStatus.fulfilled)
  test('doit mettre à jour une tâche modifiée via toggleTaskStatus.fulfilled', () => {
    const initialState = {
      items: [
        { _id: '101', title: 'Tâche 1', status: 'en cours' },
        { _id: '102', title: 'Tâche 2', status: 'en cours' }
      ],
      filter: 'ALL',
      status: 'succeeded',
      error: null
    };

    const updatedTask = { _id: '101', title: 'Tâche 1', status: 'terminée' };

    const nextState = taskReducer(
      initialState,
      toggleTaskStatus.fulfilled(updatedTask, 'requestId', { id: '101', currentStatus: 'en cours' })
    );

    expect(nextState.items[0].status).toBe('terminée');
    expect(nextState.items[1].status).toBe('en cours');
  });

  // 5. Modification du titre (updateTask.fulfilled)
  test('doit mettre à jour le titre d une tâche (updateTask.fulfilled)', () => {
    const initialState = {
      items: [{ _id: '101', title: 'Ancien titre', status: 'en cours' }],
      filter: 'ALL',
      status: 'succeeded',
      error: null
    };

    const updatedTask = { _id: '101', title: 'Nouveau titre', status: 'en cours' };

    const nextState = taskReducer(
      initialState,
      updateTask.fulfilled(updatedTask, 'requestId', { id: '101', title: 'Nouveau titre' })
    );

    expect(nextState.items[0].title).toBe('Nouveau titre');
  });

  // 6. Suppression asynchrone (deleteTask.fulfilled)
  test('doit supprimer la tâche spécifiée par son _id (deleteTask.fulfilled)', () => {
    const initialState = {
      items: [
        { _id: '101', title: 'Tâche 1' },
        { _id: '102', title: 'Tâche 2' }
      ],
      filter: 'ALL',
      status: 'succeeded',
      error: null
    };

    const nextState = taskReducer(
      initialState,
      deleteTaskThunk.fulfilled('101', 'requestId', '101')
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]._id).toBe('102');
  });

  // 7. Reducers Synchrones
  describe('Reducers synchrones', () => {
    test('setFilter doit modifier la propriété filter', () => {
      const initialState = { items: [], filter: 'ALL', status: 'idle', error: null };
      const nextState = taskReducer(initialState, setFilter('DONE'));

      expect(nextState.filter).toBe('DONE');
    });

    test('deleteAllDoneTask doit vider uniquement les tâches avec le statut "terminée"', () => {
      const initialState = {
        items: [
          { _id: '1', title: 'Tâche 1', status: 'en cours' },
          { _id: '2', title: 'Tâche 2', status: 'terminée' },
          { _id: '3', title: 'Tâche 3', status: 'terminée' }
        ],
        filter: 'ALL',
        status: 'succeeded',
        error: null
      };

      const nextState = taskReducer(initialState, deleteAllDoneTask());

      expect(nextState.items).toHaveLength(1);
      expect(nextState.items[0]._id).toBe('1');
    });

    test('deleteTask (reducer synchrone) doit réinitialiser le tableau items', () => {
      const initialState = {
        items: [
          { _id: '1', title: 'Tâche 1' },
          { _id: '2', title: 'Tâche 2' }
        ],
        filter: 'ALL',
        status: 'succeeded',
        error: null
      };

      // Exécute l'action synchrone deleteTask créée par le slice
      const nextState = taskReducer(initialState, { type: 'task/deleteTask' });

      expect(nextState.items).toEqual([]);
    });
  });

});