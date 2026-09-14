import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTaskStatus, deleteTask, updateTask } from '../redux/taskSlice';

export function Task({ task }) {
  const dispatch = useDispatch();

  const isCompleted = task.status === 'terminée';

  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.title || '');

  const handleToggle = () => {
    dispatch(toggleTaskStatus({ id: task._id, currentStatus: task.status }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

  const handleSave = () => {
    if (newText.trim() !== '' && newText.trim() !== task.title) {
      dispatch(updateTask({ id: task._id, title: newText.trim() }));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewText(task.title);
    setIsEditing(false);
  };

  // Couleurs dynamiques selon la catégorie
  const categoryColors = {
    Sport: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800',
    Affaires: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    Perso: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  const formattedDate = task.createdAt 
    ? new Date(task.createdAt).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border transition-all ${
      isCompleted 
        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70' 
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600'
    }`}>
      
      {/* LIGNE SUPÉRIEURE : Badge Catégorie et Durée / Infos secondaires */}
      <div className="flex items-center justify-between text-xs">
        {task.category && (
          <span className={`px-2 py-0.5 rounded-full font-medium border ${categoryColors[task.category] || 'bg-slate-100 text-slate-800'}`}>
            {task.category}
          </span>
        )}
        
        {task.duration && task.duration.value && (
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            ⏱️ {task.duration.value} {task.duration.unit || 'jours'}
          </span>
        )}
      
       {formattedDate && (
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
            📅 Ajouté le {formattedDate}
          </span>
        )}
        </div>
      {/* LIGNE PRINCIPALE : Checkbox + Titre (ou input d'édition) + Boutons d'action */}
      <div className="flex items-center justify-between gap-2">
        
        {/* SECTION GAUCHE : Case à cocher + Texte ou Champ de saisie */}
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleToggle}
            className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-blue-500 cursor-pointer"
          />

          {isEditing ? (
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              autoFocus
              className="flex-1 px-2 py-1 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-blue-400 dark:border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex flex-col min-w-0">
              <span className={`text-sm truncate select-none ${
                isCompleted 
                  ? 'line-through text-slate-400 dark:text-slate-500' 
                  : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}>
                {task.title}
              </span>
              
              {/* Affichage du responsable si présent */}
              {task.responsible && (
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  👤 {task.responsible}
                </span>
              )}
            </div>
          )}
        </div>

        {/* SECTION DROITE : Boutons d'action */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isEditing ? (
            <>
              <button 
                type="button"
                onClick={handleSave}
                className="px-2.5 py-1 text-xs font-medium text-white bg-green-600 dark:bg-green-500 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer"
              >
                Enregistrer
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1 text-xs font-medium text-white bg-rose-600 dark:bg-rose-500 rounded hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors cursor-pointer"
              >
                Supprimer
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </>
          ) : (
            <>
              <button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                Modifier
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 rounded hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Task;