import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api/todos';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Erreur lors du chargement des tâches');
  return await response.json();
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData) => {
  // Si taskData est juste une chaîne de caractères ou un objet partiel, on complète proprement
  const basePayload = typeof taskData === 'string' ? { title: taskData } : taskData;
  console.log("DONNÉES REÇUES DANS LE THUNK :", basePayload);
  const payload = {
    title: basePayload.title,
    status: basePayload.status || 'en cours',
    category: basePayload.category || 'Perso',
    responsible: basePayload.responsible || '',
    duration: {
      value: basePayload.duration?.value || 1,
      unit: basePayload.duration?.unit || 'jours'
    },
    dueDate: basePayload.dueDate || new Date(),
    
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Détail de l'erreur backend :", errorData);
    throw new Error("Erreur lors de l'ajout de la tâche");
  }
  
  return await response.json();
});

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async ({ id, currentStatus }) => {
    const newStatus = currentStatus === 'terminée' ? 'en cours' : 'terminée';
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');
    return await response.json();
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression');
  return id;
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, title }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error('Erreur lors de la modification');
    return await response.json();
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    filter: 'ALL',
    status: 'idle',
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    deleteAllTasks: (state) => {
      state.items = [];
    },
    deleteAllDoneTasks: (state) => {
      state.items = state.items.filter((t) => t.status !== 'terminée');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setFilter, deleteAllTasks, deleteAllDoneTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
