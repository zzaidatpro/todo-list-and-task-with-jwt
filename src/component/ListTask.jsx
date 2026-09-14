import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice';
import { Task } from './Task';

export function ListTask() {
  const dispatch = useDispatch();
  const { items: tasks, status } = useSelector((state) => state.tasks);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'DONE') return task.status === 'terminée';
    if (filter === 'NOT_DONE') return task.status === 'en cours';
    return true;
  });

  const getFilterBtnClass = (currentFilter) => {
    const isActive = filter === currentFilter;
    return `px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
      isActive
        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;
  };

  if (status === 'loading') {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
        Chargement des tâches...
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex justify-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={getFilterBtnClass('ALL')}
        >
          Toutes
        </button>
        <button
          type="button"
          onClick={() => setFilter('DONE')}
          className={getFilterBtnClass('DONE')}
        >
          Terminées
        </button>
        <button
          type="button"
          onClick={() => setFilter('NOT_DONE')}
          className={getFilterBtnClass('NOT_DONE')}
        >
          En cours
        </button>
      </div>

      <div className="space-y-2 min-h-[80px]">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
          ))
        ) : (
          <p className="text-center text-slate-400 dark:text-slate-500 py-6 italic text-sm">
            Aucune tâche trouvée !
          </p>
        )}
      </div>
    </div>
  );
}

export default ListTask;
