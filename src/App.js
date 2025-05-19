import React, { useState } from 'react';
import './App.css';

const FLAVORS = ['acidity','chocolate','nutty','fruity','caramel','floral','citrus','honey','berry','spicy'];
const BREW_GROUPS = [
  { label: 'Espresso', options: ['Espresso'] },
  { label: 'Alternative', options: ['French Press','AeroPress','V60','Chemex'] }
];

function App() {
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedBrew, setSelectedBrew] = useState('Espresso');
  const [recs, setRecs] = useState([]);
  const [error, setError] = useState('');

  const toggleFlavor = flavor => {
    setSelectedFlavors(prev =>
      prev.includes(flavor)
        ? prev.filter(f => f !== flavor)
        : [...prev, flavor]
    );
  };

  const getRecommendations = async () => {
    if (!selectedFlavors.length) {
      setError('Please select at least one flavor descriptor.');
      return;
    }
    setError('');
    const resp = await fetch('https://ghohlov.pythonanywhere.com/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flavors: selectedFlavors, brew_method: selectedBrew })
    });
    if (!resp.ok) {
      setError('Server error');
      return;
    }
    const data = await resp.json();
    setRecs(data.recommendations);
  };

  return (
    <div className="App">
      <h1>Coffee Recommender</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Flavor Descriptors</h2>
        <div className="flavors">
          {FLAVORS.map(fl => (
            <label key={fl}>
              <input
                type="checkbox"
                checked={selectedFlavors.includes(fl)}
                onChange={() => toggleFlavor(fl)}
              />
              {fl}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2>Brew Method</h2>
        <select value={selectedBrew} onChange={e => setSelectedBrew(e.target.value)}>
          {BREW_GROUPS.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </section>

      <button onClick={getRecommendations}>Get Recommendations</button>

      <section>
        <h2>Recommendations</h2>
        <ul>
          {recs.map((r, i) => (
            <li key={i}>{r.name} — {r.score.toFixed(2)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;

