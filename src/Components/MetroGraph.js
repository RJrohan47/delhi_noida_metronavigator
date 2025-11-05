// MetroGraph.js
class MetroGraph {
    constructor() {
      this.vtces = new Map();
    }
  
    addVertex(vname) {
      this.vtces.set(vname, { nbrs: new Map() });
    }
  
    addEdge(vname1, vname2, value) {
      const vtx1 = this.vtces.get(vname1);
      const vtx2 = this.vtces.get(vname2);
  
      if (!vtx1 || !vtx2 || vtx1.nbrs.has(vname2)) {
        return;
      }
  
      vtx1.nbrs.set(vname2, value);
      vtx2.nbrs.set(vname1, value);
    }
  
    hasPath(vname1, vname2, processed) {
      if (this.containsEdge(vname1, vname2)) {
        return true;
      }
  
      processed.set(vname1, true);
      const vtx = this.vtces.get(vname1);
      
      for (const [nbr] of vtx.nbrs) {
        if (!processed.has(nbr)) {
          if (this.hasPath(nbr, vname2, processed)) {
            return true;
          }
        }
      }
  
      return false;
    }
  
    containsEdge(vname1, vname2) {
      const vtx1 = this.vtces.get(vname1);
      const vtx2 = this.vtces.get(vname2);
      
      if (!vtx1 || !vtx2 || !vtx1.nbrs.has(vname2)) {
        return false;
      }
      return true;
    }
  
    containsVertex(vname) {
      return this.vtces.has(vname);
    }
  
    dijkstra(src, des, useTime) {
      let val = 0;
      const ans = [];
      const map = new Map();
      const heap = new Heap();
  
      for (const [key] of this.vtces) {
        const np = { 
          vname: key,
          psf: "",
          cost: Infinity 
        };
  
        if (key === src) {
          np.cost = 0;
          np.psf = key;
        }
  
        heap.add(np);
        map.set(key, np);
      }
  
      while (!heap.isEmpty()) {
        const rp = heap.remove();
        
        if (rp.vname === des) {
          val = rp.cost;
          break;
        }
        
        map.delete(rp.vname);
        ans.push(rp.vname);
        
        const v = this.vtces.get(rp.vname);
        for (const [nbr] of v.nbrs) {
          if (map.has(nbr)) {
            const oc = map.get(nbr).cost;
            const k = this.vtces.get(rp.vname);
            let nc;
            
            if (useTime) {
              nc = rp.cost + 120 + 40 * k.nbrs.get(nbr);
            } else {
              nc = rp.cost + k.nbrs.get(nbr);
            }
  
            if (nc < oc) {
              const gp = map.get(nbr);
              gp.psf = rp.psf + " " + nbr;
              gp.cost = nc;
              heap.updatePriority(gp);
            }
          }
        }
      }
      return val;
    }
  
    getMinimumDistance(src, dst) {
      let min = Infinity;
      let ans = "";
      const processed = new Map();
      const stack = [{ 
        vname: src, 
        psf: src + "  ", 
        min_dis: 0, 
        min_time: 0 
      }];
  
      while (stack.length > 0) {
        const rp = stack.pop();
  
        if (processed.has(rp.vname)) {
          continue;
        }
  
        processed.set(rp.vname, true);
        
        if (rp.vname === dst) {
          const temp = rp.min_dis;
          if (temp < min) {
            ans = rp.psf;
            min = temp;
          }
          continue;
        }
  
        const rpvtx = this.vtces.get(rp.vname);
        for (const [nbr] of rpvtx.nbrs) {
          if (!processed.has(nbr)) {
            stack.push({
              vname: nbr,
              psf: rp.psf + nbr + "  ",
              min_dis: rp.min_dis + rpvtx.nbrs.get(nbr),
              min_time: rp.min_time
            });
          }
        }
      }
      
      return ans + min.toString();
    }
  
    getMinimumTime(src, dst) {
      let min = Infinity;
      let ans = "";
      const processed = new Map();
      const stack = [{ 
        vname: src, 
        psf: src + "  ", 
        min_dis: 0, 
        min_time: 0 
      }];
  
      while (stack.length > 0) {
        const rp = stack.pop();
  
        if (processed.has(rp.vname)) {
          continue;
        }
  
        processed.set(rp.vname, true);
        
        if (rp.vname === dst) {
          const temp = rp.min_time;
          if (temp < min) {
            ans = rp.psf;
            min = temp;
          }
          continue;
        }
  
        const rpvtx = this.vtces.get(rp.vname);
        for (const [nbr] of rpvtx.nbrs) {
          if (!processed.has(nbr)) {
            stack.push({
              vname: nbr,
              psf: rp.psf + nbr + "  ",
              min_time: rp.min_time + 120 + 40 * rpvtx.nbrs.get(nbr),
              min_dis: rp.min_dis
            });
          }
        }
      }
      const minutes = Math.ceil(min / 60);
      return ans + minutes.toString();
    }
  
    getInterchanges(str) {
      const arr = [];
      const res = str.split("  ");
      arr.push(res[0]);
      let count = 0;
      
      for (let i = 1; i < res.length - 1; i++) {
        const index = res[i].indexOf('~');
        const s = res[i].substring(index + 1);
        
        if (s.length === 2) {
          const prev = res[i-1].substring(res[i-1].indexOf('~') + 1);
          const next = res[i+1].substring(res[i+1].indexOf('~') + 1);
          
          if (prev === next) {
            arr.push(res[i]);
          } else {
            arr.push(res[i] + " ==> " + res[i+1]);
            i++;
            count++;
          }
        } else {
          arr.push(res[i]);
        }
      }
      arr.push(count.toString());
      arr.push(res[res.length - 1]);
      return arr;
    }
  
