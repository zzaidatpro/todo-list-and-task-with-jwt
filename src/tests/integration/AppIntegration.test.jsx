import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../../redux/taskSlice';
import App from '../../App';

const renderWithRedux = (ui) => {
  const testStore = configureStore({
    reducer: { tasks: tasksReducer },
  });
  return render(<Provider store={testStore}>{ui}</Provider>);
};

describe('Test d intégration App', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn((_url, options) => {
      if (!options || options.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (options.method === 'POST') {
        const body = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              _id: 'mock-id-123',
              title: body.title,
              status: 'en cours',
            }),
        });
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('l utilisateur ajoute une tâche et elle s affiche dans la liste', async () => {
    const user = userEvent.setup();

    renderWithRedux(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /ajouter/i });

    await user.type(input, 'Nouvelle Tâche Redux');
    await user.click(button);

    const newTask = await screen.findByText('Nouvelle Tâche Redux');
    expect(newTask).toBeInTheDocument();
  });
});