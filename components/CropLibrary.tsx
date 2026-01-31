import React, { useState } from 'react';
import { ArrowLeft, Search, Droplets, Thermometer, Sprout, Sun, Leaf, ArrowRight, Wheat, Flower, Utensils, Trees } from 'lucide-react';
import { CropData } from '../types';

interface CropLibraryProps {
  onClose: () => void;
}

// Extensive Data for the Library
const CROP_DATABASE: CropData[] = [
  // --- Field Crops ---
  {
    id: 'fc1',
    name: 'Paddy (Rice)',
    tamilName: 'நெல்',
    type: 'Field Crop',
    description: 'The primary staple food crop in Tamil Nadu. Requires flooded fields.',
    soil: 'Clayey or clay-loam soil with good water retention.',
    climate: 'Hot and humid (20°C - 35°C).',
    water: 'High water requirement, needs standing water.',
    iconName: 'wheat'
  },
  {
    id: 'fc2',
    name: 'Wheat',
    tamilName: 'கோதுமை',
    type: 'Field Crop',
    description: 'Major cereal crop. Best grown in cooler seasons.',
    soil: 'Well-drained loam or clay loam.',
    climate: 'Cool winter (10°C - 25°C).',
    water: 'Moderate, 4-6 irrigations needed.',
    iconName: 'wheat'
  },
  {
    id: 'fc3',
    name: 'Maize',
    tamilName: 'மக்காச்சோளம்',
    type: 'Field Crop',
    description: 'Queen of cereals. Used for food, fodder, and industrial raw material.',
    soil: 'Loamy or sand-loam soil rich in organic matter.',
    climate: 'Warm weather, 18°C - 27°C.',
    water: 'Moderate, sensitive to water logging.',
    iconName: 'wheat'
  },
  {
    id: 'fc4',
    name: 'Finger Millet (Ragi)',
    tamilName: 'கேழ்வரகு',
    type: 'Field Crop',
    description: 'Hardy crop, highly nutritious and rich in calcium.',
    soil: 'Sandy loam to clay loam.',
    climate: 'Tropical and sub-tropical.',
    water: 'Low, drought-tolerant.',
    iconName: 'wheat'
  },
  {
    id: 'fc5',
    name: 'Pearl Millet (Bajra/Kambu)',
    tamilName: 'கம்பு',
    type: 'Field Crop',
    description: 'Drought tolerant crop grown in arid regions.',
    soil: 'Sandy or sandy loam soils.',
    climate: 'Warm and dry climate.',
    water: 'Low water requirement.',
    iconName: 'wheat'
  },
  {
    id: 'fc6',
    name: 'Cotton',
    tamilName: 'பருத்தி',
    type: 'Field Crop',
    description: 'Major fiber crop ("White Gold").',
    soil: 'Deep black soil (Regur soil) is ideal.',
    climate: 'Tropical, needs 21°C - 30°C.',
    water: 'Moderate, needs dry spell during maturation.',
    iconName: 'flower'
  },
  {
    id: 'fc7',
    name: 'Sugarcane',
    tamilName: 'கரும்பு',
    type: 'Field Crop',
    description: 'Long duration crop for sugar production.',
    soil: 'Deep rich loamy soil.',
    climate: 'Hot and humid climate.',
    water: 'Very high irrigation needed.',
    iconName: 'wheat'
  },
  {
    id: 'fc8',
    name: 'Groundnut',
    tamilName: 'வேர்க்கடலை',
    type: 'Field Crop',
    description: 'Important oilseed crop. Pods develop underground.',
    soil: 'Sandy loam or loamy soil.',
    climate: 'Tropical, 25°C - 30°C.',
    water: 'Moderate, critical during pegging.',
    iconName: 'seed'
  },
  {
    id: 'fc9',
    name: 'Black Gram',
    tamilName: 'உளுந்து',
    type: 'Field Crop',
    description: 'Major pulse crop, rich in protein.',
    soil: 'Loam or clay loam.',
    climate: 'Warm and humid.',
    water: 'Moderate.',
    iconName: 'seed'
  },
  {
    id: 'fc10',
    name: 'Red Gram (Toor Dal)',
    tamilName: 'துவரை',
    type: 'Field Crop',
    description: 'Deep rooted crop, drought tolerant.',
    soil: 'Well drained loamy soil.',
    climate: 'Tropical and subtropical.',
    water: 'Low to moderate.',
    iconName: 'seed'
  },
  {
    id: 'fc11',
    name: 'Green Gram (Moong Dal)',
    tamilName: 'பாசிப்பயறு',
    type: 'Field Crop',
    description: 'Short duration pulse crop.',
    soil: 'Loams and sandy loams.',
    climate: 'Warm climate.',
    water: 'Moderate.',
    iconName: 'seed'
  },
  {
    id: 'fc12',
    name: 'Chickpea (Bengal Gram)',
    tamilName: 'கொண்டைக்கடலை',
    type: 'Field Crop',
    description: 'Important pulse crop rich in protein.',
    soil: 'Sandy loam to clay loam.',
    climate: 'Cool and dry.',
    water: 'Moderate.',
    iconName: 'seed'
  },
  {
    id: 'fc13',
    name: 'Horse Gram',
    tamilName: 'கொள்ளு',
    type: 'Field Crop',
    description: 'Drought hardy pulse crop.',
    soil: 'Poor soils, red loam.',
    climate: 'Dry tropical.',
    water: 'Very Low.',
    iconName: 'seed'
  },

  // --- Vegetables ---
  {
    id: 'v1',
    name: 'Tomato',
    tamilName: 'தக்காளி',
    type: 'Vegetable',
    description: 'Widely grown vegetable. Susceptible to early blight.',
    soil: 'Well-drained sandy loam.',
    climate: 'Warm season, 18°C - 27°C.',
    water: 'Moderate, regular irrigation.',
    iconName: 'sprout'
  },
  {
    id: 'v2',
    name: 'Brinjal (Eggplant)',
    tamilName: 'கத்தரிக்காய்',
    type: 'Vegetable',
    description: 'Hardy crop, popularly known as Eggplant.',
    soil: 'Silt loam or clay loam.',
    climate: 'Warm season.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'v3',
    name: 'Chili',
    tamilName: 'மிளகாய்',
    type: 'Vegetable',
    description: 'Spicy fruit used in cuisine.',
    soil: 'Black soil or well-drained loam.',
    climate: 'Warm and humid.',
    water: 'Moderate, avoid stagnation.',
    iconName: 'sprout'
  },
  {
    id: 'v4',
    name: 'Okra (Ladies Finger)',
    tamilName: 'வெண்டைக்காய்',
    type: 'Vegetable',
    description: 'Fast growing vegetable crop.',
    soil: 'Sandy loam to clay loam.',
    climate: 'Warm growing season.',
    water: 'Regular irrigation needed.',
    iconName: 'sprout'
  },
  {
    id: 'v5',
    name: 'Onion',
    tamilName: 'வெங்காயம்',
    type: 'Vegetable',
    description: 'Bulbous vegetable essential for Indian cooking.',
    soil: 'Rich loamy soil.',
    climate: 'Cool season for growth, warm for maturity.',
    water: 'Frequent light irrigation.',
    iconName: 'sprout'
  },
  {
    id: 'v6',
    name: 'Potato',
    tamilName: 'உருளைக்கிழங்கு',
    type: 'Vegetable',
    description: 'Major tuber crop.',
    soil: 'Well-drained sandy loam.',
    climate: 'Cool climate needed.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'v7',
    name: 'Drumstick',
    tamilName: 'முருங்கை',
    type: 'Vegetable',
    description: 'Perennial vegetable tree, drought resistant.',
    soil: 'Sandy loam.',
    climate: 'Hot and dry.',
    water: 'Low, rainfed is often sufficient.',
    iconName: 'tree'
  },
  {
    id: 'v8',
    name: 'Bitter Gourd',
    tamilName: 'பாகற்காய்',
    type: 'Vegetable',
    description: 'Medicinal vegetable with bitter taste.',
    soil: 'Well-drained sandy loam.',
    climate: 'Warm season.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'v9',
    name: 'Pumpkin',
    tamilName: 'பூசணிக்காய்',
    type: 'Vegetable',
    description: 'Trailing vine crop.',
    soil: 'Loam with good drainage.',
    climate: 'Warm season.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'v10',
    name: 'Spinach (Keerai)',
    tamilName: 'கீரை',
    type: 'Vegetable',
    description: 'Leafy green vegetable, rich in iron.',
    soil: 'Well-drained loamy soil.',
    climate: 'Cool to moderate.',
    water: 'Frequent and shallow.',
    iconName: 'sprout'
  },
  {
    id: 'v11',
    name: 'Garlic',
    tamilName: 'பூண்டு',
    type: 'Vegetable',
    description: 'Bulbous spice crop, medicinal value.',
    soil: 'Fertile well-drained loam.',
    climate: 'Cool and moist.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'v12',
    name: 'Cluster Beans',
    tamilName: 'கொத்தவரங்காய்',
    type: 'Vegetable',
    description: 'Drought tolerant vegetable.',
    soil: 'Well drained sandy loam.',
    climate: 'Warm.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'v13',
    name: 'Elephant Foot Yam',
    tamilName: 'சேனைக்கிழங்கு',
    type: 'Vegetable',
    description: 'Tuber crop rich in starch.',
    soil: 'Sandy loam with organic matter.',
    climate: 'Warm and humid.',
    water: 'Moderate.',
    iconName: 'sprout'
  },

  // --- Fruits ---
  {
    id: 'fr1',
    name: 'Banana',
    tamilName: 'வாழை',
    type: 'Fruit',
    description: 'Important fruit crop, requires wind protection.',
    soil: 'Rich loamy soil.',
    climate: 'Tropical warm humid.',
    water: 'High requirement.',
    iconName: 'tree'
  },
  {
    id: 'fr2',
    name: 'Mango',
    tamilName: 'மாம்பழம்',
    type: 'Fruit',
    description: 'The King of Fruits.',
    soil: 'Alluvial to lateritic.',
    climate: 'Tropical to sub-tropical.',
    water: 'Moderate.',
    iconName: 'tree'
  },
  {
    id: 'fr3',
    name: 'Papaya',
    tamilName: 'பப்பாளி',
    type: 'Fruit',
    description: 'Fast growing tropical fruit.',
    soil: 'Well-drained sandy loam.',
    climate: 'Tropical, sensitive to frost.',
    water: 'High, avoid water logging.',
    iconName: 'tree'
  },
  {
    id: 'fr4',
    name: 'Guava',
    tamilName: 'கொய்யா',
    type: 'Fruit',
    description: 'Hardy fruit, rich in Vitamin C.',
    soil: 'Adapts to most soils.',
    climate: 'Tropical and subtropical.',
    water: 'Low to moderate.',
    iconName: 'tree'
  },
  {
    id: 'fr5',
    name: 'Pomegranate',
    tamilName: 'மாதுளை',
    type: 'Fruit',
    description: 'Drought hardy fruit crop.',
    soil: 'Loamy to sandy soil.',
    climate: 'Semi-arid.',
    water: 'Low.',
    iconName: 'tree'
  },
  {
    id: 'fr6',
    name: 'Jackfruit',
    tamilName: 'பலா',
    type: 'Fruit',
    description: 'Largest tree-borne fruit.',
    soil: 'Deep alluvial soil.',
    climate: 'Humid tropical.',
    water: 'Rainfed.',
    iconName: 'tree'
  },
  {
    id: 'fr7',
    name: 'Lemon (Citrus)',
    tamilName: 'எலுமிச்சை',
    type: 'Fruit',
    description: 'Acid lime, used daily in households.',
    soil: 'Light loamy well drained.',
    climate: 'Tropical and subtropical.',
    water: 'Regular irrigation.',
    iconName: 'tree'
  },
  {
    id: 'fr8',
    name: 'Watermelon',
    tamilName: 'தர்பூசணி',
    type: 'Fruit',
    description: 'Summer crop with high water content.',
    soil: 'Sandy loam.',
    climate: 'Hot and dry.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'fr9',
    name: 'Sapota',
    tamilName: 'சப்போட்டா',
    type: 'Fruit',
    description: 'Sweet tropical fruit.',
    soil: 'Alluvial, sandy loam.',
    climate: 'Tropical.',
    water: 'Moderate.',
    iconName: 'tree'
  },
  {
    id: 'fr10',
    name: 'Amla (Gooseberry)',
    tamilName: 'நெல்லிக்காய்',
    type: 'Fruit',
    description: 'Highly medicinal fruit.',
    soil: 'Light and heavy soils.',
    climate: 'Tropical and subtropical.',
    water: 'Low.',
    iconName: 'tree'
  },
  {
    id: 'fr11',
    name: 'Wood Apple',
    tamilName: 'விளாம்பழம்',
    type: 'Fruit',
    description: 'Hard shelled fruit with medicinal properties.',
    soil: 'Adapts to poor soils.',
    climate: 'Dry.',
    water: 'Low.',
    iconName: 'tree'
  },

  // --- Plantation / Trees / Spices ---
  {
    id: 'p1',
    name: 'Coconut',
    tamilName: 'தென்னை',
    type: 'Plantation',
    description: 'Kalpavriksha - Tree of heaven.',
    soil: 'Alluvial, red loam, sandy.',
    climate: 'Tropical high humidity.',
    water: 'Moderate to High.',
    iconName: 'tree'
  },
  {
    id: 'p2',
    name: 'Areca nut',
    tamilName: 'பாக்கு',
    type: 'Plantation',
    description: 'Commercial plantation crop.',
    soil: 'Laterite, red loam.',
    climate: 'Humid tropical.',
    water: 'High.',
    iconName: 'tree'
  },
  {
    id: 'p3',
    name: 'Turmeric',
    tamilName: 'மஞ்சள்',
    type: 'Spice',
    description: 'Rhizomatous herbaceous perennial plant.',
    soil: 'Well-drained loamy soil.',
    climate: 'Warm and humid.',
    water: 'High.',
    iconName: 'sprout'
  },
  {
    id: 'p4',
    name: 'Black Pepper',
    tamilName: 'மிளகு',
    type: 'Spice',
    description: 'King of Spices. Climber plant.',
    soil: 'Clay loam, red loam.',
    climate: 'Humid tropical.',
    water: 'High rainfall/irrigation.',
    iconName: 'sprout'
  },
  {
    id: 'p5',
    name: 'Teak',
    tamilName: 'தேக்கு',
    type: 'Plantation',
    description: 'Valuable timber tree.',
    soil: 'Deep alluvial.',
    climate: 'Warm tropical.',
    water: 'Rainfed.',
    iconName: 'tree'
  },
  {
    id: 'p6',
    name: 'Neem',
    tamilName: 'வேம்பு',
    type: 'Plantation',
    description: 'Medicinal tree, drought tolerant.',
    soil: 'Black cotton soil.',
    climate: 'Hot.',
    water: 'Low.',
    iconName: 'tree'
  },
  {
    id: 'p7',
    name: 'Cashew',
    tamilName: 'முந்திரி',
    type: 'Plantation',
    description: 'Drought hardy nut crop.',
    soil: 'Red sandy loam.',
    climate: 'Tropical.',
    water: 'Low.',
    iconName: 'tree'
  },
  {
    id: 'p8',
    name: 'Tamarind',
    tamilName: 'புளி',
    type: 'Plantation',
    description: 'Long lived tree used in cuisine.',
    soil: 'Loam to clay.',
    climate: 'Dry and hot.',
    water: 'Low.',
    iconName: 'tree'
  },
  {
    id: 'p9',
    name: 'Cardamom',
    tamilName: 'ஏலக்காய்',
    type: 'Spice',
    description: 'Queen of Spices.',
    soil: 'Forest loam.',
    climate: 'Cool and humid.',
    water: 'High.',
    iconName: 'sprout'
  },
  {
    id: 'p10',
    name: 'Coffee',
    tamilName: 'காபி',
    type: 'Plantation',
    description: 'Popular beverage crop grown in hills.',
    soil: 'Deep, well-drained forest loam.',
    climate: 'Cool and humid (15°C - 25°C).',
    water: 'High, needs blossom showers.',
    iconName: 'tree'
  },
  {
    id: 'p11',
    name: 'Tea',
    tamilName: 'தேயிலை',
    type: 'Plantation',
    description: 'Evergreen shrub, processed for drink.',
    soil: 'Acidic soil (pH 4.5-5.5).',
    climate: 'Cool and humid.',
    water: 'High and well distributed.',
    iconName: 'sprout'
  },
  {
    id: 'p12',
    name: 'Rubber',
    tamilName: 'ரப்பர்',
    type: 'Plantation',
    description: 'Latex producing tree.',
    soil: 'Deep well-drained acid soil.',
    climate: 'Hot and humid.',
    water: 'High rainfall.',
    iconName: 'tree'
  },
  {
    id: 'p13',
    name: 'Bamboo',
    tamilName: 'மூங்கில்',
    type: 'Plantation',
    description: 'Fast growing grass/tree.',
    soil: 'Well drained sandy loam.',
    climate: 'Tropical to subtropical.',
    water: 'Moderate.',
    iconName: 'tree'
  },
  {
    id: 'p14',
    name: 'Sandalwood',
    tamilName: 'சந்தனம்',
    type: 'Plantation',
    description: 'Fragrant and expensive wood.',
    soil: 'Red ferruginous loam.',
    climate: 'Cool and moderate rainfall.',
    water: 'Moderate.',
    iconName: 'tree'
  },
  {
    id: 'p15',
    name: 'Ginger',
    tamilName: 'இஞ்சி',
    type: 'Spice',
    description: 'Rhizome spice used in cooking/medicine.',
    soil: 'Sandy or clay loam.',
    climate: 'Warm and humid.',
    water: 'Moderate.',
    iconName: 'sprout'
  },
  {
    id: 'p16',
    name: 'Curry Leaves',
    tamilName: 'கறிவேப்பிலை',
    type: 'Spice',
    description: 'Aromatic leaves for seasoning.',
    soil: 'Red sandy loam.',
    climate: 'Tropical.',
    water: 'Moderate.',
    iconName: 'tree'
  },
  {
    id: 'p17',
    name: 'Coriander',
    tamilName: 'கொத்தமல்லி',
    type: 'Spice',
    description: 'Herb used for leaves and seeds.',
    soil: 'Well drained loam.',
    climate: 'Cool and dry.',
    water: 'Light irrigation.',
    iconName: 'sprout'
  },
  {
    id: 'p18',
    name: 'Mint (Pudina)',
    tamilName: 'புதினா',
    type: 'Spice',
    description: 'Aromatic herb.',
    soil: 'Loam or sandy loam.',
    climate: 'Tropical/Subtropical.',
    water: 'Frequent.',
    iconName: 'sprout'
  },

  // --- Flowers / Medicinal ---
  {
    id: 'fl1',
    name: 'Jasmine',
    tamilName: 'மல்லிகை',
    type: 'Flower',
    description: 'Fragrant commercial flower.',
    soil: 'Well-drained loamy soil.',
    climate: 'Warm summer.',
    water: 'Regular.',
    iconName: 'flower'
  },
  {
    id: 'fl2',
    name: 'Marigold',
    tamilName: 'சாமந்தி',
    type: 'Flower',
    description: 'Popular loose flower.',
    soil: 'Well drained soil.',
    climate: 'Mild climate.',
    water: 'Moderate.',
    iconName: 'flower'
  },
  {
    id: 'fl3',
    name: 'Rose',
    tamilName: 'ரோஜா',
    type: 'Flower',
    description: 'Symbol of beauty.',
    soil: 'Loam.',
    climate: 'Cool and sunny.',
    water: 'Moderate.',
    iconName: 'flower'
  },
  {
    id: 'm1',
    name: 'Tulsi',
    tamilName: 'துளசி',
    type: 'Medicinal',
    description: 'Sacred medicinal plant.',
    soil: 'Any well drained soil.',
    climate: 'Warm.',
    water: 'Low.',
    iconName: 'sprout'
  },
  {
    id: 'm2',
    name: 'Aloe Vera',
    tamilName: 'கற்றாழை',
    type: 'Medicinal',
    description: 'Succulent medicinal plant.',
    soil: 'Sandy soil.',
    climate: 'Dry and hot.',
    water: 'Very low.',
    iconName: 'sprout'
  }
];

