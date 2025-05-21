import React, { useState } from 'react';
import './App.css';
import logo from './assets/Coffee_logo.png';

const API_URL = process.env.REACT_APP_API_URL || 'https://ghohlov.pythonanywhere.com/recommend';

const FLAVORS = [
  { label: 'Кислотный',  value: 'acidity'   },
  { label: 'Шоколадный',   value: 'chocolate' },
  { label: 'Ореховый',     value: 'nutty'     },
  { label: 'Фруктовый',    value: 'fruity'    },
  { label: 'Карамельный',  value: 'caramel'   },
  { label: 'Цветочный',    value: 'floral'    },
  { label: 'Цитрусовый',   value: 'citrus'    },
  { label: 'Медовый',      value: 'honey'     },
  { label: 'Ягодный',      value: 'berry'     },
  { label: 'Пряный',       value: 'spicy'     },
];

const BREW_GROUPS = [
  {
    label: 'Эспрессо',
    options: [{ label: 'Эспрессо', value: 'Espresso' }]
  },
  {
    label: 'Альтернативные методы',
    options: [
      { label: 'Френч-пресс', value: 'French Press' },
      { label: 'Аэропресс',    value: 'AeroPress'     },
      { label: 'V60',          value: 'V60'           },
      { label: 'Кемекс',       value: 'Chemex'        },
    ]
  }
];

function App() {
  const [showLanding, setShowLanding]       = useState(true);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedBrew,    setSelectedBrew]  = useState('Espresso');
  const [recs,            setRecs]          = useState([]);
  const [error,           setError]         = useState('');

  const toggleFlavor = val => {
    setSelectedFlavors(prev =>
      prev.includes(val)
        ? prev.filter(f => f !== val)
        : [...prev, val]
    );
  };

  const getRecommendations = async () => {
    if (!selectedFlavors.length) {
      setError('Пожалуйста, выберите хотя бы один вкусовой дескриптор.');
      return;
    }
    setError('');
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flavors: selectedFlavors,
          brew_method: selectedBrew
        })
      });
      if (!resp.ok) {
        setError('Ошибка сервера.');
        return;
      }
      const { recommendations } = await resp.json();
      setRecs(recommendations);
    } catch {
      setError('Ошибка подключения.');
    }
  };

  if (showLanding) {
    return (
      <div className="Landing">
        <img src={logo} alt="ChooseCoffee Logo" className="Landing-logo" />
        <button
          className="Landing-button"
          onClick={() => setShowLanding(false)}
        >
          Подобрать кофе
        </button>
      </div>
    );
  }

  return (
    <div className="App AppContent">
      <button
        className="Return-button"
        onClick={() => setShowLanding(true)}
      >
        Вернуться на главный экран
      </button>

      <h1>Подбор кофе</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Вкусовые дескрипторы</h2>
        <div className="flavors">
          {FLAVORS.map(opt => (
            <label key={opt.value}>
              <input
                type="checkbox"
                checked={selectedFlavors.includes(opt.value)}
                onChange={() => toggleFlavor(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2>Метод заваривания</h2>
        <select
          value={selectedBrew}
          onChange={e => setSelectedBrew(e.target.value)}
        >
          {BREW_GROUPS.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </section>

      <button onClick={getRecommendations}>
        Показать рекомендации
      </button>

      {/* Показываем рекомендации только если recs не пустой */}
      {recs.length > 0 && (
        <section>
          <h2>Рекомендации</h2>
          <ul>
            {recs.map((r, i) => (
              <li key={i}>{r.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
