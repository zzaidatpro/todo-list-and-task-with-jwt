import { test, expect, describe } from 'vitest';
import taskReducer, { 
  fetchTasks, 
  addTask, 
  toggleTaskStatus, 
  deleteTask, 
  setFilter 
} from './taskSlice';

describe('Tests du Reducer taskSlice (Version MongoDB / AsyncThunk)', () => {

  // 1. État par défaut de Redux
  test('doit retourner l état initial par défaut si aucun state n est fourni', () => {
    const nextState = taskReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    expect(nextState).toBeDefined();
    expect(nextState.items).toEqual([]);
    expect(nextState.filter).toBe('ALL');
    expect(nextState.status).toBe('idle');
  });

  // 2. Récupération des tâches (fetchTasks.fulfilled)
  test('doit charger la liste des tâches (fetchTasks.fulfilled)', () => {
    const initialState = { items: [], status: 'loading', error: null };
    const mockTasks = [
      { _id: '1', title: 'Tâche 1', status: 'en cours' },
      { _id: '2', title: 'Tâche 2', status: 'terminée' }
    ];

    const nextState = taskReducer(
      initialState, 
      fetchTasks.fulfilled(mockTasks, 'requestId')
    );

    expect(nextState.status).toBe('succeeded');
    expect(nextState.items).toHaveLength(2);
    expect(nextState.items[0]._id).toBe('1');
  });

  // 3. Ajout de tâche (addTask.fulfilled)
  test('doit ajouter une tâche retournée par MongoDB (addTask.fulfilled)', () => {
    const initialState = { items: [], status: 'succeeded', error: null };
    const newMongoTask = { _id: '123', title: 'Acheter du pain', status: 'en cours' };

    const nextState = taskReducer(
      initialState, 
      addTask.fulfilled(newMongoTask, 'requestId', { title: 'Acheter du pain' })
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].title).toBe('Acheter du pain');
    expect(nextState.items[0].status).toBe('en cours');
  });

  // 4. Bascule du statut (toggleTaskStatus.fulfilled)
  test('doit mettre à jour le statut de la tâche (toggleTaskStatus.fulfilled)', () => {
    const initialState = {
      items: [{ _id: '123', title: 'Tester Redux', status: 'en cours' }]
    };
    const updatedMongoTask = { _id: '123', title: 'Tester Redux', status: 'terminée' };

    const nextState = taskReducer(
      initialState, 
      toggleTaskStatus.fulfilled(updatedMongoTask, 'requestId', { id: '123', currentStatus: 'en cours' })
    );

    expect(nextState.items[0].status).toBe('terminée');
  });

  // 5. Suppression de tâche (deleteTask.fulfilled)
  test('doit supprimer une tâche par son _id (deleteTask.fulfilled)', () => {
    const initialState = {
      items: [
        { _id: '101', title: 'Tâche 1', status: 'en cours' },
        { _id: '102', title: 'Tâche 2', status: 'terminée' }
      ]
    };

    const nextState = taskReducer(
      initialState, 
      deleteTask.fulfilled('101', 'requestId', '101')
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]._id).toBe('102');
  });

  // 6. Changement du filtre d'affichage (setFilter - Reducer synchrone)
  test('doit mettre à jour le filtre actif (setFilter)', () => {
    const initialState = { items: [], filter: 'ALL' };

    const nextState = taskReducer(initialState, setFilter('DONE'));

    expect(nextState.filter).toBe('DONE');
  });

});