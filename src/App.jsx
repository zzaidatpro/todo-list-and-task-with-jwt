import { useState } from 'react';
import { AddTask } from './component/AddTask';
import { useSelector, useDispatch } from 'react-redux';
import { ListTask } from './component/ListTask';
import { NewPerson } from './component/NewPerson';
import { ThemeToggle } from './component/ThemeToggle';
import AuthForm from './component/AuthForm';
import './App.css';
import { Footer } from './component/footer';
import { logout } from './redux/authSlice';
import { setPersons } from './redux/personSlice';

export default function App() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('tasks');
  const personsList = useSelector((state) => state.persons.list); 
  const [selectedId, setSelectedId] = useState('');
  const [searchFood, setSearchFood] = useState('hamburger');
  const [apiResult, setApiResult] = useState(null);
  
  const [editingPerson, setEditingPerson] = useState(null);
  const [deletingPerson, setDeletingPerson] = useState(null);

  if (!token) {
    return <AuthForm />;
  }

  const getAuthHeaders = (hasBody = false) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  const handleGetAllPersons = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/persons', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la récupération');
      
      dispatch(setPersons(data));
      setApiResult({ type: 'success', data });
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  const handleFindByFood = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/persons/food/${encodeURIComponent(searchFood)}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setApiResult({ type: res.ok ? 'success' : 'error', data });
    } catch (err) {
      setApiResult({ type: 'error', message: err.message });
    }
  };

  const handleUpdatePerson = async (updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/persons/${updatedData._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');
      
      setApiResult({ type: 'success', data });
      setEditingPerson(null);
      handleGetAllPersons();
    } catch (err) {
      alert(`Erreur de modification: ${err.message}`);
    }
  };

  const handleConfirmDelete = async (password) => {
    if (!deletingPerson) return;
    try {
      const res = await fetch(`http://localhost:5000/api/persons/${deletingPerson._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Mot de passe incorrect ou erreur de suppression');

      setApiResult({ type: 'success', data });
      if (selectedId === deletingPerson._id) setSelectedId('');
      setDeletingPerson(null);
      handleGetAllPersons();
    } catch (err) {
      alert(`Échec de la suppression : ${err.message}`);
    }
  };

  const PersonCard = ({ person }) => {
    const adresseFormatted = person.adresse
      ? typeof person.adresse === 'object'
        ? `${person.adresse.num || ''} ${person.adresse.rue || ''}, ${person.adresse.codePostal || ''} ${person.adresse.ville || ''} (${person.adresse.pays || ''})`.trim()
        : String(person.adresse)
      : null;

    return (
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between h-full shadow-md hover:border-blue-500/50 transition">
        <div>
          <div className="flex justify-between items-start border-b border-slate-700/60 pb-2.5 mb-3">
            <div>
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                👤 {person.prenom} {person.nom}
                {person.age !== undefined && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 font-medium px-2 py-0.5 rounded-full border border-blue-500/30">
                    {person.age} ans
                  </span>
                )}
              </h4>
              {person.email && (
                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  ✉️ {person.email}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEditingPerson(person)}
                className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition cursor-pointer"
              >
                ✏️ <span className="hidden sm:inline">Modifier</span>
              </button>
              <button
                onClick={() => setDeletingPerson(person)}
                className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium rounded-lg transition cursor-pointer"
              >
                🗑️ <span className="hidden sm:inline">Supprimer</span>
              </button>
            </div>
          </div>

          {person.description && (
            <p className="text-xs text-slate-300 italic bg-slate-900/50 p-2 rounded border border-slate-800 mb-3">
              "{person.description}"
            </p>
          )}

          <div className="grid grid-cols-1 gap-2 text-xs text-slate-300">
            {adresseFormatted && (
              <div>
                <span className="text-slate-500 font-medium">📍 Adresse :</span> {adresseFormatted}
              </div>
            )}

            {person.hobbies && person.hobbies.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-medium">🎨 Hobbies :</span>
                {person.hobbies.map((hobby, i) => (
                  <span key={i} className="bg-emerald-500/10 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {hobby}
                  </span>
                ))}
              </div>
            )}

            {person.platsFavoris && person.platsFavoris.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-medium">🍽️ Plats favoris :</span>
                {person.platsFavoris.map((plat, i) => (
                  <span key={i} className="bg-amber-500/10 text-amber-300 text-[11px] px-2 py-0.5 rounded-full border border-amber-500/20">
                    {plat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 mt-2 border-t border-slate-700/40">
          <button
            onClick={() => setSelectedId(person._id)}
            className="text-[10px] font-mono text-slate-500 hover:text-blue-400 transition"
          >
            ID: {person._id}
          </button>
        </div>
      </div>
    );
  };

  const resultsList = Array.isArray(apiResult?.data) 
    ? apiResult.data 
    : Array.isArray(apiResult) 
      ? apiResult 
      : (apiResult?.data && typeof apiResult.data === 'object' && !apiResult.data.deletedCount) 
        ? [apiResult.data] 
        : [];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Barre supérieure : ThemeToggle + Email + Bouton Déconnexion */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <ThemeToggle />
          
          {user?.email && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300">
              <span className="text-xs">✉️</span>
              <span className="font-medium">{user.email}</span>
            </div>
          )}

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              dispatch(logout());
            }}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer shadow-sm"
          >
            Déconnexion
          </button>
        </div>

        {/* Titre centré */}
        <div className="text-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            NodeJS VS Mongoose <span className="text-blue-600 dark:text-blue-400 font-extrabold">(MongoDB)</span> with ReactDOM
          </h1>
        </div>

        {/* Navigation par onglets */}
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 px-6 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Gestion des Tâches
          </button>
          <button
            onClick={() => setActiveTab('persons')}
            className={`pb-3 px-6 font-medium text-sm transition-colors border-b-2 cursor-pointer ${
              activeTab === 'persons'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Gestion des Profils (Personnes)
          </button>
        </div>

        {/* Contenu */}
        {activeTab === 'tasks' ? (
          <div>
            <AddTask />
            <ListTask />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <NewPerson />

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Panneau de Test des Routes Mongoose</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="ID de la personne"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Plat recherché"
                  value={searchFood}
                  onChange={(e) => setSearchFood(e.target.value)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGetAllPersons}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Afficher la liste
                  </button>
                  <button
                    type="button"
                    onClick={handleFindByFood}
                    className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Chercher par plat
                  </button>
                </div>
              </div>

              {personsList.length > 0 && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-3 text-sm">
                    Personnes en base de données :
                  </span>
                  <div className="max-h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pr-1">
                    {personsList.map(p => (
                      <div key={p._id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-700 dark:text-slate-200 font-medium truncate mr-2">
                          {p.prenom} {p.nom} {p.age !== undefined && `(${p.age} ans)`}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingPerson(p)}
                            className="text-amber-500 hover:text-amber-600 font-medium cursor-pointer"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingPerson(p)}
                            className="text-rose-500 hover:text-rose-600 font-medium cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {apiResult && (
                <div className="p-4 bg-slate-900 text-slate-200 font-sans text-xs rounded-xl max-h-[600px] overflow-y-auto border border-slate-700 shadow-inner flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-mono text-[11px]">// Résultat de la requête :</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      apiResult.type === 'error' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {apiResult.type === 'error' ? 'Erreur' : 'Succès'}
                    </span>
                  </div>

                  {apiResult.type === 'error' || apiResult.message ? (
                    <div className="text-rose-400 bg-rose-950/30 p-2.5 rounded border border-rose-900/50">
                      {apiResult.message || JSON.stringify(apiResult)}
                    </div>
                  ) : null}

                  {(apiResult.data?.deletedCount !== undefined || apiResult.deletedCount !== undefined) && (
                    <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-300 p-3 rounded-lg border border-emerald-900/50">
                      <span className="text-base">🗑️</span>
                      <div>
                        <p className="font-semibold">Opération de suppression réussie</p>
                        <p className="text-slate-400 text-[11px]">
                          Éléments supprimés : <strong className="text-emerald-400">{apiResult.data?.deletedCount ?? apiResult.deletedCount}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {resultsList.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <span className="text-slate-400 font-semibold text-xs">
                        {resultsList.length} résultat(s) affiché(s) :
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resultsList.map((person, index) => (
                          <PersonCard key={person._id || index} person={person} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingPerson && (
        <EditPersonModal
          person={editingPerson}
          onClose={() => setEditingPerson(null)}
          onSave={handleUpdatePerson}
        />
      )}

      {deletingPerson && (
        <DeleteConfirmModal
          person={deletingPerson}
          onClose={() => setDeletingPerson(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <Footer />
    </div>
  );
}

function DeleteConfirmModal({ person, onClose, onConfirm }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      alert("Veuillez saisir votre mot de passe.");
      return;
    }
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-slate-100">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-base font-bold text-rose-500 flex items-center gap-2">
            ⚠️ Confirmation requise
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Vous êtes sur le point de supprimer définitivement le profil de <strong className="text-white">{person.prenom} {person.nom}</strong>. Saisissez votre mot de passe pour confirmer.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer shadow-sm"
            >
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditPersonModal({ person, onClose, onSave }) {
  const [formData, setFormData] = useState({
    _id: person._id,
    nom: person.nom || '',
    prenom: person.prenom || '',
    age: person.age || '',
    email: person.email || '',
    description: person.description || '',
    hobbies: Array.isArray(person.hobbies) ? person.hobbies.join(', ') : '',
    platsFavoris: Array.isArray(person.platsFavoris) ? person.platsFavoris.join(', ') : '',
    adresse: {
      num: person.adresse?.num || '',
      rue: person.adresse?.rue || '',
      codePostal: person.adresse?.codePostal || '',
      ville: person.adresse?.ville || '',
      pays: person.adresse?.pays || ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
      hobbies: formData.hobbies.split(',').map(s => s.trim()).filter(Boolean),
      platsFavoris: formData.platsFavoris.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">✏️ Modifier le profil</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">Âge</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              rows="2"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">Hobbies (séparés par virgule)</label>
              <input
                type="text"
                value={formData.hobbies}
                onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Plats favoris (virgule)</label>
              <input
                type="text"
                value={formData.platsFavoris}
                onChange={(e) => setFormData({ ...formData, platsFavoris: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 mt-1">
            <span className="font-semibold text-slate-300 block mb-2">📍 Adresse</span>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="N°"
                value={formData.adresse.num}
                onChange={(e) => setFormData({ ...formData, adresse: { ...formData.adresse, num: e.target.value } })}
                className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Rue"
                value={formData.adresse.rue}
                onChange={(e) => setFormData({ ...formData, adresse: { ...formData.adresse, rue: e.target.value } })}
                className="col-span-2 p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Code postal"
                value={formData.adresse.codePostal}
                onChange={(e) => setFormData({ ...formData, adresse: { ...formData.adresse, codePostal: e.target.value } })}
                className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Ville"
                value={formData.adresse.ville}
                onChange={(e) => setFormData({ ...formData, adresse: { ...formData.adresse, ville: e.target.value } })}
                className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Pays"
                value={formData.adresse.pays}
                onChange={(e) => setFormData({ ...formData, adresse: { ...formData.adresse, pays: e.target.value } })}
                className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}