    static createMetroMap() {
      const g = new MetroGraph();
      // Add all stations and edges as in the Java version
      g.addVertex("Shaheed Sthal~R");
      g.addVertex("Hindon River~R");
      g.addVertex("Arthala~R");
      g.addVertex("Mohan Nagar~R");
      g.addVertex("Shyam park~R");
      g.addVertex("Major Mohit Sharma~R");
      g.addVertex("Raj Bagh~R");
      g.addVertex("Shaheed Nagar~R");
      g.addVertex("Dilshad Garden~R");
      g.addVertex("Jhil Mil~R");
      g.addVertex("Mansarovar Park~R");
      g.addVertex("Shahdara~R");
      g.addVertex("Welcome~R");
      g.addVertex("Seelampur~R");
      g.addVertex("Shastri Park~R");
      g.addVertex("Kashmere Gate~R");
      g.addVertex("Tis Hazari~R");
      g.addVertex("Pul Bangash~R");
      g.addVertex("Pratap Nagar~R");
      g.addVertex("Shastri Nagar~R");
      g.addVertex("Inderlok~R");
      g.addVertex("Kanhaiya Nagar~R");
      g.addVertex("Keshav Puram~R");
      g.addVertex("Netaji Subash Place~R");
      g.addVertex("Kohat Enclave~R");
      g.addVertex("Pitam Pura~R");
      g.addVertex("Rohini East~R");
      g.addVertex("Rohini West~R");
      g.addVertex("Rithala~R");

      // Yellow Line
      g.addVertex("Samaypur Badli~Y");
      g.addVertex("Rohini Sector 18-19~Y");
      g.addVertex("Haiderpur Badli Mor~Y");
      g.addVertex("Jahangirpuri~Y");
      g.addVertex("Adarsh Nagar~Y");
      g.addVertex("Azadpur~Y");
      g.addVertex("Model Town~Y");
      g.addVertex("Guru Tegh Bahadur Nagar~Y");
      g.addVertex("Vishwavidyalaya~Y");
      g.addVertex("Vidhan Sabha~Y");
      g.addVertex("Civil Lines~Y");
      g.addVertex("Kashmere Gate~Y");
      g.addVertex("Chandni Chowk~Y");
      g.addVertex("Chawri Bazar~Y");
      g.addVertex("New Delhi~Y");
      g.addVertex("Rajiv Chowk~Y");
      g.addVertex("Patel Chowk~Y");
      g.addVertex("Central Secretariat~Y");
      g.addVertex("Udyog Bhawan~Y");
      g.addVertex("Lok Kalyan Marg~Y");
      g.addVertex("Jor Bagh~Y");
      g.addVertex("Dilli Haat INA~Y");
      g.addVertex("AIIMS~Y");
      g.addVertex("Green Park~Y");
      g.addVertex("Hauz Khas~Y");
      g.addVertex("Malviya Nagar~Y");
      g.addVertex("Saket~Y");
      g.addVertex("Qutab Minar~Y");
      g.addVertex("Chhattarpur~Y");
      g.addVertex("Sultanpur~Y");
      g.addVertex("Ghitorni~Y");
      g.addVertex("Arjan Garh~Y");
      g.addVertex("Guru Dronacharya~Y");
      g.addVertex("Sikandarpur~Y");
      g.addVertex("MG Road~Y");
      g.addVertex("IFFCO Chowk~Y");
      g.addVertex("Huda City Centre~Y");

      // Blue Line
      g.addVertex("Dwarka Sector 21~B");
      g.addVertex("Dwarka Sector 8~B");
      g.addVertex("Dwarka Sector 9~B");
      g.addVertex("Dwarka Sector 10~B");
      g.addVertex("Dwarka Sector 11~B");
      g.addVertex("Dwarka Sector 12~B");
      g.addVertex("Dwarka Sector 13~B");
      g.addVertex("Dwarka Sector 14~B");
      g.addVertex("Dwarka~B");
      g.addVertex("Dwarka Mor~B");
      g.addVertex("Nawada~B");
      g.addVertex("Uttam Nagar West~B");
      g.addVertex("Uttam Nagar East~B");
      g.addVertex("Janak Puri West~B");
      g.addVertex("Janak Puri East~B");
      g.addVertex("Tilak Nagar~B");
      g.addVertex("Subhash Nagar~B");
      g.addVertex("Tagore Garden~B");
      g.addVertex("Rajouri Garden~B");
      g.addVertex("Ramesh Nagar~B");
      g.addVertex("Moti Nagar~B");
      g.addVertex("Kirti Nagar~B");
      g.addVertex("Shadipur~B");
      g.addVertex("Patel Nagar~B");
      g.addVertex("Rajendra Place~B");
      g.addVertex("Karol Bagh~B");
      g.addVertex("Jhandewalan~B");
      g.addVertex("RK Ashram Marg~B");
      g.addVertex("Rajiv Chowk~B");
      g.addVertex("Barakhamba~B");
      g.addVertex("Mandi House~B");
      g.addVertex("Supreme Court (Pragati Maidan)~B");
      g.addVertex("Indraprastha~B");
      g.addVertex("Yamuna Bank~B");
      g.addVertex("Akshardham~B");
      g.addVertex("Mayur Vihar Phase-1~B");
      g.addVertex("Mayur Vihar Extention~B");
      g.addVertex("New Ashok Nagar~B");
      g.addVertex("Noida Sector 15~B");
      g.addVertex("Noida Sector 16~B");
      g.addVertex("Noida Sector 18~B");
      g.addVertex("Botanical Garden~B");
      g.addVertex("Golf Course~B");
      g.addVertex("Noida City Center~B");
      g.addVertex("Noida Sector 34~B");
      g.addVertex("Noida Sector 52~B");
      g.addVertex("Noida Sector 61~B");
      g.addVertex("Noida Sector 59~B");
      g.addVertex("Noida Sector 62~B");

      // Blue Line Branch
      g.addVertex("Yamuna Bank~BL");
      g.addVertex("Laxmi Nagar~BL");
      g.addVertex("Nirman Vihar~BL");
      g.addVertex("Preet Vihar~BL");
      g.addVertex("Karkar Duma~BL");
      g.addVertex("Anand Vihar~BL");
      g.addVertex("Kaushambi~BL");
      g.addVertex("Vaishali~BL");

      // Green Line
      g.addVertex("Inderlok~G");
      g.addVertex("Ashok Park Main~G");
      g.addVertex("Punjabi Bagh~G");
      g.addVertex("Shivaji Park~G");
      g.addVertex("Madipur~G");
      g.addVertex("Paschim Vihar (East)~G");
      g.addVertex("Paschim Vihar (West)~G");
      g.addVertex("Peera Garhi~G");
      g.addVertex("Udyog Nagar~G");
      g.addVertex("Maharaja Surajmal Stadium~G");
      g.addVertex("Nangloi~G");
      g.addVertex("Nangloi Railway Station~G");
      g.addVertex("Rajdhani Park~G");
      g.addVertex("Mundka~G");
      g.addVertex("Mundka Industrial Area (MIA)~G");
      g.addVertex("Ghevra Metro station~G");
      g.addVertex("Tikri Kalan~G");
      g.addVertex("Tikri Border~G");
      g.addVertex("Pandit Shree Ram Sharma~G");
      g.addVertex("Bahdurgarh City~G");
      g.addVertex("Brigadier Hoshiar Singh~G");

      // Green Line Branch
      g.addVertex("Ashok Park Main~GB");
      g.addVertex("Satguru Ram Singh Marg~GB");
      g.addVertex("Kirti Nagar~GB");

      // Violet Line
      g.addVertex("Kashmere Gate~V");
      g.addVertex("Lal Quila~V");
      g.addVertex("Jama Masjid~V");
      g.addVertex("Delhi Gate~V");
      g.addVertex("ITO~V");
      g.addVertex("Mandi House~V");
      g.addVertex("Janpath~V");
      g.addVertex("Central Secretariat~V");
      g.addVertex("Khan Market~V");
      g.addVertex("Jawaharlal Nehru Stadium~V");
      g.addVertex("Jangpura~V");
      g.addVertex("Lajpat Nagar~V");
      g.addVertex("Moolchand~V");
      g.addVertex("Kailash Colony~V");
      g.addVertex("Nehru Place~V");
      g.addVertex("Kalkaji Mandir~V");
      g.addVertex("Govind Puri~V");
      g.addVertex("Okhla~V");
      g.addVertex("Jasola~V");
      g.addVertex("Sarita Vihar~V");
      g.addVertex("Mohan Estate~V");
      g.addVertex("Tughlakabad~V");
      g.addVertex("Badarpur Border~V");
      g.addVertex("Sarai~V");
      g.addVertex("N.H.P.C. Chowk~V");
      g.addVertex("Mewala Maharajpur~V");
      g.addVertex("Sector 28 Faridabad~V");
      g.addVertex("Badkal Mor~V");
      g.addVertex("Old Faridabad~V");
      g.addVertex("Neelam Chowk Ajronda~V");
      g.addVertex("Bata Chowk~V");
      g.addVertex("Escorts Mujesar~V");
      g.addVertex("Sant Surdas - Sihi~V");
      g.addVertex("Raja Nahar Singh~V");

      // Magenta Line
      g.addVertex("Janak Puri West~M");
      g.addVertex("Dabri Mor - Janakpuri South~M");
      g.addVertex("Dashrath Puri~M");
      g.addVertex("Palam~M");
      g.addVertex("Sadar Bazaar Cantonment~M");
      g.addVertex("Terminal 1 IGI Airport~M");
      g.addVertex("Shankar Vihar~M");
      g.addVertex("Vasant Vihar~M");
      g.addVertex("Munirka~M");
      g.addVertex("RK Puram~M");
      g.addVertex("IIT Delhi~M");
      g.addVertex("Hauz Khas~M");
      g.addVertex("Panchsheel Park~M");
      g.addVertex("Chirag Delhi~M");
      g.addVertex("Greater Kailash~M");
      g.addVertex("Nehru Enclave~M");
      g.addVertex("Kalkaji Mandir~M");
      g.addVertex("Okhla NSIC~M");
      g.addVertex("Sukhdev Vihar~M");
      g.addVertex("JAMIA MILLIA ISLAMIA~M");
      g.addVertex("Okhla Vihar~M");
      g.addVertex("Jasola Vihar Shaheen Bagh~M");
      g.addVertex("Kalindi Kunj~M");
      g.addVertex("Okhla Bird Sanctuary~M");
      g.addVertex("Botanical Garden~M");

      // Pink Line
      g.addVertex("Majlis Park~P");
      g.addVertex("Azadpur~P");
      g.addVertex("Shalimar Bagh~P");
      g.addVertex("Netaji Subash Place~P");
      g.addVertex("Shakurpur~P");
      g.addVertex("Punjabi Bagh West~P");
      g.addVertex("ESI BASAI DARAPUR~P");
      g.addVertex("Rajouri Garden~P");
      g.addVertex("Maya Puri~P");
      g.addVertex("Naraina Vihar~P");
      g.addVertex("Delhi Cantt~P");
      g.addVertex("Durgabai Deshmukh South Campus~P");
      g.addVertex("Sir Vishweshwaraiah Moti Bagh~P");
      g.addVertex("Bhikaji Cama Place~P");
      g.addVertex("Sarojini Nagar~P");
      g.addVertex("Dilli Haat INA~P");
      g.addVertex("South Extension~P");
      g.addVertex("Lajpat Nagar~P");
      g.addVertex("Vinobapuri~P");
      g.addVertex("Ashram~P");
      g.addVertex("Sarai Kale Khan Hazrat Nizamuddin~P");
      g.addVertex("Mayur Vihar Phase-1~P");
      g.addVertex("Mayur Vihar Pocket I~P");
      g.addVertex("Trilokpuri Sanjay Lake~P");
      g.addVertex("Vinod Nagar East~P");
      g.addVertex("Mandawali - West Vinod Nagar~P");
      g.addVertex("IP Extension~P");
      g.addVertex("Anand Vihar~P");
      g.addVertex("Karkar Duma~P");
      g.addVertex("Karkarduma Court~P");
      g.addVertex("Krishna Nagar~P");
      g.addVertex("East Azad Nagar~P");
      g.addVertex("Welcome~P");
      g.addVertex("Jaffrabad~P");
      g.addVertex("Maujpur~P");
      g.addVertex("Gokulpuri~P");
      g.addVertex("Johri Enclave~P");
      g.addVertex("Shiv Vihar~P");

      // Aqua Line
      g.addVertex("Noida Sector 51~A");
      g.addVertex("Noida Sector 50~A");
      g.addVertex("Noida Sector 76~A");
      g.addVertex("Noida Sector 101~A");
      g.addVertex("Noida Sector 81~A");
      g.addVertex("NSEZ Noida~A");
      g.addVertex("Noida Sector 83~A");
      g.addVertex("Noida Sector 137~A");
      g.addVertex("Noida Sector 142~A");
      g.addVertex("Noida Sector 143~A");
      g.addVertex("Noida Sector 144~A");
      g.addVertex("Noida Sector 145~A");
      g.addVertex("Noida Sector 146~A");
      g.addVertex("Noida Sector 147~A");
      g.addVertex("Noida Sector 148~A");
      g.addVertex("Knowledge Park II~A");
      g.addVertex("Pari Chowk Greater Noida~A");
      g.addVertex("Alpha 1 Greater Noida~A");
      g.addVertex("Delta 1 Greater Noida~A");
      g.addVertex("GNIDA Office~A");
      g.addVertex("Depot Greater Noida~A");

      // Gray Line
      g.addVertex("Dwarka~GR");
      g.addVertex("Nangli~GR");
      g.addVertex("Najafgarh~GR");

      // Orange Line
      g.addVertex("New Delhi-Airport Express~O");
      g.addVertex("Shivaji Stadium~O");
      g.addVertex("Dhaula Kuan~O");
      g.addVertex("Delhi Aerocity~O");
      g.addVertex("IGI Airport~O");
      g.addVertex("Dwarka Sector 21~O");

      // Rapid Metro
      g.addVertex("Sector 55-66~RM");
      g.addVertex("Sector 54 Chowk~RM");
      g.addVertex("Sector 53-54~RM");
      g.addVertex("Sector 42-43~RM");
      g.addVertex("DLF Phase 1~RM");
      g.addVertex("Sikandarpur~RM");
      g.addVertex("DLF Phase 2~RM");
      g.addVertex("Belvedere Towers~RM");
      g.addVertex("Cyber City~RM");
      g.addVertex("Moulsari Avenue~RM");
      g.addVertex("DLF Phase 3~RM");

      // Add edges with distances (converting km to meters)
      // Red Line
      g.addEdge("Shaheed Sthal~R", "Hindon River~R", 1000);
      g.addEdge("Hindon River~R", "Arthala~R", 1500);
      g.addEdge("Arthala~R", "Mohan Nagar~R", 700);
      g.addEdge("Mohan Nagar~R", "Shyam park~R", 1300);
      g.addEdge("Shyam park~R", "Major Mohit Sharma~R", 1200);
      g.addEdge("Major Mohit Sharma~R", "Raj Bagh~R", 1200);
      g.addEdge("Raj Bagh~R", "Shaheed Nagar~R", 1300);
      g.addEdge("Shaheed Nagar~R", "Dilshad Garden~R", 1200);
      g.addEdge("Dilshad Garden~R", "Jhil Mil~R", 900);
      g.addEdge("Jhil Mil~R", "Mansarovar Park~R", 1100);
      g.addEdge("Mansarovar Park~R", "Shahdara~R", 1100);
      g.addEdge("Shahdara~R", "Welcome~R", 1200);
      g.addEdge("Welcome~R", "Seelampur~R", 1100);
      g.addEdge("Seelampur~R", "Shastri Park~R", 1600);
      g.addEdge("Shastri Park~R", "Kashmere Gate~R", 2100);
      g.addEdge("Kashmere Gate~R", "Tis Hazari~R", 1200);
      g.addEdge("Tis Hazari~R", "Pul Bangash~R", 900);
      g.addEdge("Pul Bangash~R", "Pratap Nagar~R", 800);
      g.addEdge("Pratap Nagar~R", "Shastri Nagar~R", 1700);
      g.addEdge("Shastri Nagar~R", "Inderlok~R", 1200);
      g.addEdge("Inderlok~R", "Kanhaiya Nagar~R", 1200);
      g.addEdge("Kanhaiya Nagar~R", "Keshav Puram~R", 700);
      g.addEdge("Keshav Puram~R", "Netaji Subash Place~R", 1200);
      g.addEdge("Netaji Subash Place~R", "Kohat Enclave~R", 1200);
      g.addEdge("Kohat Enclave~R", "Pitam Pura~R", 1000);
      g.addEdge("Pitam Pura~R", "Rohini East~R", 800);
      g.addEdge("Rohini East~R", "Rohini West~R", 1300);
      g.addEdge("Rohini West~R", "Rithala~R", 1000);

      // Yellow Line
      g.addEdge("Samaypur Badli~Y", "Rohini Sector 18-19~Y", 800);
      g.addEdge("Rohini Sector 18-19~Y", "Haiderpur Badli Mor~Y", 1300);
      g.addEdge("Haiderpur Badli Mor~Y", "Jahangirpuri~Y", 1300);
      g.addEdge("Jahangirpuri~Y", "Adarsh Nagar~Y", 1300);
      g.addEdge("Adarsh Nagar~Y", "Azadpur~Y", 1500);
      g.addEdge("Azadpur~Y", "Model Town~Y", 1400);
      g.addEdge("Model Town~Y", "Guru Tegh Bahadur Nagar~Y", 1400);
      g.addEdge("Guru Tegh Bahadur Nagar~Y", "Vishwavidyalaya~Y", 800);
      g.addEdge("Vishwavidyalaya~Y", "Vidhan Sabha~Y", 1000);
      g.addEdge("Vidhan Sabha~Y", "Civil Lines~Y", 1300);
      g.addEdge("Civil Lines~Y", "Kashmere Gate~Y", 1100);
      g.addEdge("Kashmere Gate~Y", "Chandni Chowk~Y", 1100);
      g.addEdge("Chandni Chowk~Y", "Chawri Bazar~Y", 1000);
      g.addEdge("Chawri Bazar~Y", "New Delhi~Y", 800);
      g.addEdge("New Delhi~Y", "Rajiv Chowk~Y", 1100);
      g.addEdge("Rajiv Chowk~Y", "Patel Chowk~Y", 1300);
      g.addEdge("Patel Chowk~Y", "Central Secretariat~Y", 900);
      g.addEdge("Central Secretariat~Y", "Udyog Bhawan~Y", 300);
      g.addEdge("Udyog Bhawan~Y", "Lok Kalyan Marg~Y", 1600);
      g.addEdge("Lok Kalyan Marg~Y", "Jor Bagh~Y", 1200);
      g.addEdge("Jor Bagh~Y", "Dilli Haat INA~Y", 1300);
      g.addEdge("Dilli Haat INA~Y", "AIIMS~Y", 800);
      g.addEdge("AIIMS~Y", "Green Park~Y", 1000);
      g.addEdge("Green Park~Y", "Hauz Khas~Y", 1800);
      g.addEdge("Hauz Khas~Y", "Malviya Nagar~Y", 1700);
      g.addEdge("Malviya Nagar~Y", "Saket~Y", 900);
      g.addEdge("Saket~Y", "Qutab Minar~Y", 1700);
      g.addEdge("Qutab Minar~Y", "Chhattarpur~Y", 1300);
      g.addEdge("Chhattarpur~Y", "Sultanpur~Y", 1600);
      g.addEdge("Sultanpur~Y", "Ghitorni~Y", 1300);
      g.addEdge("Ghitorni~Y", "Arjan Garh~Y", 2700);
      g.addEdge("Arjan Garh~Y", "Guru Dronacharya~Y", 2300);
      g.addEdge("Guru Dronacharya~Y", "Sikandarpur~Y", 1000);
      g.addEdge("Sikandarpur~Y", "MG Road~Y", 1200);
      g.addEdge("MG Road~Y", "IFFCO Chowk~Y", 1100);
      g.addEdge("IFFCO Chowk~Y", "Huda City Centre~Y", 1500);

      // Blue Line
      g.addEdge("Dwarka Sector 21~B", "Dwarka Sector 8~B", 1700);
      g.addEdge("Dwarka Sector 8~B", "Dwarka Sector 9~B", 1000);
      g.addEdge("Dwarka Sector 9~B", "Dwarka Sector 10~B", 1100);
      g.addEdge("Dwarka Sector 10~B", "Dwarka Sector 11~B", 1000);
      g.addEdge("Dwarka Sector 11~B", "Dwarka Sector 12~B", 1000);
      g.addEdge("Dwarka Sector 12~B", "Dwarka Sector 13~B", 900);
      g.addEdge("Dwarka Sector 13~B", "Dwarka Sector 14~B", 900);
      g.addEdge("Dwarka Sector 14~B", "Dwarka~B", 1500);
      g.addEdge("Dwarka~B", "Dwarka Mor~B", 1100);
      g.addEdge("Dwarka Mor~B", "Nawada~B", 1200);
      g.addEdge("Nawada~B", "Uttam Nagar West~B", 1000);
      g.addEdge("Uttam Nagar West~B", "Uttam Nagar East~B", 1000);
      g.addEdge("Uttam Nagar East~B", "Janak Puri West~B", 1300);
      g.addEdge("Janak Puri West~B", "Janak Puri East~B", 1000);
      g.addEdge("Janak Puri East~B", "Tilak Nagar~B", 1000);
      g.addEdge("Tilak Nagar~B", "Subhash Nagar~B", 1000);
      g.addEdge("Subhash Nagar~B", "Tagore Garden~B", 900);
      g.addEdge("Tagore Garden~B", "Rajouri Garden~B", 1100);
      g.addEdge("Rajouri Garden~B", "Ramesh Nagar~B", 1000);
      g.addEdge("Ramesh Nagar~B", "Moti Nagar~B", 1200);
      g.addEdge("Moti Nagar~B", "Kirti Nagar~B", 1000);
      g.addEdge("Kirti Nagar~B", "Shadipur~B", 700);
      g.addEdge("Shadipur~B", "Patel Nagar~B", 1300);
      g.addEdge("Patel Nagar~B", "Rajendra Place~B", 900);
      g.addEdge("Rajendra Place~B", "Karol Bagh~B", 1000);
      g.addEdge("Karol Bagh~B", "Jhandewalan~B", 1200);
      g.addEdge("Jhandewalan~B", "RK Ashram Marg~B", 1000);
      g.addEdge("RK Ashram Marg~B", "Rajiv Chowk~B", 1200);
      g.addEdge("Rajiv Chowk~B", "Barakhamba~B", 700);
      g.addEdge("Barakhamba~B", "Mandi House~B", 1000);
      g.addEdge("Mandi House~B", "Supreme Court (Pragati Maidan)~B", 800);
      g.addEdge("Supreme Court (Pragati Maidan)~B", "Indraprastha~B", 800);
      g.addEdge("Indraprastha~B", "Yamuna Bank~B", 1800);
      g.addEdge("Yamuna Bank~B", "Akshardham~B", 1300);
      g.addEdge("Akshardham~B", "Mayur Vihar Phase-1~B", 1800);
      g.addEdge("Mayur Vihar Phase-1~B", "Mayur Vihar Extention~B", 1200);
      g.addEdge("Mayur Vihar Extention~B", "New Ashok Nagar~B", 900);
      g.addEdge("New Ashok Nagar~B", "Noida Sector 15~B", 1000);
      g.addEdge("Noida Sector 15~B", "Noida Sector 16~B", 1100);
      g.addEdge("Noida Sector 16~B", "Noida Sector 18~B", 1100);
      g.addEdge("Noida Sector 18~B", "Botanical Garden~B", 1100);
      g.addEdge("Botanical Garden~B", "Golf Course~B", 1200);
      g.addEdge("Golf Course~B", "Noida City Center~B", 1300);
      g.addEdge("Noida City Center~B", "Noida Sector 34~B", 900);
      g.addEdge("Noida Sector 34~B", "Noida Sector 52~B", 1200);
      g.addEdge("Noida Sector 52~B", "Noida Sector 61~B", 1200);
      g.addEdge("Noida Sector 61~B", "Noida Sector 59~B", 1000);
      g.addEdge("Noida Sector 59~B", "Noida Sector 62~B", 1200);

      // Blue Line Branch
      g.addEdge("Yamuna Bank~BL", "Laxmi Nagar~BL", 1300);
      g.addEdge("Laxmi Nagar~BL", "Nirman Vihar~BL", 1100);
      g.addEdge("Nirman Vihar~BL", "Preet Vihar~BL", 1000);
      g.addEdge("Preet Vihar~BL", "Karkar Duma~BL", 1200);
      g.addEdge("Karkar Duma~BL", "Anand Vihar~BL", 1100);
      g.addEdge("Anand Vihar~BL", "Kaushambi~BL", 800);
      g.addEdge("Kaushambi~BL", "Vaishali~BL", 1600);

      // Green Line
      g.addEdge("Inderlok~G", "Ashok Park Main~G", 1400);
      g.addEdge("Ashok Park Main~G", "Punjabi Bagh~G", 900);
      g.addEdge("Punjabi Bagh~G", "Shivaji Park~G", 1600);
      g.addEdge("Shivaji Park~G", "Madipur~G", 1100);
      g.addEdge("Madipur~G", "Paschim Vihar (East)~G", 700);
      g.addEdge("Paschim Vihar (East)~G", "Paschim Vihar (West)~G", 1000);
      g.addEdge("Paschim Vihar (West)~G", "Peera Garhi~G", 900);
      g.addEdge("Peera Garhi~G", "Udyog Nagar~G", 1200);
      g.addEdge("Udyog Nagar~G", "Maharaja Surajmal Stadium~G", 700);
      g.addEdge("Maharaja Surajmal Stadium~G", "Nangloi~G", 800);
      g.addEdge("Nangloi~G", "Nangloi Railway Station~G", 900);
      g.addEdge("Nangloi Railway Station~G", "Rajdhani Park~G", 1200);
      g.addEdge("Rajdhani Park~G", "Mundka~G", 1300);
      g.addEdge("Mundka~G", "Mundka Industrial Area (MIA)~G", 1300);
      g.addEdge("Mundka Industrial Area (MIA)~G", "Ghevra Metro station~G", 2100);
      g.addEdge("Ghevra Metro station~G", "Tikri Kalan~G", 1800);
      g.addEdge("Tikri Kalan~G", "Tikri Border~G", 1300);
      g.addEdge("Tikri Border~G", "Pandit Shree Ram Sharma~G", 1300);
      g.addEdge("Pandit Shree Ram Sharma~G", "Bahdurgarh City~G", 1500);
      g.addEdge("Bahdurgarh City~G", "Brigadier Hoshiar Singh~G", 1800);

      // Green Line Branch
      g.addEdge("Ashok Park Main~GB", "Satguru Ram Singh Marg~GB", 1100);
      g.addEdge("Satguru Ram Singh Marg~GB", "Kirti Nagar~GB", 1000);

      // Violet Line
      g.addEdge("Kashmere Gate~V", "Lal Quila~V", 1500);
      g.addEdge("Lal Quila~V", "Jama Masjid~V", 800);
      g.addEdge("Jama Masjid~V", "Delhi Gate~V", 1400);
      g.addEdge("Delhi Gate~V", "ITO~V", 1300);
      g.addEdge("ITO~V", "Mandi House~V", 800);
      g.addEdge("Mandi House~V", "Janpath~V", 1400);
      g.addEdge("Janpath~V", "Central Secretariat~V", 1300);
      g.addEdge("Central Secretariat~V", "Khan Market~V", 2100);
      g.addEdge("Khan Market~V", "Jawaharlal Nehru Stadium~V", 1400);
      g.addEdge("Jawaharlal Nehru Stadium~V", "Jangpura~V", 900);
      g.addEdge("Jangpura~V", "Lajpat Nagar~V", 1500);
      g.addEdge("Lajpat Nagar~V", "Moolchand~V", 700);
      g.addEdge("Moolchand~V", "Kailash Colony~V", 1300);
      g.addEdge("Kailash Colony~V", "Nehru Place~V", 1000);
      g.addEdge("Nehru Place~V", "Kalkaji Mandir~V", 800);
      g.addEdge("Kalkaji Mandir~V", "Govind Puri~V", 700);
      g.addEdge("Govind Puri~V", "Okhla~V", 1100);
      g.addEdge("Okhla~V", "Jasola~V", 900);
      g.addEdge("Jasola~V", "Sarita Vihar~V", 1200);
      g.addEdge("Sarita Vihar~V", "Mohan Estate~V", 1200);
      g.addEdge("Mohan Estate~V", "Tughlakabad~V", 1900);
      g.addEdge("Tughlakabad~V", "Badarpur Border~V", 1100);
      g.addEdge("Badarpur Border~V", "Sarai~V", 2500);
      g.addEdge("Sarai~V", "N.H.P.C. Chowk~V", 1600);
      g.addEdge("N.H.P.C. Chowk~V", "Mewala Maharajpur~V", 900);
      g.addEdge("Mewala Maharajpur~V", "Sector 28 Faridabad~V", 1200);
      g.addEdge("Sector 28 Faridabad~V", "Badkal Mor~V", 1700);
      g.addEdge("Badkal Mor~V", "Old Faridabad~V", 1200);
      g.addEdge("Old Faridabad~V", "Neelam Chowk Ajronda~V", 1600);
      g.addEdge("Neelam Chowk Ajronda~V", "Bata Chowk~V", 1300);
      g.addEdge("Bata Chowk~V", "Escorts Mujesar~V", 1800);
      g.addEdge("Escorts Mujesar~V", "Sant Surdas - Sihi~V", 1700);
      g.addEdge("Sant Surdas - Sihi~V", "Raja Nahar Singh~V", 1700);

      // Magenta Line
      g.addEdge("Janak Puri West~M", "Dabri Mor - Janakpuri South~M", 2000);
      // Magenta Line (continued)
      g.addEdge("Dashrath Puri~M", "Palam~M", 1500);
      g.addEdge("Palam~M", "Sadar Bazaar Cantonment~M", 2600);
      g.addEdge("Sadar Bazaar Cantonment~M", "Terminal 1 IGI Airport~M", 1700);
      g.addEdge("Terminal 1 IGI Airport~M", "Shankar Vihar~M", 1800);
      g.addEdge("Shankar Vihar~M", "Vasant Vihar~M", 2100);
      g.addEdge("Vasant Vihar~M", "Munirka~M", 1200);
      g.addEdge("Munirka~M", "RK Puram~M", 1400);
      g.addEdge("RK Puram~M", "IIT Delhi~M", 900);
      g.addEdge("IIT Delhi~M", "Hauz Khas~M", 1200);
      g.addEdge("Hauz Khas~M", "Panchsheel Park~M", 1500);
      g.addEdge("Panchsheel Park~M", "Chirag Delhi~M", 900);
      g.addEdge("Chirag Delhi~M", "Greater Kailash~M", 900);
      g.addEdge("Greater Kailash~M", "Nehru Enclave~M", 1300);
      g.addEdge("Nehru Enclave~M", "Kalkaji Mandir~M", 900);
      g.addEdge("Kalkaji Mandir~M", "Okhla NSIC~M", 800);
      g.addEdge("Okhla NSIC~M", "Sukhdev Vihar~M", 1100);
      g.addEdge("Sukhdev Vihar~M", "JAMIA MILLIA ISLAMIA~M", 1200);
      g.addEdge("JAMIA MILLIA ISLAMIA~M", "Okhla Vihar~M", 500);
      g.addEdge("Okhla Vihar~M", "Jasola Vihar Shaheen Bagh~M", 1800);
      g.addEdge("Jasola Vihar Shaheen Bagh~M", "Kalindi Kunj~M", 1400);
      g.addEdge("Kalindi Kunj~M", "Okhla Bird Sanctuary~M", 1600);
      g.addEdge("Okhla Bird Sanctuary~M", "Botanical Garden~M", 1700);

      // Pink Line
      g.addEdge("Majlis Park~P", "Azadpur~P", 2100);
      g.addEdge("Azadpur~P", "Shalimar Bagh~P", 1600);
      g.addEdge("Shalimar Bagh~P", "Netaji Subash Place~P", 1400);
      g.addEdge("Netaji Subash Place~P", "Shakurpur~P", 1200);
      g.addEdge("Shakurpur~P", "Punjabi Bagh West~P", 1400);
      g.addEdge("Punjabi Bagh West~P", "ESI BASAI DARAPUR~P", 2500);
      g.addEdge("ESI BASAI DARAPUR~P", "Rajouri Garden~P", 1100);
      g.addEdge("Rajouri Garden~P", "Maya Puri~P", 1500);
      g.addEdge("Maya Puri~P", "Naraina Vihar~P", 1500);
      g.addEdge("Naraina Vihar~P", "Delhi Cantt~P", 1800);
      g.addEdge("Delhi Cantt~P", "Durgabai Deshmukh South Campus~P", 3600);
      g.addEdge("Durgabai Deshmukh South Campus~P", "Sir Vishweshwaraiah Moti Bagh~P", 1300);
      g.addEdge("Sir Vishweshwaraiah Moti Bagh~P", "Bhikaji Cama Place~P", 1600);
      g.addEdge("Bhikaji Cama Place~P", "Sarojini Nagar~P", 1200);
      g.addEdge("Sarojini Nagar~P", "Dilli Haat INA~P", 1100);
      g.addEdge("Dilli Haat INA~P", "South Extension~P", 1200);
      g.addEdge("South Extension~P", "Lajpat Nagar~P", 1600);
      g.addEdge("Lajpat Nagar~P", "Vinobapuri~P", 1400);
      g.addEdge("Vinobapuri~P", "Ashram~P", 1200);
      g.addEdge("Ashram~P", "Sarai Kale Khan Hazrat Nizamuddin~P", 1900);
      g.addEdge("Sarai Kale Khan Hazrat Nizamuddin~P", "Mayur Vihar Phase-1~P", 3600);
      g.addEdge("Mayur Vihar Phase-1~P", "Mayur Vihar Pocket I~P", 800);
      g.addEdge("Mayur Vihar Pocket I~P", "Trilokpuri Sanjay Lake~P", 1300);
      g.addEdge("Trilokpuri Sanjay Lake~P", "Vinod Nagar East~P", 800);
      g.addEdge("Vinod Nagar East~P", "Mandawali - West Vinod Nagar~P", 600);
      g.addEdge("Mandawali - West Vinod Nagar~P", "IP Extension~P", 1000);
      g.addEdge("IP Extension~P", "Anand Vihar~P", 1600);
      g.addEdge("Anand Vihar~P", "Karkar Duma~P", 1000);
      g.addEdge("Karkar Duma~P", "Karkarduma Court~P", 1100);
      g.addEdge("Karkarduma Court~P", "Krishna Nagar~P", 700);
      g.addEdge("Krishna Nagar~P", "East Azad Nagar~P", 1000);
      g.addEdge("East Azad Nagar~P", "Welcome~P", 1100);
      g.addEdge("Welcome~P", "Jaffrabad~P", 1200);
      g.addEdge("Jaffrabad~P", "Maujpur~P", 1100);
      g.addEdge("Maujpur~P", "Gokulpuri~P", 1300);
      g.addEdge("Gokulpuri~P", "Johri Enclave~P", 1300);
      g.addEdge("Johri Enclave~P", "Shiv Vihar~P", 900);

      // Aqua Line
      g.addEdge("Noida Sector 51~A", "Noida Sector 50~A", 1300);
      g.addEdge("Noida Sector 50~A", "Noida Sector 76~A", 1000);
      g.addEdge("Noida Sector 76~A", "Noida Sector 101~A", 1100);
      g.addEdge("Noida Sector 101~A", "Noida Sector 81~A", 900);
      g.addEdge("Noida Sector 81~A", "NSEZ Noida~A", 2000);
      g.addEdge("NSEZ Noida~A", "Noida Sector 83~A", 1100);
      g.addEdge("Noida Sector 83~A", "Noida Sector 137~A", 1500);
      g.addEdge("Noida Sector 137~A", "Noida Sector 142~A", 1600);
      g.addEdge("Noida Sector 142~A", "Noida Sector 143~A", 1000);
      g.addEdge("Noida Sector 143~A", "Noida Sector 144~A", 1400);
      g.addEdge("Noida Sector 144~A", "Noida Sector 145~A", 1200);
      g.addEdge("Noida Sector 145~A", "Noida Sector 146~A", 1700);
      g.addEdge("Noida Sector 146~A", "Noida Sector 147~A", 1500);
      g.addEdge("Noida Sector 147~A", "Noida Sector 148~A", 1600);
      g.addEdge("Noida Sector 148~A", "Knowledge Park II~A", 2500);
      g.addEdge("Knowledge Park II~A", "Pari Chowk Greater Noida~A", 1100);
      g.addEdge("Pari Chowk Greater Noida~A", "Alpha 1 Greater Noida~A", 900);
      g.addEdge("Alpha 1 Greater Noida~A", "Delta 1 Greater Noida~A", 1500);
      g.addEdge("Delta 1 Greater Noida~A", "GNIDA Office~A", 1300);
      g.addEdge("GNIDA Office~A", "Depot Greater Noida~A", 900);

      // Gray Line
      g.addEdge("Dwarka~GR", "Nangli~GR", 1500);
      g.addEdge("Nangli~GR", "Najafgarh~GR", 2400);

      // Orange Line
      g.addEdge("New Delhi-Airport Express~O", "Shivaji Stadium~O", 1900);
      g.addEdge("Shivaji Stadium~O", "Dhaula Kuan~O", 6400);
      g.addEdge("Dhaula Kuan~O", "Delhi Aerocity~O", 6200);
      g.addEdge("Delhi Aerocity~O", "IGI Airport~O", 3400);
      g.addEdge("IGI Airport~O", "Dwarka Sector 21~O", 2900);

      // Rapid Metro
      g.addEdge("Sector 55-66~RM", "Sector 54 Chowk~RM", 1100);
      g.addEdge("Sector 54 Chowk~RM", "Sector 53-54~RM", 1500);
      g.addEdge("Sector 53-54~RM", "Sector 42-43~RM", 1300);
      g.addEdge("Sector 42-43~RM", "DLF Phase 1~RM", 1600);
      g.addEdge("DLF Phase 1~RM", "Sikandarpur~RM", 1100);
      g.addEdge("Sikandarpur~RM", "DLF Phase 2~RM", 700);
      g.addEdge("DLF Phase 2~RM", "Belvedere Towers~RM", 700);
      g.addEdge("Belvedere Towers~RM", "Cyber City~RM", 600);
      g.addEdge("Cyber City~RM", "Moulsari Avenue~RM", 600);
      g.addEdge("Moulsari Avenue~RM", "DLF Phase 3~RM", 800);

      // Add interchanges between lines
      // Kashmere Gate (Red, Yellow, Violet)
      g.addEdge("Kashmere Gate~R", "Kashmere Gate~Y", 5);
      g.addEdge("Kashmere Gate~R", "Kashmere Gate~V", 5);
      g.addEdge("Kashmere Gate~Y", "Kashmere Gate~V", 5);

      // Inderlok (Red, Green)
      g.addEdge("Inderlok~R", "Inderlok~G", 5);

      // Netaji Subash Place (Red, Pink)
      g.addEdge("Netaji Subash Place~R", "Netaji Subash Place~P", 5);

      // Rajiv Chowk (Blue, Yellow)
      g.addEdge("Rajiv Chowk~B", "Rajiv Chowk~Y", 5);

      // Mandi House (Blue, Violet)
      g.addEdge("Mandi House~B", "Mandi House~V", 5);

      // Central Secretariat (Yellow, Violet)
      g.addEdge("Central Secretariat~Y", "Central Secretariat~V", 5);

      // Dilli Haat INA (Yellow, Pink)
      g.addEdge("Dilli Haat INA~Y", "Dilli Haat INA~P", 5);

      // Lajpat Nagar (Violet, Pink)
      g.addEdge("Lajpat Nagar~V", "Lajpat Nagar~P", 5);

      // Kalkaji Mandir (Violet, Magenta)
      g.addEdge("Kalkaji Mandir~V", "Kalkaji Mandir~M", 5);

      // Botanical Garden (Blue, Magenta)
      g.addEdge("Botanical Garden~B", "Botanical Garden~M", 5);

      // Janak Puri West (Blue, Magenta)
      g.addEdge("Janak Puri West~B", "Janak Puri West~M", 5);

      // Rajouri Garden (Blue, Pink)
      g.addEdge("Rajouri Garden~B", "Rajouri Garden~P", 5);

      // Kirti Nagar (Blue, Green Branch)
      g.addEdge("Kirti Nagar~B", "Kirti Nagar~GB", 5);

      // Azadpur (Yellow, Pink)
      g.addEdge("Azadpur~Y", "Azadpur~P", 5);

      // Welcome (Red, Pink)
      g.addEdge("Welcome~R", "Welcome~P", 5);

      // Mayur Vihar Phase-1 (Blue, Pink)
      g.addEdge("Mayur Vihar Phase-1~B", "Mayur Vihar Phase-1~P", 5);

      // Anand Vihar (Blue Branch, Pink)
      g.addEdge("Anand Vihar~BL", "Anand Vihar~P", 5);

      // Karkar Duma (Blue Branch, Pink)
      g.addEdge("Karkar Duma~BL", "Karkar Duma~P", 5);

      // Hauz Khas (Yellow, Magenta)
      g.addEdge("Hauz Khas~Y", "Hauz Khas~M", 5);

      // Sikandarpur (Yellow, Rapid Metro)
      g.addEdge("Sikandarpur~Y", "Sikandarpur~RM", 5);

      // New Delhi (Yellow, Orange)
      g.addEdge("New Delhi~Y", "New Delhi-Airport Express~O", 5);

      // Dwarka Sector 21 (Blue, Orange)
      g.addEdge("Dwarka Sector 21~B", "Dwarka Sector 21~O", 5);

      // Dwarka (Blue, Gray)
      g.addEdge("Dwarka~B", "Dwarka~GR", 5);

      return g;
    }
  }
  
  // Heap implementation in JavaScript
  class Heap {
    constructor(compareFn = (a, b) => a.cost - b.cost) {
      this.data = [];
      this.map = new Map();
      this.compareFn = compareFn;
    }
  
    add(item) {
      this.data.push(item);
      this.map.set(item, this.data.length - 1);
      this.upheapify(this.data.length - 1);
    }
  
    upheapify(ci) {
      if (ci === 0) return;
      const pi = Math.floor((ci - 1) / 2);
      if (this.compareFn(this.data[ci], this.data[pi]) < 0) {
        this.swap(pi, ci);
        this.upheapify(pi);
      }
    }
  
    swap(i, j) {
      const ith = this.data[i];
      const jth = this.data[j];
      this.data[i] = jth;
      this.data[j] = ith;
      this.map.set(ith, j);
      this.map.set(jth, i);
    }
  
    size() {
      return this.data.length;
    }
  
    isEmpty() {
      return this.size() === 0;
    }
  
    remove() {
      this.swap(0, this.data.length - 1);
      const rv = this.data.pop();
      this.downheapify(0);
      this.map.delete(rv);
      return rv;
    }
  
    downheapify(pi) {
      const lci = 2 * pi + 1;
      const rci = 2 * pi + 2;
      let mini = pi;
  
      if (lci < this.data.length && this.compareFn(this.data[lci], this.data[mini]) < 0) {
        mini = lci;
      }
  
      if (rci < this.data.length && this.compareFn(this.data[rci], this.data[mini]) < 0) {
        mini = rci;
      }
  
      if (mini !== pi) {
        this.swap(mini, pi);
        this.downheapify(mini);
      }
    }
  
    get() {
      return this.data[0];
    }
  
    updatePriority(pair) {
      const index = this.map.get(pair);
      this.upheapify(index);
    }
  }
  
  export default MetroGraph;