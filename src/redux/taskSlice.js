import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api/todos';

const getAuthHeaders = (getState) => {
  const token = localStorage.getItem('token') || getState()?.auth?.token || getState()?.auth?.user?.token;
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const fetchTasks = createAsyncThunk('task/fetchTasks', async (_, thunkAPI) => {
  const response = await fetch(API_URL, { headers: getAuthHeaders(thunkAPI.getState()) });
  if (!response.ok) throw new Error('Erreur lors du chargement des tâches');
  return await response.json();
});

export const addTask = createAsyncThunk('task/addTask', async (taskData, thunkAPI) => {
  const basePayload = typeof taskData === 'string' ? { title: taskData } : taskData;
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
    subTasks: basePayload.subTasks || []
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(thunkAPI.getState()),
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
  'task/toggleTaskStatus',
  async ({ id, currentStatus }, thunkAPI) => {
    const newStatus = currentStatus === 'terminée' ? 'en cours' : 'terminée';
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(thunkAPI.getState()), // <--- Ajouté ici
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');
    return await response.json();
  }
);

export const deleteTask = createAsyncThunk('task/deleteTask', async (id, thunkAPI) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(thunkAPI.getState()),
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression');
  return id;
});

export const updateTask = createAsyncThunk('task/updateTask', async ({ id, title }, thunkAPI) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(thunkAPI.getState()),
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Erreur lors de la modification');
  return await response.json();
});

const taskSlice = createSlice({
  name: 'task',
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
    deleteTask: (state) => {
      state.items = [];
    },
    deleteAllDoneTask: (state) => {
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

export const { setFilter, deleteAllTask, deleteAllDoneTask } = taskSlice.actions;

export default taskSlice.reducer;