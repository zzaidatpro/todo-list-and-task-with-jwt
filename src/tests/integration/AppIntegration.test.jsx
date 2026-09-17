import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react me-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Import du reducer et du composant App
import taskReducer from './taskSlice';
import App from './App';

// Fonction utilitaire pour rendre un composant entouré par le Provider Redux
const renderWithRedux = (
  component,
  {
    initialState,
    store = configureStore({
      reducer: { task: taskReducer },
      preloadedState: { task: initialState }
    })
  } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store
  };
};

describe('Tests d intégration du composant App', () => {

  // Égalise le localStorage ou les mocks globaux avant chaque test si nécessaire
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('doit afficher correctement le composant App avec l état initial', () => {
    const initialState = {
      items: [],
      filter: 'ALL',
      status: 'idle',
      error: null
    };

    renderWithRedux(<App />, { initialState });

    // Vérifie qu'un élément clé ou titre existe dans App
    // Adaptez les query texts selon votre template exact (ex: titre, placeholder d'input, etc.)
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('doit afficher la liste des tâches présente dans le store Redux', () => {
    const initialState = {
      items: [
        { _id: '1', title: 'Acheter du pain', status: 'en cours' },
        { _id: '2', title: 'Faire du sport', status: 'terminée' }
      ],
      filter: 'ALL',
      status: 'succeeded',
      error: null
    };

    renderWithRedux(<App />, { initialState });

    // Vérifie que les tâches sont visibles à l'écran
    expect(screen.getByText('Acheter du pain')).toBeInTheDocument();
    expect(screen.getByText('Faire du sport')).toBeInTheDocument();
  });

  test('doit afficher un message d erreur si l état status est "failed"', () => {
    const initialState = {
      items: [],
      filter: 'ALL',
      status: 'failed',
      error: 'Erreur lors du chargement des tâches'
    };

    renderWithRedux(<App />, { initialState });

    // Vérifie qu'un message ou conteneur d'erreur apparaît si prévu dans App.jsx
    expect(screen.getByText(/Erreur lors du chargement/i)).toBeInTheDocument();
  });

  test('doit permettre de saisir une nouvelle tâche dans l input', () => {
    const initialState = {
      items: [],
      filter: 'ALL',
      status: 'idle',
      error: null
    };

    renderWithRedux(<App />, { initialState });

    // Récupération du champ de saisie (adaptez le placeholder selon votre App.jsx)
    const input = screen.getByPlaceholderText(/ajouter/i) || screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Nouvelle tâche de test' } });

    expect(input.value).toBe('Nouvelle tâche de test');
  });

});