const CropLibrary: React.FC<CropLibraryProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null);

  const filteredCrops = CROP_DATABASE.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crop.tamilName.includes(searchTerm)
  );

  const getIcon = (type: string) => {
    switch(type) {
        case 'Field Crop': return <Wheat className="text-amber-500" />;
        case 'Fruit': return <Leaf className="text-emerald-500" />;
        case 'Plantation': return <Trees className="text-orange-500" />;
        case 'Spice': return <Utensils className="text-red-500" />;
        case 'Medicinal': return <Leaf className="text-teal-500" />;
        default: return <Sprout className="text-green-500" />;
    }
  };

  const getTypeColor = (type: string) => {
      switch(type) {
          case 'Field Crop': return 'bg-amber-100 text-amber-800 border-amber-200';
          case 'Vegetable': return 'bg-green-100 text-green-800 border-green-200';
          case 'Fruit': return 'bg-rose-100 text-rose-800 border-rose-200';
          case 'Plantation': return 'bg-orange-100 text-orange-800 border-orange-200';
          case 'Flower': return 'bg-purple-100 text-purple-800 border-purple-200';
          case 'Spice': return 'bg-red-100 text-red-800 border-red-200';
          case 'Medicinal': return 'bg-teal-100 text-teal-800 border-teal-200';
          default: return 'bg-slate-100 text-slate-800 border-slate-200';
      }
  };

  if (selectedCrop) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center gap-4 z-10">
          <button 
            onClick={() => setSelectedCrop(null)}
            className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Crop Details</h2>
        </div>

        {/* Content */}
        <div className="p-6 pb-24 space-y-6">
           <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
               <div className="w-24 h-24 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  {getIcon(selectedCrop.type)}
               </div>
               <h1 className="text-3xl font-bold text-slate-900 mb-1">{selectedCrop.name}</h1>
               <p className="text-xl text-emerald-600 font-medium mb-4">{selectedCrop.tamilName}</p>
               <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getTypeColor(selectedCrop.type)}`}>
                   {selectedCrop.type}
               </span>
               <p className="mt-6 text-slate-600 leading-relaxed">
                   {selectedCrop.description}
               </p>
           </div>

           <div className="grid grid-cols-1 gap-4">
               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                   <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                       <Sprout size={24} />
                   </div>
                   <div>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Soil Requirements</h3>
                       <p className="text-sm text-slate-600 font-medium">{selectedCrop.soil}</p>
                   </div>
               </div>

               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                   <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                       <Thermometer size={24} />
                   </div>
                   <div>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Climate</h3>
                       <p className="text-sm text-slate-600 font-medium">{selectedCrop.climate}</p>
                   </div>
               </div>

               <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                   <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                       <Droplets size={24} />
                   </div>
                   <div>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Water Needs</h3>
                       <p className="text-sm text-slate-600 font-medium">{selectedCrop.water}</p>
                   </div>
               </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto animate-in slide-in-from-bottom duration-500">
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-4 z-10">
         <div className="flex items-center gap-4 mb-4">
            <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all"
            >
                <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Crop Library</h1>
         </div>
         
         <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
                type="text" 
                placeholder="Search crops / பயிரைத் தேடுங்கள்..." 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
         </div>
      </div>

      <div className="p-6 pb-24 grid grid-cols-1 gap-4">
         {filteredCrops.length > 0 ? (
             filteredCrops.map((crop) => (
                <div 
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop)}
                    className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.99] flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            crop.type === 'Field Crop' ? 'bg-amber-50 text-amber-600' :
                            crop.type === 'Vegetable' ? 'bg-green-50 text-green-600' :
                            crop.type === 'Fruit' ? 'bg-rose-50 text-rose-600' :
                            crop.type === 'Spice' ? 'bg-red-50 text-red-600' :
                            crop.type === 'Medicinal' ? 'bg-teal-50 text-teal-600' :
                            crop.type === 'Flower' ? 'bg-purple-50 text-purple-600' :
                            'bg-blue-50 text-blue-600'
                        }`}>
                           {getIcon(crop.type)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{crop.name}</h3>
                            <p className="text-emerald-600 text-sm font-medium">{crop.tamilName}</p>
                        </div>
                    </div>
                    <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                        <ArrowRight size={20} />
                    </div>
                </div>
             ))
         ) : (
             <div className="flex flex-col items-center justify-center py-10 text-center">
                 <div className="bg-slate-100 p-4 rounded-full mb-4">
                     <Search size={32} className="text-slate-400" />
                 </div>
                 <p className="text-slate-500 font-medium">No crops found matching "{searchTerm}"</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default CropLibrary;