import React, { useEffect, useState } from "react";
import {  Alert } from "@mui/material";
import { Divider } from '@mui/material';
import axios from "axios";

import useAxiosInstance from '../ContextAPI/AxiosInstance';


const ProductForm = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const axiosInstance = useAxiosInstance(); 
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState("");
  const [location, setLocation] = useState(""); // Human-readable location
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(""); // Coordinates
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Log the token on initial render
    console.log('Token:', token);
  }, [token]);



  

  // Fetch location suggestions from Nominatim API
  const handleLocationInputChange = async (event) => {
    const query = event.target.value;
    setLocation(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // When a suggestion is selected, update the input field
  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.display_name);
    setLongitude(suggestion.lon);
    setLatitude(suggestion.lat);
    setSuggestions([]); // Clear suggestions after selecting one
  };


 



  // Categories with respective brands and models
  const data = {
    
   "Mobile Phone": {
    Apple: [
      "iPhone X 256GB",
      "iPhone 11",
      "iPhone 12",
      "iPhone 12 Pro",
      "iPhone 12 Pro Max",
      "iPhone 13",
      "iPhone 13 Mini",
      "iPhone 13 Pro",
      "iPhone 13 Pro Max",
      "iPhone 14",
      "iPhone 14 Plus",
      "iPhone 14 Pro",
      "iPhone 14 Pro Max",
      "iPhone SE (2022)",
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max"
    ],
    Samsung: [
      "Galaxy S20",
      "Galaxy Note 10",
      "Galaxy A50",
      "Galaxy S21",
      "Galaxy S21 Ultra",
      "Galaxy Note 20",
      "Galaxy A52",
      "Galaxy A72",
      "Galaxy Z Fold 2",
      "Galaxy Z Fold 3",
      "Galaxy Z Fold 4",
      "Galaxy Z Flip",
      "Galaxy Z Flip 3",
      "Galaxy Z Flip 4",
      "Galaxy S22",
      "Galaxy S22 Ultra",
      "Galaxy S23",
      "Galaxy S23 Ultra",
      "Galaxy A34",
      "Galaxy A54"
    ],
    Xiaomi: [
      "Mi 11",
      "Mi 11 Ultra",
      "Mi 11 Lite",
      "Mi 12",
      "Mi 12 Pro",
      "Mi 12X",
      "Redmi Note 10",
      "Redmi Note 10 Pro",
      "Redmi Note 11",
      "Redmi Note 11 Pro",
      "Redmi K40",
      "Redmi K40 Pro",
      "Poco X3",
      "Poco X3 Pro",
      "Poco F4",
      "Poco M4"
    ],
    OnePlus: [
      "OnePlus 8",
      "OnePlus 8 Pro",
      "OnePlus 9",
      "OnePlus 9 Pro",
      "OnePlus 10",
      "OnePlus 10 Pro",
      "OnePlus Nord",
      "OnePlus Nord N200",
      "OnePlus 11",
      "OnePlus 11R"
    ],
    Oppo: [
      "Oppo A53",
      "Oppo Reno 5",
      "Oppo F17",
      "Oppo Find X3",
      "Oppo Find X3 Pro",
      "Oppo A74",
      "Oppo A94",
      "Oppo Reno 6",
      "Oppo Reno 6 Pro",
      "Oppo Reno 7",
      "Oppo Reno 7 Pro",
      "Oppo Find X5",
      "Oppo Find X5 Pro"
    ],
    Huawei: [
      "P40",
      "P40 Pro",
      "P40 Lite",
      "Mate 40",
      "Mate 40 Pro",
      "Mate 40 Lite",
      "P50",
      "P50 Pro",
      "Mate 50",
      "Mate 50 Pro",
      "Nova 9",
      "Nova 9 Pro"
    ],
    Sony: [
      "Xperia 1 II",
      "Xperia 1 III",
      "Xperia 1 IV",
      "Xperia 5 II",
      "Xperia 5 III",
      "Xperia 5 IV",
      "Xperia 10 II",
      "Xperia 10 III",
      "Xperia 10 IV",
      "Xperia Pro"
    ],
    Motorola: [
      "Moto G Power",
      "Moto G Stylus",
      "Moto G Play",
      "Moto Edge",
      "Moto Edge Plus",
      "Moto Razr 5G",
      "Moto G9",
      "Moto G9 Plus",
      "Moto G50",
      "Moto G100"
    ],
    Nokia: [
      "Nokia 5.4",
      "Nokia 7.2",
      "Nokia 8.3",
      "Nokia X20",
      "Nokia X10",
      "Nokia G20",
      "Nokia G50",
      "Nokia 6.3",
      "Nokia 3.4",
      "Nokia 2.4"
    ],
    Realme: [
      "Realme 8",
      "Realme 8 Pro",
      "Realme GT",
      "Realme GT Neo",
      "Realme X7",
      "Realme X7 Pro",
      "Realme Narzo 30",
      "Realme Narzo 50",
      "Realme C21",
      "Realme C25"
    ]
  },
  "Laptop": {
    Apple: [
      "MacBook Pro 13-inch",
      "MacBook Pro 14-inch",
      "MacBook Pro 16-inch",
      "MacBook Air M1",
      "MacBook Air M2",
      "MacBook Pro M1",
      "MacBook Pro M2"
    ],
    Dell: [
      "Dell XPS 13",
      "Dell XPS 15",
      "Dell XPS 17",
      "Dell Inspiron 13",
      "Dell Inspiron 15",
      "Dell Inspiron 17",
      "Dell Latitude 7310",
      "Dell Latitude 7420",
      "Dell G5 15",
      "Dell Alienware m15"
    ],
    HP: [
      "HP Spectre x360 13",
      "HP Spectre x360 15",
      "HP Pavilion 14",
      "HP Pavilion 15",
      "HP Envy 13",
      "HP Envy 15",
      "HP Omen 15",
      "HP Elite Dragonfly",
      "HP EliteBook 840",
      "HP Chromebook x360"
    ],
    Lenovo: [
      "Lenovo ThinkPad X1 Carbon",
      "Lenovo ThinkPad X1 Yoga",
      "Lenovo ThinkPad T14",
      "Lenovo ThinkPad L14",
      "Lenovo Yoga 9i",
      "Lenovo IdeaPad 5",
      "Lenovo Legion 5 Pro",
      "Lenovo Legion 7i",
      "Lenovo Chromebook Duet",
      "Lenovo Flex 5"
    ],
    Asus: [
      "Asus ZenBook 13",
      "Asus ZenBook 14",
      "Asus ZenBook 15",
      "Asus ROG Zephyrus G14",
      "Asus ROG Flow X13",
      "Asus VivoBook 15",
      "Asus TUF Gaming A15",
      "Asus Chromebook Flip",
      "Asus ExpertBook B9",
      "Asus ProArt StudioBook"
    ],
    Acer: [
      "Acer Aspire 5",
      "Acer Aspire 7",
      "Acer Swift 3",
      "Acer Swift 5",
      "Acer Predator Helios 300",
      "Acer Predator Triton 500",
      "Acer Chromebook Spin 713",
      "Acer ConceptD 7",
      "Acer TravelMate P2",
      "Acer Enduro N3"
    ],
    Microsoft: [
      "Microsoft Surface Laptop 4",
      "Microsoft Surface Laptop Studio",
      "Microsoft Surface Pro 8",
      "Microsoft Surface Book 3",
      "Microsoft Surface Go 3",
      "Microsoft Surface Laptop Go",
      "Microsoft Surface Pro X",
      "Microsoft Surface Laptop 3",
      "Microsoft Surface Laptop 2",
      "Microsoft Surface Pro 7"
    ],
    Razer: [
      "Razer Blade 15",
      "Razer Blade Stealth 13",
      "Razer Blade 17",
      "Razer Blade 14",
      "Razer Book 13"
    ],
    MSI: [
      "MSI GS66 Stealth",
      "MSI GE76 Raider",
      "MSI GP66 Leopard",
      "MSI Modern 14",
      "MSI Creator Z16",
      "MSI Prestige 14",
      "MSI Katana GF66",
      "MSI Summit E15",
      "MSI Alpha 15",
      "MSI Bravo 15"
    ],
    HP: [
      "HP Spectre x360 14",
      "HP Pavilion x360",
      "HP EliteBook 830",
      "HP EliteBook 850",
      "HP Omen 17",
      "HP Envy x360 15",
      "HP Chromebook 14",
      "HP Spectre x360 16",
      "HP ProBook 445",
      "HP Elite Dragonfly G3"
    ]
  },
  "Tablets": {
    Apple: [
      "iPad Pro 11-inch",
      "iPad Pro 12.9-inch",
      "iPad Air (4th Gen)",
      "iPad Air (5th Gen)",
      "iPad Mini (6th Gen)",
      "iPad (9th Gen)",
      "iPad (10th Gen)",
      "iPad Pro 10.5-inch",
      "iPad Pro 9.7-inch"
    ],
    Samsung: [
      "Galaxy Tab S9 Ultra",
      "Galaxy Tab S9+",
      "Galaxy Tab S9",
      "Galaxy Tab S8 Ultra",
      "Galaxy Tab S8+",
      "Galaxy Tab S8",
      "Galaxy Tab A8",
      "Galaxy Tab Active3",
      "Galaxy Tab S7 FE",
      "Galaxy Tab S6 Lite"
    ],
    Microsoft: [
      "Surface Pro 9",
      "Surface Pro 8",
      "Surface Go 3",
      "Surface Go 2",
      "Surface Book 3",
      "Surface Pro X",
      "Surface Pro 7",
      "Surface Pro 6",
      "Surface Pro 5",
      "Surface Laptop Studio"
    ],
    Lenovo: [
      "Lenovo Tab P12 Pro",
      "Lenovo Tab P11 Plus",
      "Lenovo Tab P11",
      "Lenovo Tab M10 Plus",
      "Lenovo Tab M8",
      "Lenovo Yoga Smart Tab",
      "Lenovo Tab 4 10",
      "Lenovo Tab E10",
      "Lenovo Yoga Tab 13",
      "Lenovo Tab K10"
    ],
    Huawei: [
      "Huawei MatePad Pro",
      "Huawei MatePad 11",
      "Huawei MatePad 10.4",
      "Huawei MatePad T10s",
      "Huawei MediaPad M6",
      "Huawei MediaPad T5",
      "Huawei MediaPad M5 Lite",
      "Huawei MediaPad M6 Turbo",
      "Huawei MediaPad T3",
      "Huawei MediaPad M2"
    ],
    Asus: [
      "Asus ROG Flow Z13",
      "Asus Transformer Mini",
      "Asus ZenPad 3S 10",
      "Asus ZenPad 10",
      "Asus VivoTab Note 8",
      "Asus ZenPad 7.0",
      "Asus ZenPad 8.0",
      "Asus Transformer Book T100",
      "Asus Transformer Book T300",
      "Asus ZenPad 10 Z300M"
    ],
    Amazon: [
      "Fire HD 10",
      "Fire HD 10 Kids Edition",
      "Fire HD 8",
      "Fire HD 8 Kids Edition",
      "Fire 7",
      "Fire 7 Kids Edition",
      "Fire HD 10 Plus",
      "Fire HD 10 Kids Pro",
      "Fire HD 8 Plus",
      "Fire HD 8 Kids Pro"
    ],
    Acer: [
      "Acer Iconia Tab 10",
      "Acer Iconia Tab 8",
      "Acer Iconia W4",
      "Acer Iconia One 10",
      "Acer Chromebook Tab 10",
      "Acer Iconia Tab 8 W",
      "Acer Predator Helios 500",
      "Acer Enduro T1",
      "Acer One 10",
      "Acer Tab 8"
    ]
  },
  "Desktop": {
    Apple: [
      "iMac 24-inch",
      "iMac 27-inch",
      "iMac Pro",
      "Mac mini (M2)",
      "Mac mini (M1)",
      "Mac Studio",
      "Mac Pro",
      "Mac mini (Intel)",
      "iMac 21.5-inch",
      "iMac 27-inch (Intel)"
    ],
    Dell: [
      "Dell XPS 8950",
      "Dell XPS 8940",
      "Dell Inspiron 3880",
      "Dell Inspiron 5400",
      "Dell OptiPlex 7090",
      "Dell OptiPlex 7080",
      "Dell Precision 7560",
      "Dell Precision 5750",
      "Dell Vostro 3888",
      "Dell Vostro 3400"
    ],
    HP: [
      "HP Pavilion 24",
      "HP Pavilion 27",
      "HP Envy 34",
      "HP Envy 32",
      "HP EliteOne 800 G6",
      "HP Elite Desktop 800 G6",
      "HP ProDesk 600 G7",
      "HP ProOne 400 G6",
      "HP All-in-One 22",
      "HP All-in-One 27"
    ],
    Lenovo: [
      "Lenovo ThinkCentre M90a",
      "Lenovo ThinkCentre M70s",
      "Lenovo IdeaCentre AIO 3",
      "Lenovo IdeaCentre 5",
      "Lenovo Legion Tower 7i",
      "Lenovo Legion Tower 5i",
      "Lenovo Yoga AIO 7",
      "Lenovo ThinkCentre M920q",
      "Lenovo ThinkCentre M75q",
      "Lenovo IdeaCentre 3"
    ],
    Microsoft: [
      "Surface Studio 2",
      "Surface Studio 1",
      "Surface Hub 2S",
      "Surface Hub 2X",
      "Surface Hub 85",
      "Surface Pro X (with Surface Dock)",
      "Surface Pro 7+ (with Surface Dock)",
      "Surface Laptop Studio (for enterprise)",
      "Surface Book 3 (for enterprise)",
      "Surface Pro 8 (for enterprise)"
    ],
    Asus: [
      "Asus ROG Strix GL10CS",
      "Asus ROG Strix GA15",
      "Asus ROG Strix GT15",
      "Asus VivoPC X",
      "Asus Zen AiO Pro",
      "Asus Zen AiO 27",
      "Asus ProArt StudioBook",
      "Asus Chromebox 4",
      "Asus TUF Gaming GT501",
      "Asus PN50"
    ],
    Acer: [
      "Acer Predator Orion 3000",
      "Acer Predator Helios 300",
      "Acer Aspire C27",
      "Acer Aspire TC",
      "Acer Veriton X",
      "Acer Aspire X",
      "Acer Predator Helios 500",
      "Acer Nitro 50",
      "Acer Chromebox CXI4",
      "Acer ConceptD 300"
    ],
    MSI: [
      "MSI MEG Trident X",
      "MSI Creator P100X",
      "MSI Infinite X",
      "MSI Codex R",
      "MSI Trident A",
      "MSI MAG Infinite S3",
      "MSI Aegis RS",
      "MSI Vortex W25",
      "MSI Optix MAG274QRF-QD",
      "MSI Pro 24X"
    ]
  },

  "Camera": {
    Canon: [
      "Canon EOS R5",
      "Canon EOS R6",
      "Canon EOS 90D",
      "Canon EOS Rebel T8i",
      "Canon EOS M50 Mark II",
      "Canon EOS 5D Mark IV",
      "Canon EOS 6D Mark II",
      "Canon EOS Rebel SL3",
      "Canon PowerShot G7 X Mark III",
      "Canon PowerShot SX740 HS"
    ],
    Nikon: [
      "Nikon Z9",
      "Nikon Z7 II",
      "Nikon Z6 II",
      "Nikon D850",
      "Nikon D7500",
      "Nikon D5600",
      "Nikon D3500",
      "Nikon Coolpix P1000",
      "Nikon Coolpix B600",
      "Nikon Coolpix W300"
    ],
    Sony: [
      "Sony Alpha a7R V",
      "Sony Alpha a7 IV",
      "Sony Alpha a6400",
      "Sony Alpha a6600",
      "Sony Alpha a9 II",
      "Sony Alpha a7S III",
      "Sony RX100 VII",
      "Sony RX10 IV",
      "Sony ZV-1",
      "Sony A6000"
    ],
    Fujifilm: [
      "Fujifilm X-T4",
      "Fujifilm X-T3",
      "Fujifilm X-S10",
      "Fujifilm X100V",
      "Fujifilm X-Pro3",
      "Fujifilm X-E4",
      "Fujifilm GFX 100S",
      "Fujifilm GFX 50S",
      "Fujifilm GFX 50R",
      "Fujifilm X-T30"
    ],
    Panasonic: [
      "Panasonic Lumix GH6",
      "Panasonic Lumix GH5 II",
      "Panasonic Lumix G95",
      "Panasonic Lumix GX85",
      "Panasonic Lumix FZ1000 II",
      "Panasonic Lumix TZ200",
      "Panasonic Lumix LX100 II",
      "Panasonic Lumix S5",
      "Panasonic Lumix S1",
      "Panasonic Lumix S1H"
    ],
    Olympus: [
      "Olympus OM-D E-M1 Mark III",
      "Olympus OM-D E-M5 Mark III",
      "Olympus PEN E-PL10",
      "Olympus OM-D E-M1X",
      "Olympus OM-D E-M10 Mark III",
      "Olympus Tough TG-6",
      "Olympus OM-D E-M1 Mark II",
      "Olympus PEN E-PL9",
      "Olympus OM-D E-M10 Mark II",
      "Olympus OM-D E-M5 Mark II"
    ],
    Leica: [
      "Leica M11",
      "Leica SL2",
      "Leica Q2",
      "Leica CL",
      "Leica D-Lux 7",
      "Leica M10-R",
      "Leica SL2-S",
      "Leica V-Lux 5",
      "Leica TL2",
      "Leica M10-P"
    ],
    Ricoh: [
      "Ricoh GR III",
      "Ricoh GR IIIx",
      "Ricoh WG-80",
      "Ricoh Theta Z1",
      "Ricoh Theta SC2",
      "Ricoh Theta V",
      "Ricoh WG-70",
      "Ricoh Theta S",
      "Ricoh GR II",
      "Ricoh WG-6"
    ],
    GoPro: [
      "GoPro HERO11 Black",
      "GoPro HERO10 Black",
      "GoPro HERO9 Black",
      "GoPro HERO8 Black",
      "GoPro HERO7 Black",
      "GoPro HERO6 Black",
      "GoPro MAX",
      "GoPro HERO7 Silver",
      "GoPro HERO7 White",
      "GoPro HERO5 Black"
    ],
    DJI: [
      "DJI Osmo Action 3",
      "DJI Pocket 2",
      "DJI Mavic 3",
      "DJI Mavic Air 2",
      "DJI Mini 2",
      "DJI FPV",
      "DJI Osmo Pocket",
      "DJI Mavic Air",
      "DJI Spark",
      "DJI Mavic Pro"
    ]
  },
  

  


  
  

  

   
    
   
   
    
  "Smartwatch": {
    Apple: [
      "Apple Watch Series 9",
      "Apple Watch Ultra",
      "Apple Watch SE (2nd Gen)",
      "Apple Watch Series 8",
      "Apple Watch Series 7",
      "Apple Watch Series 6",
      "Apple Watch Series 5",
      "Apple Watch Series 4",
      "Apple Watch Series 3",
      "Apple Watch Nike+"
    ],
    Samsung: [
      "Samsung Galaxy Watch 6",
      "Samsung Galaxy Watch 6 Classic",
      "Samsung Galaxy Watch 5",
      "Samsung Galaxy Watch 5 Pro",
      "Samsung Galaxy Watch 4",
      "Samsung Galaxy Watch 4 Classic",
      "Samsung Galaxy Watch Active2",
      "Samsung Galaxy Watch Active",
      "Samsung Gear S3 Frontier",
      "Samsung Gear Sport"
    ],
    Garmin: [
      "Garmin Forerunner 945",
      "Garmin Forerunner 745",
      "Garmin Fenix 7",
      "Garmin Fenix 6 Pro",
      "Garmin Forerunner 945 LTE",
      "Garmin Venu 2",
      "Garmin Venu 2S",
      "Garmin Instinct Solar",
      "Garmin Forerunner 645 Music",
      "Garmin Forerunner 55"
    ],
    Fitbit: [
      "Fitbit Sense 2",
      "Fitbit Versa 4",
      "Fitbit Charge 5",
      "Fitbit Luxe",
      "Fitbit Versa 3",
      "Fitbit Inspire 3",
      "Fitbit Versa 2",
      "Fitbit Ionic",
      "Fitbit Charge 4",
      "Fitbit Ace 3"
    ],
    Fossil: [
      "Fossil Gen 6",
      "Fossil Hybrid HR",
      "Fossil Gen 5",
      "Fossil Q Explorist HR",
      "Fossil Q Venture HR",
      "Fossil Sport",
      "Fossil Hybrid HR Compass",
      "Fossil Gen 5E",
      "Fossil Hybrid HR Collider",
      "Fossil Hybrid HR Moon Phase"
    ],
    Suunto: [
      "Suunto 9 Peak",
      "Suunto 7",
      "Suunto 9 Baro",
      "Suunto 5",
      "Suunto 3 Fitness",
      "Suunto Spartan Sport Wrist HR",
      "Suunto 5 Peak",
      "Suunto 9 Enduro",
      "Suunto 7 GPS",
      "Suunto Ambit3 Peak"
    ],
    Huawei: [
      "Huawei Watch GT 3",
      "Huawei Watch GT 3 Pro",
      "Huawei Watch Fit 2",
      "Huawei Watch GT 2 Pro",
      "Huawei Watch GT 2",
      "Huawei Watch GT",
      "Huawei Watch Fit",
      "Huawei Watch GT 2e",
      "Huawei Watch 3 Pro",
      "Huawei Watch 3"
    ],
    Withings: [
      "Withings ScanWatch",
      "Withings Steel HR Sport",
      "Withings Steel HR",
      "Withings Move ECG",
      "Withings Move",
      "Withings Steel HR Hybrid",
      "Withings Pulse Ox",
      "Withings Go",
      "Withings Thermo",
      "Withings Body Cardio"
    ],
    TicWatch: [
      "TicWatch Pro 3",
      "TicWatch E3",
      "TicWatch C2+",
      "TicWatch Pro X",
      "TicWatch S2",
      "TicWatch C2",
      "TicWatch Pro 2020",
      "TicWatch S",
      "TicWatch E",
      "TicWatch Pro 4G/LTE"
    ],
    Garmin: [
      "Garmin Forerunner 945",
      "Garmin Forerunner 745",
      "Garmin Fenix 7",
      "Garmin Fenix 6 Pro",
      "Garmin Venu 2",
      "Garmin Venu 2S",
      "Garmin Instinct Solar",
      "Garmin Forerunner 645 Music",
      "Garmin Forerunner 55",
      "Garmin Vivosmart 5"
    ]
  },
    "Television": {
    Apple: [
      "Apple TV 4K (2022)",
      "Apple TV HD",
      "Apple TV 4K (2021)",
      "Apple TV 4K (2020)"
    ],
    Samsung: [
      "Samsung QN90B Neo QLED",
      "Samsung Q80B QLED",
      "Samsung The Frame",
      "Samsung Q70B QLED",
      "Samsung AU8000 Crystal UHD",
      "Samsung The Terrace",
      "Samsung QN85B Neo QLED",
      "Samsung TU8000 Crystal UHD",
      "Samsung QN95B Neo QLED",
      "Samsung The Serif"
    ],
    LG: [
      "LG OLED C2",
      "LG OLED G2",
      "LG NanoCell 99",
      "LG UHD AI ThinQ",
      "LG OLED B2",
      "LG QNED99",
      "LG UHD A1",
      "LG OLED A1",
      "LG NanoCell 90",
      "LG UHD UP80"
    ],
    Sony: [
      "Sony A95K OLED",
      "Sony X90K LED",
      "Sony A80J OLED",
      "Sony X85J LED",
      "Sony A9G OLED",
      "Sony X80J LED",
      "Sony Z9J LED",
      "Sony X94J LED",
      "Sony A8H OLED",
      "Sony X950H LED"
    ],
    TCL: [
      "TCL 6-Series R635",
      "TCL 5-Series S546",
      "TCL 4-Series S435",
      "TCL 8-Series Q825",
      "TCL 6-Series Q825",
      "TCL 6-Series QLED",
      "TCL 5-Series QLED",
      "TCL 4-Series UHD",
      "TCL 3-Series",
      "TCL 4-Series"
    ],
    Hisense: [
      "Hisense U8H Quantum",
      "Hisense U7H",
      "Hisense A6H",
      "Hisense H9G Quantum",
      "Hisense H8G Quantum",
      "Hisense R8F",
      "Hisense U9DG",
      "Hisense A9G",
      "Hisense R7 Series",
      "Hisense U6H"
    ],
    Panasonic: [
      "Panasonic LZ2000 OLED",
      "Panasonic JZ2000 OLED",
      "Panasonic JZ1500 OLED",
      "Panasonic JZ1000 OLED",
      "Panasonic HX940 LED",
      "Panasonic HX800 LED",
      "Panasonic GX800 LED",
      "Panasonic DX802 LED",
      "Panasonic EX750 LED",
      "Panasonic TX-55HX800B"
    ],
    Sharp: [
      "Sharp Aquos 8K",
      "Sharp Aquos R",
      "Sharp Aquos LC-70N8000U",
      "Sharp Aquos LC-70LE653U",
      "Sharp Aquos LC-60LE650U",
      "Sharp Aquos LC-50N7000U",
      "Sharp Aquos LC-43N7000U",
      "Sharp Aquos LC-32LB600U",
      "Sharp Aquos LC-24LE250M",
      "Sharp Aquos LC-60LE847U"
    ],
    Vizio: [
      "Vizio P-Series Quantum X",
      "Vizio M-Series Quantum",
      "Vizio V-Series",
      "Vizio D-Series",
      "Vizio OLED",
      "Vizio P-Series Quantum Pro",
      "Vizio M-Series Quantum X",
      "Vizio V-Series 4K",
      "Vizio M-Series 4K",
      "Vizio D-Series 1080p"
    ],
    Philips: [
      "Philips 803 OLED",
      "Philips 9000 Series",
      "Philips 7000 Series",
      "Philips 8000 Series",
      "Philips 6000 Series",
      "Philips 5000 Series",
      "Philips 3000 Series",
      "Philips 2000 Series",
      "Philips Ambilight",
      "Philips Performance Series"
    ]
  },
  "Gaming Consoles": {
    Sony: [
      "PlayStation 5",
      "PlayStation 4 Pro",
      "PlayStation 4 Slim",
      "PlayStation VR",
      "PlayStation Classic"
    ],
    Microsoft: [
      "Xbox Series X",
      "Xbox Series S",
      "Xbox One X",
      "Xbox One S",
      "Xbox 360",
      "Xbox 360 Slim"
    ],
    Nintendo: [
      "Nintendo Switch OLED",
      "Nintendo Switch",
      "Nintendo Switch Lite",
      "Nintendo 3DS",
      "Nintendo Wii U",
      "Nintendo Wii",
      "Nintendo 2DS"
    ],
    Valve: [
      "Valve Steam Deck",
      "Valve Index VR",
      "Valve Steam Machine"
    ],
    Sega: [
      "Sega Genesis Mini",
      "Sega Saturn",
      "Sega Dreamcast",
      "Sega Game Gear Micro"
    ],
    Atari: [
      "Atari VCS",
      "Atari Flashback 8 Gold",
      "Atari Jaguar",
      "Atari 2600"
    ],
    Nvidia: [
      "Nvidia Shield TV",
      "Nvidia Shield TV Pro"
    ]
  },

   "Home Appliances": {
    Samsung: [
      "Samsung Family Hub Refrigerator",
      "Samsung FlexWash Washer",
      "Samsung Jet 90 Complete Vacuum",
      "Samsung AirDresser",
      "Samsung WindFree Air Conditioner"
    ],
    LG: [
      "LG InstaView Door-in-Door Refrigerator",
      "LG TurboWash Washer",
      "LG CordZero A9 Stick Vacuum",
      "LG Styler Clothing Care System",
      "LG Dual Inverter Air Conditioner"
    ],
    Whirlpool: [
      "Whirlpool Smart Dishwasher",
      "Whirlpool Cabrio Washer",
      "Whirlpool Side-by-Side Refrigerator",
      "Whirlpool Smart Over-the-Range Microwave",
      "Whirlpool Smart Oven"
    ],
    Bosch: [
      "Bosch 800 Series Dishwasher",
      "Bosch 500 Series Refrigerator",
      "Bosch Serie 6 Washing Machine",
      "Bosch Serie 4 Dryer",
      "Bosch Built-In Microwave"
    ],
    GE: [
      "GE Profile Smart Washer",
      "GE Profile Smart Oven",
      "GE Profile Refrigerator",
      "GE Smart Dishwasher",
      "GE Air Conditioner"
    ],
    Philips: [
      "Philips Air Fryer",
      "Philips Coffee Machine",
      "Philips Air Purifier",
      "Philips Juicer",
      "Philips Induction Cooktop"
    ],
    Panasonic: [
      "Panasonic Microwave Oven",
      "Panasonic Bread Maker",
      "Panasonic Vacuum Cleaner",
      "Panasonic Air Conditioner",
      "Panasonic Washing Machine"
    ],
    Electrolux: [
      "Electrolux Perfect Steam Washer",
      "Electrolux French Door Refrigerator",
      "Electrolux Gas Range",
      "Electrolux Wall Oven",
      "Electrolux Cordless Vacuum"
    ],
    Dyson: [
      "Dyson V11 Cordless Vacuum",
      "Dyson Airwrap Styler",
      "Dyson Pure Hot + Cool Air Purifier",
      "Dyson Supersonic Hair Dryer",
      "Dyson Humidifier"
    ]
  },
   "Furniture": {
    IKEA: [
      "IKEA Ektorp Sofa",
      "IKEA Malm Bed Frame",
      "IKEA Billy Bookcase",
      "IKEA Poäng Chair",
      "IKEA Lack Coffee Table"
    ],
    AshleyFurniture: [
      "Ashley Furniture Darcy Sofa",
      "Ashley Furniture Paxberry Dresser",
      "Ashley Furniture Sommerford Dining Table",
      "Ashley Furniture Realyn Desk",
      "Ashley Furniture Bolanburg TV Stand"
    ],
    Wayfair: [
      "Wayfair Willa Arlo Bed",
      "Wayfair Andover Mills Recliner",
      "Wayfair Mercury Row Sectional",
      "Wayfair Three Posts Coffee Table",
      "Wayfair Ebern Designs Desk"
    ],
    WestElm: [
      "West Elm Andes Sofa",
      "West Elm Mid-Century Dining Table",
      "West Elm Industrial Storage Bed",
      "West Elm Modern Desk",
      "West Elm Lucas Swivel Chair"
    ],
    CrateAndBarrel: [
      "Crate & Barrel Gather Sofa",
      "Crate & Barrel Edge Dining Table",
      "Crate & Barrel Linea Bed",
      "Crate & Barrel Kori Chair",
      "Crate & Barrel Blake Media Console"
    ],
    PotteryBarn: [
      "Pottery Barn Turner Roll Arm Sofa",
      "Pottery Barn Farmhouse Dining Table",
      "Pottery Barn Stratton Bed",
      "Pottery Barn Franklin Desk",
      "Pottery Barn Benchwright Coffee Table"
    ],
    HermanMiller: [
      "Herman Miller Aeron Chair",
      "Herman Miller Sayl Chair",
      "Herman Miller Embody Chair",
      "Herman Miller Noguchi Table",
      "Herman Miller Eames Lounge Chair"
    ],
    Steelcase: [
      "Steelcase Leap Office Chair",
      "Steelcase Gesture Office Chair",
      "Steelcase Amia Chair",
      "Steelcase Flex Height-Adjustable Desk",
      "Steelcase Migration SE Desk"
    ]
  },

 "Vehicles": {
    Toyota: [
      "Toyota Corolla",
      "Toyota Camry",
      "Toyota RAV4",
      "Toyota Highlander",
      "Toyota Tacoma"
    ],
    Honda: [
      "Honda Civic",
      "Honda Accord",
      "Honda CR-V",
      "Honda Pilot",
      "Honda Ridgeline"
    ],
    Ford: [
      "Ford F-150",
      "Ford Mustang",
      "Ford Explorer",
      "Ford Escape",
      "Ford Ranger"
    ],
    Chevrolet: [
      "Chevrolet Silverado",
      "Chevrolet Malibu",
      "Chevrolet Equinox",
      "Chevrolet Tahoe",
      "Chevrolet Blazer"
    ],
    BMW: [
      "BMW 3 Series",
      "BMW 5 Series",
      "BMW X3",
      "BMW X5",
      "BMW M4"
    ],
    MercedesBenz: [
      "Mercedes-Benz C-Class",
      "Mercedes-Benz E-Class",
      "Mercedes-Benz GLE",
      "Mercedes-Benz S-Class",
      "Mercedes-Benz GLC"
    ],
    Audi: [
      "Audi A3",
      "Audi A4",
      "Audi Q5",
      "Audi Q7",
      "Audi TT"
    ],
    Tesla: [
      "Tesla Model 3",
      "Tesla Model S",
      "Tesla Model X",
      "Tesla Model Y",
      "Tesla Cybertruck"
    ],
    Nissan: [
      "Nissan Altima",
      "Nissan Rogue",
      "Nissan Sentra",
      "Nissan Pathfinder",
      "Nissan Frontier"
    ],
    Volkswagen: [
      "Volkswagen Jetta",
      "Volkswagen Passat",
      "Volkswagen Tiguan",
      "Volkswagen Atlas",
      "Volkswagen Golf"
    ]
  },
    "Motorcycles": {
    HarleyDavidson: [
      "Harley-Davidson Street 750",
      "Harley-Davidson Iron 883",
      "Harley-Davidson Fat Boy",
      "Harley-Davidson Road King",
      "Harley-Davidson Street Glide"
    ],
    Yamaha: [
      "Yamaha YZF-R3",
      "Yamaha MT-07",
      "Yamaha MT-09",
      "Yamaha FZ-10",
      "Yamaha YZF-R1"
    ],
    Honda: [
      "Honda CBR500R",
      "Honda CB650R",
      "Honda Africa Twin",
      "Honda Rebel 500",
      "Honda Gold Wing"
    ],
    Kawasaki: [
      "Kawasaki Ninja 400",
      "Kawasaki Z650",
      "Kawasaki Ninja ZX-10R",
      "Kawasaki Vulcan S",
      "Kawasaki Versys 650"
    ],
    Ducati: [
      "Ducati Panigale V4",
      "Ducati Monster 821",
      "Ducati Multistrada 950",
      "Ducati Scrambler",
      "Ducati Diavel 1260"
    ],
    Suzuki: [
      "Suzuki GSX-R750",
      "Suzuki Hayabusa",
      "Suzuki V-Strom 650",
      "Suzuki SV650",
      "Suzuki Boulevard M109R"
    ],
    BMW: [
      "BMW S1000RR",
      "BMW R1250GS",
      "BMW F750GS",
      "BMW R nineT",
      "BMW G310R"
    ],
    KTM: [
      "KTM 390 Duke",
      "KTM 690 Enduro R",
      "KTM RC 390",
      "KTM 1290 Super Duke R",
      "KTM 790 Adventure"
    ],
    Triumph: [
      "Triumph Bonneville T120",
      "Triumph Street Triple",
      "Triumph Tiger 800",
      "Triumph Thruxton",
      "Triumph Rocket 3"
    ],
    RoyalEnfield: [
      "Royal Enfield Classic 350",
      "Royal Enfield Interceptor 650",
      "Royal Enfield Himalayan",
      "Royal Enfield Bullet 500",
      "Royal Enfield Continental GT 650"
    ]
  },
    "Bicycles": {
    Trek: [
      "Trek Domane SL 6",
      "Trek Marlin 7",
      "Trek Emonda ALR",
      "Trek Verve+ 2",
      "Trek Fuel EX 8"
    ],
    Giant: [
      "Giant TCR Advanced Pro",
      "Giant Defy Advanced",
      "Giant Trance X",
      "Giant Talon 29",
      "Giant FastRoad E+"
    ],
    Specialized: [
      "Specialized Allez Sprint",
      "Specialized Turbo Vado",
      "Specialized Roubaix Sport",
      "Specialized Stumpjumper",
      "Specialized Rockhopper"
    ],
    Cannondale: [
      "Cannondale Synapse Carbon",
      "Cannondale Topstone Carbon",
      "Cannondale Scalpel",
      "Cannondale Trail SE",
      "Cannondale Quick Neo"
    ],
    Scott: [
      "Scott Addict RC",
      "Scott Scale 970",
      "Scott Genius 950",
      "Scott Contessa Active",
      "Scott Sub Cross eRide"
    ],
    Bianchi: [
      "Bianchi Infinito CV",
      "Bianchi Aria E-Road",
      "Bianchi Sprint",
      "Bianchi Impulso",
      "Bianchi Oltre XR4"
    ],
    Cervelo: [
      "Cervelo S5",
      "Cervelo R5",
      "Cervelo Caledonia-5",
      "Cervelo Aspero",
      "Cervelo P-Series"
    ],
    SantaCruz: [
      "Santa Cruz Bronson",
      "Santa Cruz Hightower",
      "Santa Cruz Nomad",
      "Santa Cruz Tallboy",
      "Santa Cruz Blur"
    ],
    Merida: [
      "Merida Reacto",
      "Merida Scultura",
      "Merida One-Twenty",
      "Merida Big Nine",
      "Merida eOne-Sixty"
    ],
    Kona: [
      "Kona Process 153",
      "Kona Sutra",
      "Kona Honzo",
      "Kona Rove",
      "Kona Jake the Snake"
    ]
  },
  
  "Clothing": {
    Men: [
      "Levi's Jeans",
      "Nike T-Shirts",
      "Adidas Hoodies",
      "Ralph Lauren Polo Shirts",
      "Under Armour Shorts"
    ],
    Women: [
      "Zara Dresses",
      "H&M Tops",
      "Gucci Skirts",
      "Chanel Blazers",
      "Lululemon Leggings"
    ],
    Kids: [
      "Carter's Onesies",
      "Old Navy Jackets",
      "Gap Kids T-Shirts",
      "Adidas Kids Sneakers",
      "The Children's Place Pants"
    ],
    Footwear: [
      "Nike Air Force 1",
      "Adidas Ultraboost",
      "Vans Old Skool",
      "Converse Chuck Taylor",
      "Puma Suede"
    ],
    Accessories: [
      "Ray-Ban Sunglasses",
      "Hermès Scarves",
      "Michael Kors Handbags",
      "Rolex Watches",
      "Fossil Wallets"
    ]
  },
  "Shoes": {
    Men: [
      "Nike Air Max",
      "Adidas Superstar",
      "Puma Suede Classic",
      "Reebok Club C",
      "Timberland Boots"
    ],
    Women: [
      "Nike Air Zoom",
      "Adidas NMD",
      "Vans Classic Slip-On",
      "Dr. Martens 1460",
      "Stuart Weitzman Heels"
    ],
    Kids: [
      "Nike Kids Revolution 5",
      "Adidas Kids Stan Smith",
      "Crocs Kids Classic Clog",
      "New Balance Kids 990",
      "Puma Kids Tazon 6"
    ],
    Sports: [
      "Nike ZoomX Vaporfly",
      "Adidas Predator Soccer Cleats",
      "Asics Gel-Kayano Running Shoes",
      "Under Armour Curry 7 Basketball Shoes",
      "Reebok Nano Training Shoes"
    ],
    Casual: [
      "Converse Chuck Taylor",
      "Vans Old Skool",
      "Toms Classic Slip-Ons",
      "Skechers Go Walk",
      "Clarks Desert Boots"
    ]
  },
 "Sports Equipment": {
    Football: [
      "Nike Mercurial Soccer Ball",
      "Adidas Predator Shin Guards",
      "Puma Future 5.1 Cleats",
      "Under Armour Football Gloves",
      "Wilson NFL Official Game Ball"
    ],
    Basketball: [
      "Spalding NBA Official Basketball",
      "Nike Elite Basketball Socks",
      "Adidas Harden Vol. 5 Shoes",
      "Wilson Evolution Basketball",
      "Under Armour Curry Shooting Shirt"
    ],
    Tennis: [
      "Wilson Pro Staff Tennis Racket",
      "Babolat Pure Drive Racket",
      "NikeCourt Zoom Vapor Shoes",
      "Head Graphene Tennis Balls",
      "Adidas Tennis Wristbands"
    ],
    Cricket: [
      "Kookaburra Kahuna Cricket Bat",
      "SG Test Cricket Gloves",
      "Adidas XT 4.0 Batting Pads",
      "Gray-Nicolls Powerbow Cricket Helmet",
      "Gunn & Moore Cricket Ball"
    ],
    Running: [
      "Nike Air Zoom Pegasus",
      "Asics Gel Nimbus Running Shoes",
      "Adidas Ultraboost Running Shorts",
      "Brooks Ghost 14 Running Shoes",
      "Garmin Forerunner GPS Watch"
    ],
    Gym: [
      "Bowflex Adjustable Dumbbells",
      "Nike Pro Weightlifting Gloves",
      "Adidas Performance Mat",
      "Under Armour Weightlifting Shoes",
      "Rogue Fitness Power Rack"
    ]
  },
   "Musical Instruments": {
    Guitars: [
      "Fender American Professional II Stratocaster",
      "Gibson Les Paul Standard",
      "Ibanez RG Series",
      "PRS SE Custom 24",
      "Yamaha Pacifica 112V"
    ],
    Keyboards: [
      "Yamaha P-125 Digital Piano",
      "Roland RD-2000 Stage Piano",
      "Korg Kronos 2",
      "Casio Privia PX-160",
      "Nord Stage 3"
    ],
    Drums: [
      "Pearl Export Drum Kit",
      "Yamaha Stage Custom Birch",
      "Tama Imperialstar",
      "Gretsch Renown Series",
      "Mapex Mars Series"
    ],
    "Wind Instruments": [
      "Yamaha YTR-2330 Trumpet",
      "Selmer Paris Series II Alto Saxophone",
      "Buffet Crampon R13 Clarinet",
      "Jupiter JTR700S Trumpet",
      "Getzen 300 Series Trombone"
    ],
    "String Instruments": [
      "Fender American Professional II Jazz Bass",
      "Gibson ES-335",
      "Kalamazoo Mandolin",
      "Epiphone Masterbilt Acoustic Guitar",
      "Hofner Ignition Violin Bass"
    ],
    "Percussion Instruments": [
      "Meinl Classics Custom Cymbals",
      "LP Aspire Timbales",
      "Remo Emperor Drumheads",
      "Vic Firth American Classic Drumsticks",
      "Latin Percussion LP279 Conga"
    ],
    "Audio Equipment": [
      "Shure SM58 Microphone",
      "AKG C414 XLS Microphone",
      "Focusrite Scarlett 2i2 Audio Interface",
      "Mackie CR3-X Studio Monitors",
      "Behringer Xenyx Q802USB Mixer"
    ]
  },
   
  "Jewelry": {
    Necklaces: [
      "Tiffany & Co. Heart Pendant",
      "Cartier Love Necklace",
      "Harry Winston Diamond Necklace",
      "Chopard Happy Diamonds Necklace",
      "Bvlgari Serpenti Necklace"
    ],
    Earrings: [
      "Swarovski Sparkling Dance Earrings",
      "Van Cleef & Arpels Alhambra Earrings",
      "Mikimoto Pearl Earrings",
      "David Yurman Cable Classic Earrings",
      "Chanel Camélia Earrings"
    ],
    Bracelets: [
      "Pandora Charm Bracelet",
      "Cartier Juste un Clou Bracelet",
      "Bangles by David Yurman",
      "Tiffany & Co. Return to Tiffany Bracelet",
      "Chopard Happy Hearts Bracelet"
    ],
    Rings: [
      "Tiffany & Co. Tiffany T Ring",
      "Cartier Trinity Ring",
      "Harry Winston Emerald Cut Diamond Ring",
      "Bvlgari B.zero1 Ring",
      "De Beers Forevermark Engagement Ring"
    ],
    Watches: [
      "Rolex Submariner",
      "Omega Speedmaster Professional",
      "Tag Heuer Carrera",
      "Patek Philippe Nautilus",
      "Audemars Piguet Royal Oak"
    ],
    Brooches: [
      "Cartier Panthère Brooch",
      "Van Cleef & Arpels Vintage Alhambra Brooch",
      "Tiffany & Co. Ribbon Brooch",
      "Bvlgari Serpenti Brooch",
      "Chanel Camélia Brooch"
    ],
    Anklets: [
      "Pandora Silver Anklet",
      "Tiffany & Co. Sterling Silver Anklet",
      "Swarovski Stardust Anklet",
      "Chopard Happy Spirit Anklet",
      "Maria Black Gold Anklet"
    ]
  },
   "Watches": {
    Smartwatches: [
      "Apple Watch Series 9",
      "Samsung Galaxy Watch 6",
      "Garmin Venu 3",
      "Fitbit Sense 2",
      "Google Pixel Watch"
    ],
    "Luxury Watches": [
      "Rolex Submariner",
      "Omega Speedmaster Professional",
      "Patek Philippe Nautilus",
      "Audemars Piguet Royal Oak",
      "Tag Heuer Monaco"
    ],
    "Fashion Watches": [
      "Michael Kors Access",
      "Fossil Gen 6",
      "Daniel Wellington Classic",
      "Skagen Falster 6",
      "Kate Spade New York Metro"
    ],
    "Dive Watches": [
      "Rolex Deepsea",
      "Seiko Prospex Diver's",
      "Citizen Promaster Diver",
      "Breitling Superocean",
      "Tissot Seastar 1000"
    ],
    "Chronograph Watches": [
      "Tag Heuer Carrera",
      "Breitling Navitimer",
      "Omega Speedmaster Racing",
      "Longines Master Collection",
      "Zenith Chronomaster"
    ],
    "Digital Watches": [
      "Casio G-Shock",
      "Suunto Core",
      "Garmin Forerunner",
      "Timex Ironman",
      "Fitbit Versa"
    ],
    "Classic Watches": [
      "Jaeger-LeCoultre Reverso",
      "IWC Big Pilot",
      "Longines Conquest",
      "Tudor Black Bay",
      "Hamilton Khaki Field"
    ]
  },
   "Health & Beauty": {
    Skincare: [
      "Neutrogena Hydro Boost Water Gel",
      "CeraVe Hydrating Cleanser",
      "La Roche-Posay Effaclar Duo",
      "Olay Regenerist Micro-Sculpting Cream",
      "Clinique Moisture Surge"
    ],
    Haircare: [
      "Pantene Pro-V Daily Moisture Renewal",
      "Olaplex No. 3 Hair Perfector",
      "Garnier Fructis Sleek & Shine",
      "Redken All Soft Shampoo",
      "Moroccanoil Treatment"
    ],
    Makeup: [
      "Maybelline Fit Me Foundation",
      "MAC Studio Fix Fluid",
      "Urban Decay Naked Palette",
      "Lancôme Hypnôse Mascara",
      "NARS Radiant Creamy Concealer"
    ],
    "Personal Care": [
      "Oral-B Genius X Toothbrush",
      "Gillette Fusion ProGlide Razor",
      "Dove Sensitive Skin Body Wash",
      "Secret Clinical Strength Deodorant",
      "Neutrogena Hydro Boost Lip Treatment"
    ],
    Wellness: [
      "Fitbit Charge 5",
      "Peloton Bike",
      "Hydro Flask Water Bottle",
      "Philips Sonicare Toothbrush",
      "Gaiam Cork Yoga Block"
    ],
    Supplements: [
      "Nature Made Multivitamins",
      "Garden of Life Collagen Peptides",
      "Optimum Nutrition Whey Protein",
      "Vitamin D3 by NOW Foods",
      "Fish Oil Omega-3 by Nordic Naturals"
    ],
    Fragrance: [
      "Chanel No. 5",
      "Dior Sauvage",
      "Yves Saint Laurent Black Opium",
      "Tom Ford Black Orchid",
      "Marc Jacobs Daisy"
    ],
    "Tools & Devices": [
      "Clarisonic Mia Smart",
      "Foreo Luna 3",
      "Braun Silk-Expert Pro 5",
      "Philips Norelco OneBlade",
      "Revlon One-Step Hair Dryer"
    ]
  },
   "Toys": {
    "Action Figures": [
      "Marvel Legends Series",
      "Star Wars Black Series",
      "Transformers Generations",
      "GI Joe Classified Series",
      "DC Multiverse Figures"
    ],
    "Building Blocks": [
      "LEGO Classic",
      "Mega Bloks",
      "K'NEX",
      "Brio Wooden Railway",
      "Lincoln Logs"
    ],
    "Plush Toys": [
      "Ty Beanie Babies",
      "Build-A-Bear Workshop",
      "Squishmallows",
      "Gund Plush Bears",
      "Disney Plush Characters"
    ],
    "Educational Toys": [
      "VTech Learning Toys",
      "Fisher-Price Smart Stages",
      "LeapFrog LeapStart",
      "Melissa & Doug Wooden Toys",
      "Osmo Genius Starter Kit"
    ],
    Puzzles: [
      "Ravensburger Puzzles",
      "Melissa & Doug Wooden Puzzles",
      "CubicFun 3D Puzzles",
      "Buffalo Games Puzzles",
      "Springbok Puzzles"
    ],
    "Remote Control": [
      "Nerf Remote Control Cars",
      "Traxxas RC Trucks",
      "Holy Stone RC Drones",
      "LEGO Technic Remote Control",
      "Redcat Racing RC Vehicles"
    ],
    "Outdoor Toys": [
      "Wubble Bubble Balls",
      "Nerf Blasters",
      "Frisbees and Flying Discs",
      "Kites by Prism",
      "Little Tikes Slide and Play"
    ],
    "Arts & Crafts": [
      "Crayola Crayons and Markers",
      "Play-Doh Modeling Compound",
      "Spiral Art Set",
      "Melissa & Doug Craft Kits",
      "Elmer's Glue and Craft Supplies"
    ],
    Games: [
      "Hasbro Board Games",
      "Mattel Card Games",
      "Monopoly Classic",
      "Jenga Game",
      "Scrabble Classic"
    ]
  },
   "Baby Products": {
    "Baby Gear": [
      "Graco Modes 3 Lite DLX Travel System",
      "Chicco Bravo Quick-Fold Travel System",
      "Bugaboo Cameleon 3 Plus",
      "UPPAbaby Vista V2",
      "Doona Infant Car Seat & Latch Base"
    ],
    Diapers: [
      "Pampers Swaddlers",
      "Huggies Little Snugglers",
      "Honest Company Diapers",
      "Luvs Ultra Leakguards",
      "Seventh Generation Free & Clear"
    ],
    "Baby Formula": [
      "Similac Pro-Advance",
      "Enfamil NeuroPro",
      "Gerber Good Start Gentle",
      "Earth’s Best Organic",
      "Happy Baby Organic Formula"
    ],
    "Baby Clothing": [
      "Carter’s Bodysuits",
      "Gerber Onesies",
      "Burt’s Bees Baby Organic Cotton",
      "H&M Baby Clothes",
      "Gap Baby Clothing"
    ],
    Feeding: [
      "Dr. Brown’s Bottles",
      "Philips Avent Natural Bottles",
      "Chicco NaturalFit Bottle",
      "Munchkin Latch Bottles",
      "Tommee Tippee Closer to Nature"
    ],
    "Nursery Furniture": [
      "Delta Children Emery 4-in-1 Convertible Crib",
      "DaVinci Kalani 4-in-1 Convertible Crib",
      "Graco Benton 4-in-1 Convertible Crib",
      "Babyletto Hudson 3-in-1 Crib",
      "Storkcraft Portofino 4-in-1 Convertible Crib"
    ],
    "Baby Monitors": [
      "Nanit Plus Smart Baby Monitor",
      "Infant Optics DXR-8",
      "Motorola MBP36XL",
      "Arlo Baby Monitor",
      "Summer Infant In View 2.0"
    ],
    "Bath & Skin Care": [
      "Johnson’s Baby Shampoo",
      "Aveeno Baby Daily Moisture Lotion",
      "Cetaphil Baby Wash & Shampoo",
      "Burt’s Bees Baby Bee Shampoo",
      "Mustela Hydra Bébé Body Lotion"
    ],
    Teething: [
      "Sophie the Giraffe Teether",
      "Comotomo Silicone Teether",
      "Nuby Ice Gel Teether",
      "Infantino Topsy Teether",
      "Munchkin Cool Relief Teether"
    ],
    "Safety & Health": [
      "FridaBaby NoseFrida",
      "Safety 1st Deluxe Healthcare & Grooming Kit",
      "Summer Infant Baby Nail Clipper",
      "Boppy Nursing Pillow",
      "Hatch Baby Rest Sound Machine"
    ],
    Toys: [
      "Fisher-Price Rock-a-Stack",
      "Lamaze Freddy the Firefly",
      "Manhattan Toy Winkel Rattle & Teether",
      "VTech Sit-to-Stand Learning Walker",
      "Bright Starts Take Along Toys"
    ]
  },
 "Pet Supplies": {
    "Dog Food": [
      "Royal Canin Size Health Nutrition",
      "Hill's Science Diet Adult",
      "Blue Buffalo Life Protection Formula",
      "Purina Pro Plan Savor",
      "Wellness CORE Grain-Free"
    ],
    "Cat Food": [
      "Royal Canin Feline Health Nutrition",
      "Hill's Science Diet Adult Indoor",
      "Blue Buffalo Wilderness High Protein",
      "Purina ONE Tender Selects",
      "Wellness Complete Health"
    ],
    "Pet Toys": [
      "KONG Classic Dog Toy",
      "Nylabone DuraChew",
      "Chuckit! Ultra Ball",
      "Cat Dancer Original",
      "BarkBox Super Chewer Toy"
    ],
    "Pet Beds": [
      "Kuranda Dog Bed",
      "PetFusion Ultimate Dog Bed",
      "Big Barker 7-inch Pillow Top Dog Bed",
      "Frisco Plush Orthopedic Dog Bed",
      "MidWest Homes for Pets Dog Crate Bed"
    ],
    "Cat Litter": [
      "Tidy Cats Clumping Cat Litter",
      "Dr. Elsey's Precious Cat Ultra Cat Litter",
      "Arm & Hammer Clump & Seal",
      "PetSafe ScoopFree Premium Crystal Non-Clumping Cat Litter",
      "World’s Best Cat Litter"
    ],
    "Pet Grooming": [
      "FURminator deShedding Tool",
      "Burt's Bees for Pets All-Natural Shampoo",
      "Hartz Groomer’s Best Nail Clipper",
      "PetEdge Master Grooming Tools",
      "Safari Professional Stainless Steel Pet Nail Trimmer"
    ],
    "Pet Carriers": [
      "Sherpa Original Deluxe Pet Carrier",
      "Petmate Two Door Top Load Kennel",
      "K9 Sport Sack Air",
      "Sleepypod Air In-Cabin Pet Carrier",
      "AmazonBasics Soft-Sided Pet Carrier"
    ],
    "Pet Health": [
      "Frontline Plus for Dogs",
      "Heartgard Plus for Dogs",
      "Advantage II for Cats",
      "Feliway Classic Diffuser",
      "PetArmor Plus for Dogs"
    ],
    "Pet Cleaning Supplies": [
      "Nature’s Miracle Advanced Stain and Odor Eliminator",
      "Simple Solution Extreme Pet Stain and Odor Remover",
      "Rocco & Roxie Professional Strength Stain & Odor Eliminator",
      "PetSafe ScoopFree Self-Cleaning Litter Box",
      "Bissell Pet Hair Eraser Vacuum Cleaner"
    ],
    "Pet Training": [
      "PetSafe Gentle Leader Headcollar",
      "Pawtraq Dog Training Collar",
      "Clicker Training Kit by Karen Pryor",
      "The Company of Animals Clik-R Training Tool",
      "K9 Advantix II Flea and Tick Prevention"
    ],
    "Pet Travel": [
      "K9 Sport Sack AIR Dog Carrier Backpack",
      "Sleepypod Clickit Sport Dog Safety Harness",
      "Pet Gear Travel Lite Pet Stroller",
      "BarkBox Airline Approved Dog Carrier",
      "PetSafe Solvit Deluxe Telescoping Pet Ramp"
    ]
  },
 
   

 
}

  // Conditions for the dropdown
  const conditions = ["Brand New", "Used", "Refurbished"];

  const handleSubmit = async (event) => {
    event.preventDefault();

    const longitude = 72.3631;
    const latitude = 33.7530;
  
    if (!validateForm()) return;
  
    setLoading(true);
    const formData = new FormData();
  
    formData.append('category', selectedCategory);
    formData.append('brand', selectedBrand);
    formData.append('model', selectedModel);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('condition', selectedCondition);
    formData.append('MobilePhone', mobileNumber);
    
    formData.append('location', JSON.stringify({
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)], // Ensure coordinates are in [lon, lat] format
      readable: location // The human-readable location name
    }));
  
  
    images.forEach((image) => {
      formData.append('images', image);
    });
  
    try {
      // Use axiosInstance to post ad data
      await axiosInstance.post('/usersads/postads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });
      
      setAlert({ message: "Ad posted successfully!", severity: "success" });
    } catch (error) {
      setAlert({ message: "Failed to post ad.", severity: "error" });
    } finally {
      setLoading(false);
    }
    
  };
  

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setBrands(Object.keys(data[category] || {}));
    setSelectedBrand("");
    setModels([]);
  };

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setModels(data[selectedCategory][brand] || []);
    setSelectedModel("");
  };

  const handleImageUpload = (event) => {
    const selectedImages = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...selectedImages].slice(0, 5));
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    if (!selectedCategory) {
      setAlert({ message: "Please select a category.", severity: "error" });
      return false;
    }
    if (!selectedBrand) {
      setAlert({ message: "Please select a brand.", severity: "error" });
      return false;
    }
    if (!selectedModel) {
      setAlert({ message: "Please select a model.", severity: "error" });
      return false;
    }
    if (!mobileNumber) {
      setAlert({ message: "Mobile Phone number is required.", severity: "error" });
      return false;
    }
    if (!selectedCondition) {
      setAlert({ message: "Please select a condition.", severity: "error" });
      return false;
    }
    if (!description.trim()) {
      setAlert({ message: "Please provide a description.", severity: "error" });
      return false;
    }
    if (!price || price <= 0) {
      setAlert({ message: "Please enter a valid price.", severity: "error" });
      return false;
    }
    if (images.length === 0) {
      setAlert({ message: "At least one image is required.", severity: "error" });
      return false;
    }
    if (!location) {  // Add this to ensure the location is selected
      setAlert({ message: "Please select a location.", severity: "error" });
      return false;
    }
    return true;
  };
  
  return (
    <>
    <div className="flex justify-center p-6 bg-white">
    
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl">
<h2 className="mb-4 text-2xl font-extrabold dark:text-white">      <span className="text-yellow-500 ">Post Your Ad: </span>
   Elevate User  <span className="text-yellow-500 ">Experiance</span> with Our Product Form   <Divider className="bg-yellow-400 h-0.5 mx-6" />
   </h2>



      
      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert("")} className="mb-4">
            {alert.message}
          </Alert>
        )}

        
         

        {/* Dropdowns Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
  {/* Category Dropdown */}
  <div>
    <label
      htmlFor="category"
      className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2"
    >
      <span className="text-gray-950">Select Category</span>
    </label>
    <div className="relative">
      <select
        id="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow focus:ring-2 focus:ring-yellow-800 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-yellow-600"
      >
        <option value="">-- Select a Category --</option>
        {Object.keys(data).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    
    </div>
  </div>

  {/* Brand Dropdown */}
  <div>
    <label
      htmlFor="brand"
      className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2"
    >
      <span className="text-gray-950">Select Brand</span>
    </label>
    <div className="relative">
      <select
        id="brand"
        value={selectedBrand}
        onChange={handleBrandChange}
        className={`w-full p-3 border ${
          selectedCategory ? "border-gray-300 bg-gray-50" : "bg-gray-200"
        } text-gray-700 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-yellow-800`}
        disabled={!selectedCategory}
      >
        <option value="">-- Select a Brand --</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>

  {/* Model Dropdown */}
  <div>
    <label
      htmlFor="model"
      className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2"
    >
      <span className="text-gray-950">Select Model</span>
    </label>
    <div className="relative">
      <select
        id="model"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className={`w-full p-3 border ${
          selectedBrand ? "border-gray-300 bg-gray-50" : "bg-gray-200"
        } text-gray-700 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-yellow-600`}
        disabled={!selectedBrand}
      >
        <option value="">-- Select a Model --</option>
        {models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</div>


        {/* Mobile Phone Number Input - Conditional */}
        <div className="mb-6">
  <label
    htmlFor="mobileNumber"
    className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2"
  >
    <span className="text-gray-950">Mobile Phone Number</span>
  </label>
  <div className="relative">
    <input
      type="tel"
      id="mobileNumber"
      value={mobileNumber}
      onChange={(e) => setMobileNumber(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 dark:focus:ring-yellow-600"
      placeholder="Enter your mobile phone number"
    />
    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
   {/* You may Iclude a Icon here */}
    </div>
  </div>
</div>
   {/* Location Input */}
   <div className="mb-6">
  <label
    htmlFor="location"
    className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2"
  >
    Location
  </label>
  <input
    type="text"
    id="location"
    value={location}
    onChange={handleLocationInputChange}
    className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 dark:focus:ring-yellow-600"
    placeholder="Enter location"
  />
  
  {/* Suggestions dropdown */}
  {suggestions.length > 0 && (
    <ul className="bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-60 overflow-auto">
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.place_id}
          className="px-4 py-3 hover:bg-yellow-100 cursor-pointer transition-colors duration-200"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion.display_name}
        </li>
      ))}
    </ul>
  )}
</div>




  {/* Description and Price Section */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
  {/* Description Input */}
  <div>
    <label htmlFor="description" className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2">
      Description
    </label>
    <textarea
      id="description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 dark:focus:ring-yellow-600"
      rows="4"
      placeholder="Provide a detailed description of the product"
    />
  </div>

  {/* Price Input */}
  <div>
    <label htmlFor="price" className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2">
      Price
    </label>
    <input
      type="number"
      id="price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 dark:focus:ring-yellow-600"
      placeholder="Enter price in USD"
    />
  </div>
</div>

{/* Condition Dropdown */}
<div className="mb-6">
  <label htmlFor="condition" className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2">
    Select Condition
  </label>
  <select
    id="condition"
    value={selectedCondition}
    onChange={(e) => setSelectedCondition(e.target.value)}
    className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-yellow-600"
  >
    <option value="">-- Select Condition --</option>
    {conditions.map((condition, index) => (
      <option key={index} value={condition}>
        {condition}
      </option>
    ))}
  </select>
</div>

{/* Image Uploads Section */}
<div className="mb-6">
  <label className="block text-md font-semibold text-gray-950 dark:text-gray-200 mb-2">
    Upload Images (up to 5)
  </label>
  <input
    type="file"
    multiple
    onChange={handleImageUpload}
    accept="image/*"
    className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-yellow-600"
  />

  {images.length > 0 && (
    <div className="mt-4 grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
          <img
            src={URL.createObjectURL(image)}
            alt={`Uploaded ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {index === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <span className="text-white text-sm font-semibold">Cover</span>
            </div>
          )}
          <button
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition duration-200"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )}
</div>


        {/* Submit Button */}
      
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
             {loading ? "Posting..." : "Post Ad"}
          </button>


      </div>
    </div>
    </>
  );
};

export default ProductForm;
