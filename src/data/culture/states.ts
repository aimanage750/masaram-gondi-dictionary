import type { StateTribal } from "./types";
import { CENSUS, MOTA, TRTI, V } from "./overview";

/**
 * State-wise tribal data — Census of India 2011 (compiled by TRTI
 * Maharashtra / Census 2011 ST tables). Populations in persons.
 * AP 2011 = undivided Andhra Pradesh including Telangana.
 */
export const STATES: StateTribal[] = [
  { state: "Madhya Pradesh", region: "central", total_population_2011: 72_627_000, st_population_2011: 15_317_000, st_percent: 21.09, major_communities: ["Gond", "Bhil", "Baiga", "Korku", "Sahariya"], major_regions: ["Mandla", "Balaghat", "Dindori", "Seoni", "Chhindwara", "Betul", "Jhabua"] },
  { state: "Maharashtra", region: "central", total_population_2011: 112_374_000, st_population_2011: 10_510_000, st_percent: 9.35, major_communities: ["Warli", "Korku", "Bhil", "Mahadev Koli", "Thakar"], major_regions: ["Melghat (Amravati)", "Gadchiroli", "Chandrapur", "Palghar", "Nashik"] },
  { state: "Odisha", region: "east", total_population_2011: 41_974_000, st_population_2011: 9_591_000, st_percent: 22.85, major_communities: ["Santal", "Kondh", "Oraon", "Saora", "Bonda"], major_regions: ["Koraput", "Malkangiri", "Rayagada", "Mayurbhanj"] },
  { state: "Rajasthan", region: "west", total_population_2011: 68_548_000, st_population_2011: 9_239_000, st_percent: 13.48, major_communities: ["Meena", "Bhil", "Garasia", "Sahariya"], major_regions: ["Udaipur", "Banswara", "Dungarpur", "Baran"] },
  { state: "Gujarat", region: "west", total_population_2011: 60_440_000, st_population_2011: 8_917_000, st_percent: 14.75, major_communities: ["Bhil", "Rathwa", "Dangi", "Warli", "Chaudhari"], major_regions: ["Dang", "Panchmahal", "Tapi", "Vadodara (rural)"] },
  { state: "Jharkhand", region: "east", total_population_2011: 32_988_000, st_population_2011: 8_645_000, st_percent: 26.21, major_communities: ["Santhal", "Oraon", "Munda", "Ho", "Kharia"], major_regions: ["Ranchi", "Dumka", "West Singhbhum", "Khunti"] },
  { state: "Chhattisgarh", region: "central", total_population_2011: 25_545_000, st_population_2011: 7_823_000, st_percent: 30.62, major_communities: ["Gond (Maria, Muria)", "Baiga", "Oraon", "Halba", "Kamar"], major_regions: ["Bastar", "Dantewada", "Surguja", "Rajnandgaon"] },
  { state: "West Bengal", region: "east", total_population_2011: 91_276_000, st_population_2011: 5_297_000, st_percent: 5.8, major_communities: ["Santhal", "Oraon", "Munda", "Bhumij", "Lodha"], major_regions: ["Purulia", "Bankura", "Jhargram", "Alipurduar"] },
  { state: "Andhra Pradesh (incl. Telangana, 2011)", region: "south", total_population_2011: 84_581_000, st_population_2011: 5_918_000, st_percent: 7.0, major_communities: ["Gond / Koya", "Lambadi (Banjara)", "Chenchu", "Konda Reddi"], major_regions: ["Adilabad", "Komaram Bheem Asifabad", "Bhadradi Kothagudem", "Nallamala hills"] },
  { state: "Karnataka", region: "south", total_population_2011: 61_095_000, st_population_2011: 4_249_000, st_percent: 6.95, major_communities: ["Nayaka", "Koraga", "Soliga", "Hakki Pikki"], major_regions: ["Chamarajanagar (BR Hills)", "Vijayapura", "coastal districts"] },
  { state: "Assam", region: "northeast", total_population_2011: 31_206_000, st_population_2011: 3_884_000, st_percent: 12.45, major_communities: ["Bodo", "Mising", "Karbi", "Rabha", "Dimasa"], major_regions: ["Kokrajhar / Chirang (Bodoland)", "Majuli", "Karbi Anglong", "Dima Hasao"] },
  { state: "Meghalaya", region: "northeast", total_population_2011: 2_967_000, st_population_2011: 2_556_000, st_percent: 86.15, major_communities: ["Khasi", "Garo", "Jaintia"], major_regions: ["East Khasi Hills", "West Garo Hills"] },
  { state: "Nagaland", region: "northeast", total_population_2011: 1_979_000, st_population_2011: 1_711_000, st_percent: 86.46, major_communities: ["Naga (Angami, Ao, Lotha, Sumi)"], major_regions: ["Kohima", "Mokokchung", "Tuensang"] },
  { state: "Jammu & Kashmir (2011 state)", region: "himalaya", total_population_2011: 12_541_000, st_population_2011: 1_493_000, st_percent: 11.9, major_communities: ["Gujjar & Bakarwal", "Gaddi", "Balti", "Broqpa"], major_regions: ["Rajouri–Poonch", "Kargil", "Leh"] },
  { state: "Bihar", region: "east", total_population_2011: 104_099_000, st_population_2011: 1_337_000, st_percent: 1.28, major_communities: ["Santhal", "Oraon", "Munda"], major_regions: ["Banka", "Jamui", "Kaimur"] },
  { state: "Uttar Pradesh", region: "north", total_population_2011: 199_812_000, st_population_2011: 1_134_000, st_percent: 0.57, major_communities: ["Tharu", "Bhoksa"], major_regions: ["Pilibhit", "Lakhimpur Kheri", "Sonbhadra"] },
  { state: "Tripura", region: "northeast", total_population_2011: 3_674_000, st_population_2011: 1_167_000, st_percent: 31.76, major_communities: ["Tripuri (Debbarma)", "Reang (Bru)", "Jamatia", "Halam"], major_regions: ["Dhalai", "South Tripura"] },
  { state: "Manipur", region: "northeast", total_population_2011: 2_570_000, st_population_2011: 903_000, st_percent: 35.14, major_communities: ["Naga (Tangkhul, Maram)", "Kuki (Thadou)"], major_regions: ["Ukhrul", "Senapati", "Chandel"] },
  { state: "Mizoram", region: "northeast", total_population_2011: 1_097_000, st_population_2011: 1_036_000, st_percent: 94.44, major_communities: ["Mizo (Lushai)", "Chakma", "Pawi"], major_regions: ["state-wide"] },
  { state: "Arunachal Pradesh", region: "northeast", total_population_2011: 1_384_000, st_population_2011: 952_000, st_percent: 68.79, major_communities: ["Nyishi", "Adi", "Apatani", "Mishmi"], major_regions: ["Ziro (Lower Subansiri)", "Siang valleys", "Dibang valley"] },
  { state: "Tamil Nadu", region: "south", total_population_2011: 72_147_000, st_population_2011: 795_000, st_percent: 1.1, major_communities: ["Toda", "Kota", "Irula", "Kurumba"], major_regions: ["Nilgiris"] },
  { state: "Kerala", region: "south", total_population_2011: 33_406_000, st_population_2011: 485_000, st_percent: 1.45, major_communities: ["Paniya", "Adiyan", "Kurumba", "Kanikkaran"], major_regions: ["Wayanad", "Attappadi (Palakkad)"] },
  { state: "Himachal Pradesh", region: "himalaya", total_population_2011: 6_865_000, st_population_2011: 392_000, st_percent: 5.71, major_communities: ["Gaddi", "Gujjar", "Kinnaura", "Lahaula (Bhot)"], major_regions: ["Chamba (Bharmour)", "Kinnaur", "Lahaul–Spiti"] },
  { state: "Uttarakhand", region: "himalaya", total_population_2011: 10_086_000, st_population_2011: 292_000, st_percent: 2.9, major_communities: ["Jaunsari", "Tharu", "Bhotia", "Boksa"], major_regions: ["Jaunsar (Dehradun)", "Pithoragarh", "Udham Singh Nagar"] },
  { state: "Sikkim", region: "northeast", total_population_2011: 611_000, st_population_2011: 206_000, st_percent: 33.72, major_communities: ["Bhutia", "Lepcha"], major_regions: ["North Sikkim", "Dzongu"] },
  { state: "Goa", region: "west", total_population_2011: 1_459_000, st_population_2011: 149_000, st_percent: 10.21, major_communities: ["Kunbi", "Velip"], major_regions: ["Sattari", "Sanguem"] },
  { state: "Dadra & Nagar Haveli (UT)", region: "west", total_population_2011: 343_000, st_population_2011: 178_564, st_percent: 51.9, major_communities: ["Kokna", "Dhodia", "Warli", "Varli"], major_regions: ["Silvassa rural belt"] },
  { state: "Daman & Diu (UT)", region: "west", total_population_2011: 243_000, st_population_2011: 15_363, st_percent: 6.3, major_communities: ["Dubla", "Kathodi"], major_regions: ["Daman rural pockets"] },
  { state: "Lakshadweep (UT)", region: "islands", total_population_2011: 64_000, st_population_2011: 61_120, st_percent: 94.8, major_communities: ["Island communities (ST-notified)"], major_regions: ["Kavaratti", "Andrott", "Minicoy"] },
  { state: "Andaman & Nicobar Islands (UT)", region: "islands", total_population_2011: 380_000, st_population_2011: 28_530, st_percent: 7.5, major_communities: ["Nicobarese", "Jarawa", "Onge", "Great Andamanese", "Sentinelese"], major_regions: ["Nicobar group", "Little Andaman", "North Sentinel"] },
  { state: "Haryana · Punjab · Delhi · Chandigarh · Puducherry", region: "north", total_population_2011: 0, st_population_2011: null, st_percent: null, major_communities: [], major_regions: [] },
];

export const STATE_DATA_SOURCE = { census: CENSUS, trti: TRTI, mota: MOTA, verified: V };
