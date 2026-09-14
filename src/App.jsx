import { useState } from 'react';
import { AddTask } from './component/AddTask';
import { ListTask } from './component/ListTask';
import { NewPerson } from './component/NewPerson';
import { ThemeToggle } from './component/ThemeToggle';

import './App.css';
import { Footer } from './component/footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  
  // États pour les tests des routes Persons
  const [personsList, setPersonsList] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [searchFood, setSearchFood] = useState('hamburger');
  const [apiResult, setApiResult] = useState(null);

  
  // 1. GET: Récupérer toutes les personnes (Model.find)
  const handleGetAllPersons = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/persons');
      const data = await res.json();
      setPersonsList(data);
      setApiResult({ type: 'success', data });
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  // 2. GET: Trouver par plat favori (Model.findOne)
  const handleFindByFood = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/persons/food/${encodeURIComponent(searchFood)}`);
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  // 3. PUT: Ajouter "hamburger" (push, markModified, save)
  const handleAddHamburger = async () => {
    if (!selectedId) {
      alert("Veuillez renseigner ou sélectionner un ID de personne !");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/persons/${selectedId}/add-hamburger`, {
        method: 'PUT',
      });
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
      handleGetAllPersons();
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  // 4. POST: Insertion multiple (Model.create) avec profils algériens, français et américains
  const handleCreateMany = async () => {
    const sampleData = [
      {
        nom: "Benali",
        prenom: "Karim",
        dateNaissance: "1988-05-14",
        adresse: { num: "12", rue: "Rue Didouche Mourad", codePostal: "16001", ville: "Alger", pays: "Algérie" },
        email: "karim.benali@test.com",
        hobbies: ["football", "photographie", "voyage"],
        platsFavoris: ["couscous", "chakhchoukha"],
        description: "Ingénieur réseau passionné par les technologies cloud."
      },
      {
        nom: "Kaci",
        prenom: "Yasmina",
        dateNaissance: "1992-11-20",
        adresse: { num: "45", rue: "Boulevard Zighout Youcef", codePostal: "31000", ville: "Oran", pays: "Algérie" },
        email: "yasmina.kaci@test.com",
        hobbies: ["lecture", "randonnée", "peinture"],
        platsFavoris: ["rechta", "pizza", "salade"],
        description: "Développeuse front-end amatrice d'art."
      },
      {
        nom: "Meziane",
        prenom: "Mehdi",
        dateNaissance: "1990-03-08",
        adresse: { num: "8", rue: "Rue de la République", codePostal: "75001", ville: "Paris", pays: "France" },
        email: "mehdi.meziane@test.com",
        hobbies: ["cinéma", "running", "technologie"],
        platsFavoris: ["croissant", "entrecôte"],
        description: "Architecte logiciel vivant à Paris."
      },
      {
        nom: "Amrani",
        prenom: "Tarek",
        dateNaissance: "1985-12-02",
        adresse: { num: "742", rue: "Evergreen Terrace", codePostal: "97401", ville: "Springfield", pays: "États-Unis" },
        email: "tarek.amrani@test.com",
        hobbies: ["basketball", "gaming", "voyage"],
        platsFavoris: ["burger", "pizza", "barbecue"],
        description: "Administrateur système installé aux États-Unis."
      }
    ];

    try {
      const res = await fetch('http://localhost:5000/api/persons/many', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleData)
      });
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
      handleGetAllPersons();
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  // 5. DELETE: Supprimer une personne
  const handleDeletePerson = async () => {
    if (!selectedId) {
      alert("Veuillez renseigner un ID de personne à supprimer !");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/persons/${selectedId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
      setSelectedId('');
      handleGetAllPersons();
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };


// 8. PUT: Mettre à jour l'âge à 20 ans par le nom
  const handleUpdateAgeByName = async () => {
    const nameToUpdate = prompt("Entrez le nom de la personne dont l'âge doit passer à 20 ans :");
    if (!nameToUpdate) return;
    try {
      const res = await fetch(`http://localhost:5000/api/persons/update-age/${encodeURIComponent(nameToUpdate)}`, {
        method: 'PUT',
      });
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
      handleGetAllPersons();
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  // 9. DELETE: Supprimer une personne par son ID
  const handleDeleteById = async () => {
    if (!selectedId) {
      alert("Veuillez sélectionner ou renseigner un ID de personne dans le champ dédié !");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/persons/remove-by-id/${selectedId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
      setSelectedId('');
      handleGetAllPersons();
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  // 10. DELETE: Supprimer toutes les personnes nommées "Mary"
  const handleRemoveMary = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer toutes les personnes nommées Mary ?")) return;
    try {
      const res = await fetch('http://localhost:5000/api/persons/remove-mary', {
        method: 'DELETE',
      });
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
      handleGetAllPersons();
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  // 11. GET: Chaîner les requêtes (Fans de burritos triés, limités, sans l'âge)
  const handleSearchBurritos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/persons/search/burritos');
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* En-tête avec titre et bouton de thème */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            NodeJS VS Mongoose <span className="text-blue-600 dark:text-blue-400 font-extrabold">(MongoDB)</span> with ReactDOM
          </h1>
          <ThemeToggle />
        </div>

        {/* Barre de navigation entre les sections */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Gestion des Tâches
          </button>
          <button
            onClick={() => setActiveTab('persons')}
            className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
              activeTab === 'persons'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Gestion des Profils (Personnes)
          </button>
        </div>

        {/* Contenu conditionnel selon l'onglet actif */}
        {activeTab === 'tasks' ? (
          <div>
            <AddTask />
            <ListTask />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <NewPerson />

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-3">Panneau de Test des Routes Mongoose</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="ID de la personne (pour supprimer par ID)"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Plat recherché"
                  value={searchFood}
                  onChange={(e) => setSearchFood(e.target.value)}
                  className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Boutons de test regroupés */}
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Routes de base */}
                <button
                  type="button"
                  onClick={handleGetAllPersons}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Afficher la liste
                </button>
                <button
                  type="button"
                  onClick={handleFindByFood}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Chercher par plat
                </button>
                <button
                  type="button"
                  onClick={handleCreateMany}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Ajouter des exemples
                </button>
                <button
                  type="button"
                  onClick={handleAddHamburger}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Ajouter Hamburger
                </button>
                <button
                  type="button"
                  onClick={handleDeletePerson}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Supprimer
                </button>

                {/* Nouvelles routes (8, 9, 10, 11) */}
                <button
                  type="button"
                  onClick={handleUpdateAgeByName}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Fixer âge à 20 ans (Nom)
                </button>
                <button
                  type="button"
                  onClick={handleDeleteById}
                  className="px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Supprimer par ID
                </button>
                <button
                  type="button"
                  onClick={handleRemoveMary}
                  className="px-3 py-2 bg-red-900 hover:bg-red-950 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Supprimer nom = "Mary"
                </button>
                <button
                  type="button"
                  onClick={handleSearchBurritos}
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Chaîne (Burritos)
                </button>
              </div>

              {personsList.length > 0 && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Personnes en base (Cliquez sur un ID pour le sélectionner) :</span>
                  <div className="max-h-28 overflow-y-auto flex flex-col gap-1">
                    {personsList.map(p => (
                      <div key={p._id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-1.5 rounded border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{p.prenom} {p.nom} (Âge: {p.age ?? 'N/A'})</span>
                        <button 
                          type="button"
                          onClick={() => setSelectedId(p._id)}
                          className="text-blue-500 hover:underline font-mono cursor-pointer"
                        >
                          {p._id}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {apiResult && (
  <div className="p-4 bg-slate-900 text-slate-200 font-sans text-xs rounded-xl max-h-80 overflow-y-auto border border-slate-700 shadow-inner flex flex-col gap-3">
    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
      <span className="text-slate-400 font-mono text-[11px]">// Résultat de l'API :</span>
      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
        apiResult.type === 'error' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
      }`}>
        {apiResult.type === 'error' ? 'Erreur' : 'Succès'}
      </span>
    </div>

    {/* Cas 1 : Erreur ou message simple */}
    {apiResult.type === 'error' || apiResult.message ? (
      <div className="text-rose-400 bg-rose-950/30 p-2.5 rounded border border-rose-900/50">
        {apiResult.message || JSON.stringify(apiResult)}
      </div>
    ) : null}

    {/* Cas 2 : Résultat d'une suppression multiple (ex: deleteMany pour Mary) */}
    {(apiResult.data?.deletedCount !== undefined || apiResult.deletedCount !== undefined) && (
      <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-300 p-3 rounded-lg border border-emerald-900/50">
        <span className="text-base">🗑️</span>
        <div>
          <p className="font-semibold">Opération de suppression réussie</p>
          <p className="text-slate-400 text-[11px]">
            Nombre d'éléments supprimés : <strong className="text-emerald-400">{apiResult.data?.deletedCount ?? apiResult.deletedCount}</strong>
          </p>
        </div>
      </div>
    )}

    {/* Cas 3 : Liste de personnes (Tableau) */}
    {Array.isArray(apiResult.data || apiResult) && (apiResult.data || apiResult).length > 0 && (
      <div className="flex flex-col gap-2">
        <span className="text-slate-400 font-semibold">{(apiResult.data || apiResult).length} résultat(s) trouvé(s) :</span>
        <div className="grid grid-cols-1 gap-2">
          {(apiResult.data || apiResult).map((p, index) => (
            <div key={p._id || index} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100 text-sm">
                  {p.prenom} {p.nom} {p.age !== undefined && <span className="text-blue-400 font-normal">({p.age} ans)</span>}
                </span>
                <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">ID: {p._id}</span>
              </div>
              {p.email && <div className="text-slate-300 text-[11px]">✉️ {p.email}</div>}
              {p.platsFavoris && p.platsFavoris.length > 0 && (
                <div className="text-slate-400 text-[11px]">🍽️ Plats : {p.platsFavoris.join(', ')}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Cas 4 : Objet unique (Création ou Mise à jour d'une personne) */}
    {(!Array.isArray(apiResult.data || apiResult) && !(apiResult.data?.deletedCount || apiResult.deletedCount) && !apiResult.message && apiResult.type !== 'error') && (
      <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 flex flex-col gap-1.5">
        <div className="text-emerald-400 font-semibold text-xs">✨ Document mis à jour / enregistré :</div>
        <div className="text-slate-100 text-sm font-medium">
          {((apiResult.data || apiResult).prenom)} {((apiResult.data || apiResult).nom)}
        </div>
        <div className="text-slate-300 text-xs grid grid-cols-2 gap-1 mt-1">
          {Object.entries(apiResult.data || apiResult).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) return null; // Ignore les objets imbriqués pour faire simple
            return (
              <div key={key} className="truncate">
                <span className="text-slate-500">{key}:</span> {String(value)}
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Option de secours : Si le format est atypique, on garde le JSON replié proprement */}
    <details className="mt-1 text-[11px] text-slate-500">
      <summary className="cursor-pointer hover:text-slate-400">Voir le JSON brut complet</summary>
      <pre className="mt-2 p-2 bg-slate-950 rounded text-emerald-400 overflow-x-auto">
        {JSON.stringify(apiResult.data || apiResult, null, 2)}
      </pre>
    </details>
  </div>
)}
            </div>
          </div>
        )}

      </div>
   <Footer />
    </div>

     
 
  );
  
}