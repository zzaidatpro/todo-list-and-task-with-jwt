import { useState } from 'react';


export function NewPerson({onPersonAdded}) {
  const [userId, setUserId] = useState()
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('')
  const [dateNaissance, setDateNaissance] = useState('');
  
  const [adresse, setAdresse] = useState({
    num: '',
    rue: '',
    codePostal: '',
    ville: '',
    pays: ''
  });

  const [email, setEmail] = useState('');
  const [hobbies, setHobbies] = useState(''); 
  const [platsFavoris, setPlatsFavoris] = useState(''); 
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);

  
  const handleAdresseChange = (field, value) => {
    setAdresse(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Transformation des chaînes de caractères séparées par des virgules en tableaux
    const formattedHobbies = hobbies ? hobbies.split(',').map(h => h.trim()).filter(Boolean) : [];
    const formattedPlats = platsFavoris ? platsFavoris.split(',').map(p => p.trim()).filter(Boolean) : [];

    const personData = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      age: age ? Number(age) : undefined,
      dateNaissance,
      adresse,
      email: email.trim(),
      hobbies: formattedHobbies,
      platsFavoris: formattedPlats,
      description: description.trim()
    };

    try {
      const response = await fetch('http://localhost:5000/api/persons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(personData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Message exact du serveur :", errorData);
        throw new Error(errorData.message || "Erreur lors de l'enregistrement");
      }

      const savedPerson = await response.json();
      setMessage({ type: 'success', text: `Personne "${savedPerson.prenom} ${savedPerson.nom}" ajoutée avec succès !` });
      
      if (onPersonAdded) {
        onPersonAdded(savedPerson);
      }
     
      setNom('');
      setPrenom('');
      setAge('');
      setDateNaissance('');
      setAdresse({ num: '', rue: '', codePostal: '', ville: '', pays: '' });
      setEmail('');
      setHobbies('');
      setPlatsFavoris('');
      setDescription('');
    } catch (err) {
      console.error("Détail de l'erreur Personne :", err);
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto my-6 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Ajouter un profil</h2>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
          {message.text}
        </div>
      )}

      {/* Identité */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
     


    {/* age, Date de naissance et Email */}
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        <input
          type="number"
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="col-span-1 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dateNaissance}
          onChange={(e) => setDateNaissance(e.target.value)}
          className="col-span-2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Adresse Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="col-span-3 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        />
     </div>

      {/* Adresse */}
      <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adresse</span>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="N°"
            value={adresse.num}
            onChange={(e) => handleAdresseChange('num', e.target.value)}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Rue"
            value={adresse.rue}
            onChange={(e) => handleAdresseChange('rue', e.target.value)}
            className="col-span-2 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Code Postal"
            value={adresse.codePostal}
            onChange={(e) => handleAdresseChange('codePostal', e.target.value)}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Ville"
            value={adresse.ville}
            onChange={(e) => handleAdresseChange('ville', e.target.value)}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
          />
          <input
            type="text"
            placeholder="Pays"
            value={adresse.pays}
            onChange={(e) => handleAdresseChange('pays', e.target.value)}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Hobbies et Plats favoris */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Hobbies (séparés par des virgules)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Plats favoris (séparés par des virgules)"
          value={platsFavoris}
          onChange={(e) => setPlatsFavoris(e.target.value)}
          className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description du profil */}
      <textarea
        placeholder="Description du profil..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
        className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea>

      <button
        type="submit"
        className="w-full py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 transition-all cursor-pointer shadow-sm"
      >
        Enregistrer la personne
      </button>
    </form>
  );
}

export default NewPerson;