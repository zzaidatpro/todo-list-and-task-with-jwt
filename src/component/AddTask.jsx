import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskSlice';

export function AddTask() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perso');
  const [responsible, setResponsible] = useState('');
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState('jours');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() !== '') {
      dispatch(addTask({
        title : title.trim(),
        category : category,
        responsible : responsible,
       duration: {
        value: Number(durationValue), // <--- Envoie la valeur de durée saisie
        unit: durationUnit            // <--- Envoie l'unité (jours ou heures)
      }
      }));
      setTitle('');
      setResponsible('');
      
     setDurationValue(1);
     setDurationUnit('jours');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-2xl mx-auto my-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      
      {/* Ligne 1 : Champ principal de la tâche */}
      <input
        type="text"
        placeholder="Nouvelle tâche..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />

      {/* Ligne 2 : Options (Grille responsive 3 colonnes) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        
        {/* Choix de la catégorie */}
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Perso">Perso</option>
          <option value="Affaires">Affaires</option>
          <option value="Sport">Sport</option>
        </select>

        {/* Personne responsable */}
        <input
          type="text"
          placeholder="Responsable (Nom Prénom)"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Durée (Valeur + Unité) */}
        <div className="flex gap-1">
          <input
            type="number"
            min="1"
            value={durationValue}
            onChange={(e) => setDurationValue(Number(e.target.value))}
            className="w-1/2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value)}
            className="w-1/2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="heures">heures</option>
            <option value="jours">jours</option>
          </select>

        </div>
      </div>

      {/* Bouton d'ajout aligné */}
      <button
        type="submit"
        className="w-full py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.99] transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ajouter la tâche
      </button>
    </form>
  );
}

export default AddTask;