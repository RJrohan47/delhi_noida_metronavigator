// MetroNavigator.js
import React, { useState } from 'react';
import './Hero.css';
import MetroGraph from './MetroGraph';

const metroGraph = MetroGraph.createMetroMap();

function MetroNavigator() {
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [result, setResult] = useState(null);
  const [searchType, setSearchType] = useState('distance'); // 'distance' or 'time'

  const stations = [
    "Shaheed Sthal~R",
    "Hindon River~R",
    "Arthala~R",
    "Mohan Nagar~R",
    "Shyam park~R",
    "Major Mohit Sharma~R",
    "Raj Bagh~R",
    "Shaheed Nagar~R",
    "Dilshad Garden~R",
    "Jhil Mil~R",
    "Mansarovar Park~R",
    "Shahdara~R",
    "Welcome~R",
    "Seelampur~R",
    "Shastri Park~R",
    "Kashmere Gate~R",
    "Tis Hazari~R",
    "Pul Bangash~R",
    "Pratap Nagar~R",
    "Shastri Nagar~R",
    "Inderlok~R",
    "Kanhaiya Nagar~R",
    "Keshav Puram~R",
    "Netaji Subash Place~R",
    "Kohat Enclave~R",
    "Pitam Pura~R",
    "Rohini East~R",
    "Rohini West~R",
    "Rithala~R",
    "Samaypur Badli~Y",
    "Rohini Sector 18-19~Y",
    "Haiderpur Badli Mor~Y",
    "Jahangirpuri~Y",
    "Adarsh Nagar~Y",
    "Azadpur~Y",
    "Model Town~Y",
    "Guru Tegh Bahadur Nagar~Y",
    "Vishwavidyalaya~Y",
    "Vidhan Sabha~Y",
    "Civil Lines~Y",
    "Kashmere Gate~Y",
    "Chandni Chowk~Y",
    "Chawri Bazar~Y",
    "New Delhi~Y",
    "Rajiv Chowk~Y",
    "Patel Chowk~Y",
    "Central Secretariat~Y",
    "Udyog Bhawan~Y",
    "Lok Kalyan Marg~Y",
    "Jor Bagh~Y",
    "Dilli Haat INA~Y",
    "AIIMS~Y",
    "Green Park~Y",
    "Hauz Khas~Y",
    "Malviya Nagar~Y",
    "Saket~Y",
    "Qutab Minar~Y",
    "Chhattarpur~Y",
    "Sultanpur~Y",
    "Ghitorni~Y",
    "Arjan Garh~Y",
    "Guru Dronacharya~Y",
    "Sikandarpur~Y",
    "MG Road~Y",
    "IFFCO Chowk~Y",
    "Huda City Centre~Y",
    "Dwarka Sector 21~B",
    "Dwarka Sector 8~B",
    "Dwarka Sector 9~B",
    "Dwarka Sector 10~B",
    "Dwarka Sector 11~B",
    "Dwarka Sector 12~B",
    "Dwarka Sector 13~B",
    "Dwarka Sector 14~B",
    "Dwarka~B",
    "Dwarka Mor~B",
    "Nawada~B",
    "Uttam Nagar West~B",
    "Uttam Nagar East~B",
    "Janak Puri West~B",
    "Janak Puri East~B",
    "Tilak Nagar~B",
    "Subhash Nagar~B",
    "Tagore Garden~B",
    "Rajouri Garden~B",
    "Ramesh Nagar~B",
    "Moti Nagar~B",
    "Kirti Nagar~B",
    "Shadipur~B",
    "Patel Nagar~B",
    "Rajendra Place~B",
    "Karol Bagh~B",
    "Jhandewalan~B",
    "RK Ashram Marg~B",
    "Rajiv Chowk~B",
    "Barakhamba~B",
    "Mandi House~B",
    "Supreme Court (Pragati Maidan)~B",
    "Indraprastha~B",
    "Yamuna Bank~B",
    "Akshardham~B",
    "Mayur Vihar Phase-1~B",
    "Mayur Vihar Extention~B",
    "New Ashok Nagar~B",
    "Noida Sector 15~B",
    "Noida Sector 16~B",
    "Noida Sector 18~B",
    "Botanical Garden~B",
    "Golf Course~B",
    "Noida City Center~B",
    "Noida Sector 34~B",
    "Noida Sector 52~B",
    "Noida Sector 61~B",
    "Noida Sector 59~B",
    "Noida Sector 62~B",
    "Yamuna Bank~BL",
    "Laxmi Nagar~BL",
    "Nirman Vihar~BL",
    "Preet Vihar~BL",
    "Karkar Duma~BL",
    "Anand Vihar~BL",
    "Kaushambi~BL",
    "Vaishali~BL",
    "Inderlok~G",
    "Ashok Park Main~G",
    "Punjabi Bagh~G",
    "Shivaji Park~G",
    "Madipur~G",
    "Paschim Vihar (East)~G",
    "Paschim Vihar (West)~G",
    "Peera Garhi~G",
    "Udyog Nagar~G",
    "Maharaja Surajmal Stadium~G",
    "Nangloi~G",
    "Nangloi Railway Station~G",
    "Rajdhani Park~G",
    "Mundka~G",
    "Mundka Industrial Area (MIA)~G",
    "Ghevra Metro station~G",
    "Tikri Kalan~G",
    "Tikri Border~G",
    "Pandit Shree Ram Sharma~G",
    "Bahdurgarh City~G",
    "Brigadier Hoshiar Singh~G",
    "Ashok Park Main~GB",
    "Satguru Ram Singh Marg~GB",
    "Kirti Nagar~GB",
    "Kashmere Gate~V",
    "Lal Quila~V",
    "Jama Masjid~V",
    "Delhi Gate~V",
    "ITO~V",
    "Mandi House~V",
    "Janpath~V",
    "Central Secretariat~V",
    "Khan Market~V",
    "Jawaharlal Nehru Stadium~V",
    "Jangpura~V",
    "Lajpat Nagar~V",
    "Moolchand~V",
    "Kailash Colony~V",
    "Nehru Place~V",
    "Kalkaji Mandir~V",
    "Govind Puri~V",
    "Okhla~V",
    "Jasola~V",
    "Sarita Vihar~V",
    "Mohan Estate~V",
    "Tughlakabad~V",
    "Badarpur Border~V",
    "Sarai~V",
    "N.H.P.C. Chowk~V",
    "Mewala Maharajpur~V",
    "Sector 28 Faridabad~V",
    "Badkal Mor~V",
    "Old Faridabad~V",
    "Neelam Chowk Ajronda~V",
    "Bata Chowk~V",
    "Escorts Mujesar~V",
    "Sant Surdas - Sihi~V",
    "Raja Nahar Singh~V",
    "Janak Puri West~M",
    "Dabri Mor - Janakpuri South~M",
    "Dashrath Puri~M",
    "Palam~M",
    "Sadar Bazaar Cantonment~M",
    "Terminal 1 IGI Airport~M",
    "Shankar Vihar~M",
    "Vasant Vihar~M",
    "Munirka~M",
    "RK Puram~M",
    "IIT Delhi~M",
    "Hauz Khas~M",
    "Panchsheel Park~M",
    "Chirag Delhi~M",
    "Greater Kailash~M",
    "Nehru Enclave~M",
    "Kalkaji Mandir~M",
    "Okhla NSIC~M",
    "Sukhdev Vihar~M",
    "JAMIA MILLIA ISLAMIA~M",
    "Okhla Vihar~M",
    "Jasola Vihar Shaheen Bagh~M",
    "Kalindi Kunj~M",
    "Okhla Bird Sanctuary~M",
    "Botanical Garden~M",
    "Majlis Park~P",
    "Azadpur~P",
    "Shalimar Bagh~P",
    "Netaji Subash Place~P",
    "Shakurpur~P",
    "Punjabi Bagh West~P",
    "ESI BASAI DARAPUR~P",
    "Rajouri Garden~P",
    "Maya Puri~P",
    "Naraina Vihar~P",
    "Delhi Cantt~P",
    "Durgabai Deshmukh South Campus~P",
    "Sir Vishweshwaraiah Moti Bagh~P",
    "Bhikaji Cama Place~P",
    "Sarojini Nagar~P",
    "Dilli Haat INA~P",
    "South Extension~P",
    "Lajpat Nagar~P",
    "Vinobapuri~P",
    "Ashram~P",
    "Sarai Kale Khan Hazrat Nizamuddin~P",
    "Mayur Vihar Phase-1~P",
    "Mayur Vihar Pocket I~P",
    "Trilokpuri Sanjay Lake~P",
    "Vinod Nagar East~P",
    "Mandawali - West Vinod Nagar~P",
    "IP Extension~P",
    "Anand Vihar~P",
    "Karkar Duma~P",
    "Karkarduma Court~P",
    "Krishna Nagar~P",
    "East Azad Nagar~P",
    "Welcome~P",
    "Jaffrabad~P",
    "Maujpur~P",
    "Gokulpuri~P",
    "Johri Enclave~P",
    "Shiv Vihar~P",
    "Noida Sector 51~A",
    "Noida Sector 50~A",
    "Noida Sector 76~A",
    "Noida Sector 101~A",
    "Noida Sector 81~A",
    "NSEZ Noida~A",
    "Noida Sector 83~A",
    "Noida Sector 137~A",
    "Noida Sector 142~A",
    "Noida Sector 143~A",
    "Noida Sector 144~A",
    "Noida Sector 145~A",
    "Noida Sector 146~A",
    "Noida Sector 147~A",
    "Noida Sector 148~A",
    "Knowledge Park II~A",
    "Pari Chowk Greater Noida~A",
    "Alpha 1 Greater Noida~A",
    "Delta 1 Greater Noida~A",
    "GNIDA Office~A",
    "Depot Greater Noida~A",
    "Dwarka~GR",
    "Nangli~GR",
    "Najafgarh~GR",
    "New Delhi-Airport Express~O",
    "Shivaji Stadium~O",
    "Dhaula Kuan~O",
    "Delhi Aerocity~O",
    "IGI Airport~O",
    "Dwarka Sector 21~O",
    "Sector 55-66~RM",
    "Sector 54 Chowk~RM",
    "Sector 53-54~RM",
    "Sector 42-43~RM",
    "DLF Phase 1~RM",
    "Sikandarpur~RM",
    "DLF Phase 2~RM",
    "Belvedere Towers~RM",
    "Cyber City~RM",
    "Moulsari Avenue~RM",
    "DLF Phase 3~RM"
  ];
  

  const handleCalculate = () => {
    if (!startStation || !endStation) {
      alert('Please select both stations');
      return;
    }
    
    if (!metroGraph.containsVertex(startStation) || !metroGraph.containsVertex(endStation)) {
      alert('One or both stations are invalid');
      return;
    }

    const processed = new Map();
    if (!metroGraph.hasPath(startStation, endStation, processed)) {
      alert('No path exists between these stations');
      return;
    }

    if (searchType === 'distance') {
      const path = metroGraph.getMinimumDistance(startStation, endStation);
      const interchanges = metroGraph.getInterchanges(path);
      setResult({
        type: 'Distance',
        path: interchanges,
        value: interchanges[interchanges.length - 1] + ' km'
      });
    } else {
      const path = metroGraph.getMinimumTime(startStation, endStation);
      const interchanges = metroGraph.getInterchanges(path);
      setResult({
        type: 'Time',
        path: interchanges,
        value: interchanges[interchanges.length - 1] + ' minutes'
      });
    }
  };

  return (
    <div className="navigator-container">
      <h2 className="navigator-title">Plan Your Metro Journey</h2>
      
      <div className="navigator-radio-group">
        <label>
          <input
            type="radio"
            value="distance"
            checked={searchType === 'distance'}
            onChange={() => setSearchType('distance')}
          />
          Shortest Distance
        </label>
        <label>
          <input
            type="radio"
            value="time"
            checked={searchType === 'time'}
            onChange={() => setSearchType('time')}
          />
          Shortest Time
        </label>
      </div>
      
      <div className="navigator-input-group">
        <label className="navigator-label">From:</label>
        <select
          value={startStation}
          onChange={(e) => setStartStation(e.target.value)}
          className="navigator-select"
        >
          <option value="">Select starting station</option>
          {stations.map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </select>
      </div>
      
      <div className="navigator-input-group">
        <label className="navigator-label">To:</label>
        <select
          value={endStation}
          onChange={(e) => setEndStation(e.target.value)}
          className="navigator-select"
        >
          <option value="">Select destination station</option>
          {stations.map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={handleCalculate}
        className="navigator-button"
      >
        Calculate Route
      </button>
      
      {result && (
        <div className="navigator-result">
          <h3 className="navigator-result-title">Recommended Route ({result.type})</h3>
          <p><strong>Total {result.type.toLowerCase()}:</strong> {result.value}</p>
          <p><strong>Interchanges:</strong> {result.path[result.path.length - 2]}</p>
          <div className="navigator-path">
            <p><strong>Path:</strong></p>
            <p>START ⇒ {result.path[0]}</p>
            {result.path.slice(1, -2).map((step, index) => (
              <p key={index}>{step}</p>
            ))}
            <p>{result.path[result.path.length - 3]} ⇒ END</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetroNavigator;