// This service simulates the Backend API and Database for Translations

interface TranslationRow {
  key: string;
  lang_code: string;
  value: string;
}

// 1. Backend: Storing translations in a 'translations' table (Simulated)
const TRANSLATIONS_TABLE: TranslationRow[] = [
  // --- Common ---
  { key: 'app.name', lang_code: 'en', value: 'EduNexus' },
  { key: 'app.name', lang_code: 'hi', value: 'एड्युनेक्सस' },
  { key: 'common.login', lang_code: 'en', value: 'ERP Login' },
  { key: 'common.login', lang_code: 'hi', value: 'ईआरपी लॉगिन' },
  { key: 'common.logout', lang_code: 'en', value: 'Logout' },
  { key: 'common.logout', lang_code: 'hi', value: 'लॉग आउट' },
  { key: 'common.back', lang_code: 'en', value: 'Back' },
  { key: 'common.back', lang_code: 'hi', value: 'वापस' },
  
  // --- Navigation ---
  { key: 'nav.home', lang_code: 'en', value: 'Home' },
  { key: 'nav.home', lang_code: 'hi', value: 'होम' },
  { key: 'nav.about', lang_code: 'en', value: 'About Us' },
  { key: 'nav.about', lang_code: 'hi', value: 'हमारे बारे में' },
  { key: 'nav.academics', lang_code: 'en', value: 'Academics' },
  { key: 'nav.academics', lang_code: 'hi', value: 'शिक्षा' },
  { key: 'nav.admissions', lang_code: 'en', value: 'Admissions' },
  { key: 'nav.admissions', lang_code: 'hi', value: 'प्रवेश' },
  { key: 'nav.faculty', lang_code: 'en', value: 'Faculty' },
  { key: 'nav.faculty', lang_code: 'hi', value: 'संकाय' },
  { key: 'nav.contact', lang_code: 'en', value: 'Contact' },
  { key: 'nav.contact', lang_code: 'hi', value: 'संपर्क' },

  // --- Hero Section ---
  { key: 'hero.tagline', lang_code: 'en', value: 'Admissions Open 2024-25' },
  { key: 'hero.tagline', lang_code: 'hi', value: 'प्रवेश प्रारंभ 2024-25' },
  { key: 'hero.title_prefix', lang_code: 'en', value: 'Shaping the Future of ' },
  { key: 'hero.title_prefix', lang_code: 'hi', value: 'भविष्य को आकार देना - ' },
  { key: 'hero.title_highlight', lang_code: 'en', value: 'India' },
  { key: 'hero.title_highlight', lang_code: 'hi', value: 'भारत' },
  { key: 'hero.description', lang_code: 'en', value: 'EduNexus Institute stands as a beacon of academic excellence, combining traditional values with cutting-edge technology to nurture global leaders.' },
  { key: 'hero.description', lang_code: 'hi', value: 'एड्युनेक्सस संस्थान शैक्षणिक उत्कृष्टता का प्रतीक है, जो वैश्विक नेताओं को तैयार करने के लिए पारंपरिक मूल्यों को अत्याधुनिक तकनीक के साथ जोड़ता है।' },
  { key: 'hero.apply_now', lang_code: 'en', value: 'Apply Now' },
  { key: 'hero.apply_now', lang_code: 'hi', value: 'अभी आवेदन करें' },
  { key: 'hero.explore', lang_code: 'en', value: 'Explore Courses' },
  { key: 'hero.explore', lang_code: 'hi', value: 'पाठ्यक्रम देखें' },

  // --- Login ---
  { key: 'login.welcome', lang_code: 'en', value: 'Welcome to EduNexus' },
  { key: 'login.welcome', lang_code: 'hi', value: 'एड्युनेक्सस में आपका स्वागत है' },
  { key: 'login.subtitle', lang_code: 'en', value: 'Secure Unified Login Portal' },
  { key: 'login.subtitle', lang_code: 'hi', value: 'सुरक्षित एकीकृत लॉगिन पोर्टल' },
  { key: 'login.role_student', lang_code: 'en', value: 'Student' },
  { key: 'login.role_student', lang_code: 'hi', value: 'छात्र' },
  { key: 'login.role_faculty', lang_code: 'en', value: 'Faculty' },
  { key: 'login.role_faculty', lang_code: 'hi', value: 'शिक्षक' },
  { key: 'login.role_admin', lang_code: 'en', value: 'Admin' },
  { key: 'login.role_admin', lang_code: 'hi', value: 'प्रशासन' },
  { key: 'login.email_label', lang_code: 'en', value: 'Institutional Email ID' },
  { key: 'login.email_label', lang_code: 'hi', value: 'संस्थागत ईमेल आईडी' },
  { key: 'login.mobile_label', lang_code: 'en', value: 'Registered Mobile Number' },
  { key: 'login.mobile_label', lang_code: 'hi', value: 'पंजीकृत मोबाइल नंबर' },
  { key: 'login.btn', lang_code: 'en', value: 'Secure Login' },
  { key: 'login.btn', lang_code: 'hi', value: 'सुरक्षित लॉगिन' },

  // --- ERP Sidebar ---
  { key: 'erp.dashboard', lang_code: 'en', value: 'Dashboard' },
  { key: 'erp.dashboard', lang_code: 'hi', value: 'डैशबोर्ड' },
  { key: 'erp.chat', lang_code: 'en', value: 'Community Chat' },
  { key: 'erp.chat', lang_code: 'hi', value: 'सामुदायिक चैट' },
  { key: 'erp.attendance', lang_code: 'en', value: 'Attendance (QR)' },
  { key: 'erp.attendance', lang_code: 'hi', value: 'उपस्थिति (क्यूआर)' },
  { key: 'erp.lms', lang_code: 'en', value: 'LMS & Results' },
  { key: 'erp.lms', lang_code: 'hi', value: 'एलएमएस और परिणाम' },
  { key: 'erp.finance', lang_code: 'en', value: 'Fees & Payments' },
  { key: 'erp.finance', lang_code: 'hi', value: 'शुल्क और भुगतान' },
  { key: 'erp.courses', lang_code: 'en', value: 'My Courses' },
  { key: 'erp.courses', lang_code: 'hi', value: 'मेरे पाठ्यक्रम' },
  { key: 'erp.grading', lang_code: 'en', value: 'Grading' },
  { key: 'erp.grading', lang_code: 'hi', value: 'ग्रेडिंग' },
  { key: 'erp.users', lang_code: 'en', value: 'User Management' },
  { key: 'erp.users', lang_code: 'hi', value: 'उपयोगकर्ता प्रबंधन' },
  { key: 'erp.search_placeholder', lang_code: 'en', value: 'Search modules, fees, students...' },
  { key: 'erp.search_placeholder', lang_code: 'hi', value: 'मॉड्यूल, शुल्क, छात्र खोजें...' },
];

// Helper to convert DB rows to Nested JSON for i18next
const transformToResources = () => {
  const resources: Record<string, any> = {};
  
  TRANSLATIONS_TABLE.forEach(row => {
    if (!resources[row.lang_code]) {
      resources[row.lang_code] = { translation: {} };
    }
    // Simple dot notation handling for 1 level deep
    // For "hero.tagline", we treat it as flat key "hero.tagline" or nested "hero": {"tagline": ...}
    // i18next supports keys with dots if configured, but nested objects are cleaner.
    const parts = row.key.split('.');
    let current = resources[row.lang_code].translation;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = row.value;
  });
  
  return resources;
};

// 2. API Endpoint (Simulated)
export const fetchTranslations = async () => {
  // Simulate network delay
  return new Promise<Record<string, any>>((resolve) => {
    setTimeout(() => {
      resolve(transformToResources());
    }, 100);
  });
};

export const getSyncResources = () => transformToResources();