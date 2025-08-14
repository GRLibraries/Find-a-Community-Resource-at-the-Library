/**
 * Community Resources Finder Application
 * 
 * A multilingual web application that helps users find community resources
 * at Georges River Libraries. Features interactive map, filtering by language
 * and category, QR code generation, and comprehensive accessibility support.
 * 
 * @author Georges River Libraries
 * @version 2.0.0
 * @since 2024
 */

/**
 * Main application initialization
 * Initializes security manager, loads partner data, sets up UI components,
 * and starts the application when DOM is fully loaded.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app...');
    
    // Global error handler for better user experience
    window.addEventListener('error', (event) => {
        console.error('Application error:', event.error);
        showUserFriendlyError('Something went wrong. Please refresh the page.');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showUserFriendlyError('Unable to load some resources. Please check your connection.');
    });
    
    function showUserFriendlyError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; left: 20px; right: 20px; z-index: 10000;
            background: #ff6b6b; color: white; padding: 15px; border-radius: 8px;
            font-family: 'Work Sans', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex; justify-content: space-between; align-items: center;
        `;
        errorDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none; border: 1px solid white; color: white; 
                padding: 5px 10px; cursor: pointer; border-radius: 4px;
            ">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => errorDiv.remove(), 10000);
    }
    
    // Initialize security manager with error handling
    let security = null;
    try {
        if (typeof SecurityManager !== 'undefined') {
            security = new SecurityManager();
            security.performSecurityAudit();
            console.log('✅ Security manager initialized');
        } else {
            console.warn('⚠️ SecurityManager not available, continuing without security features');
        }
    } catch (error) {
        console.error('❌ Error initializing security manager:', error);
        console.log('Continuing without security features...');
    }
    
    // Partners data - Key organizations from each category
    const partners = [
        // First Nations
        {
            "name": "Kurranulla Aboriginal Corporation",
            "lat": -34.053,
            "lng": 151.06,
            "community": "First Nations",
            "languages": ["English"],
            "description": {
                "English": "Provides services and programs for the local Aboriginal community.",
                "Mandarin": "为当地原住民社区提供服务和项目。",
                "Cantonese": "為當地原住民社區提供服務和計劃。",
                "Nepali": "स्थानीय आदिवासी समुदायका लागि सेवा र कार्यक्रमहरू प्रदान गर्दछ।",
                "Italian": "Fornisce servizi e programmi per la comunità aborigena locale.",
                "Greek": "Παρέχει υπηρεσίες και προγράμματα για την τοπική κοινότητα των Αβοριγίνων."
            },
            "address": "15 Jannali Avenue, Jannali",
            "phone": "(02) 9528 0287",
            "email": "contact@kurranulla.org.au",
            "website": "https://www.kurranulla.org.au/"
        },
        {
            "name": "Metropolitan Local Aboriginal Land Council",
            "lat": -33.874,
            "lng": 151.21,
            "community": "First Nations",
            "languages": ["English"],
            "description": {
                "English": "Advocates for Aboriginal people in the Sydney metropolitan area.",
                "Mandarin": "为悉尼大都会区的原住民提供支持。"
            },
            "address": "Level 2, 150 Elizabeth St Sydney",
            "phone": "(02) 8394 9666",
            "email": "metrolalc@metrolalc.org.au",
            "website": "https://metrolalc.org.au/"
        },
        {
            "name": "3Bridges Burrbangana Program",
            "lat": -33.973,
            "lng": 151.09,
            "community": "First Nations",
            "languages": ["English"],
            "description": {
                "English": "Youth mentoring and indigenous learning programs.",
                "Mandarin": "青年辅导和土著学习项目。"
            },
            "address": "643A King Georges Road, Penshurst",
            "phone": "1300 327 434",
            "email": "admin@3bridges.org.au",
            "website": "https://3bridges.org.au/"
        },
        // Arts
        {
            "name": "Shopfront Arts Co-op",
            "lat": -33.9545,
            "lng": 151.1215,
            "community": "Arts",
            "languages": ["English"],
            "description": {
                "English": "A space for young people to create and experience art.",
                "Mandarin": "一个让年轻人创作和体验艺术的空间。",
                "Cantonese": "一個俾年輕人創作同體驗藝術嘅空間。",
                "Nepali": "युवाहरूलाई कला सिर्जना गर्न र अनुभव गर्नका लागि एउटा ठाउँ।",
                "Italian": "Uno spazio per i giovani per creare e sperimentare l'arte.",
                "Greek": "Ένας χώρος για νέους να δημιουργήσουν και να βιώσουν την τέχνη."
            },
            "address": "88 Carlton Parade, Carlton",
            "phone": "(02) 9588 3948",
            "email": "hello@shopfront.org.au",
            "website": "https://shopfront.org.au/"
        },
        {
            "name": "Bus Stop Films",
            "lat": -33.9545,
            "lng": 151.1215,
            "community": "Arts",
            "languages": ["English"],
            "description": {
                "English": "An accessible film studies program for people with disabilities.",
                "Mandarin": "为残疾人士提供的无障碍电影研究项目。"
            },
            "address": "86-88 Carlton Parade, Carlton",
            "phone": "(02) 7204 5010",
            "email": "hello@busstopfilms.com.au",
            "website": "https://www.busstopfilms.com.au/"
        },
      
  // Youth
        {
            "name": "PCYC St George",
            "lat": -33.95,
            "lng": 151.15,
            "community": "Youth",
            "languages": ["English"],
            "description": {
                "English": "Youth and community programs.",
                "Mandarin": "青年和社区项目。",
                "Cantonese": "青年同社區計劃。",
                "Nepali": "युवा र सामुदायिक कार्यक्रमहरू।",
                "Italian": "Programmi per i giovani e la comunità.",
                "Greek": "Προγράμματα για νέους και την κοινότητα."
            },
            "address": "McCarthy Reserve, 9 Ador Avenue, Rockdale",
            "phone": "(02) 9567 0408",
            "email": "stgeorge@pcycnsw.org.au",
            "website": "https://www.pcycnsw.org.au/st-george"
        },
        // Health & Wellbeing
        {
            "name": "Headspace Hurstville",
            "lat": -33.967,
            "lng": 151.104,
            "community": "Health & Wellbeing",
            "languages": ["English"],
            "description": {
                "English": "Youth mental health services.",
                "Mandarin": "青年心理健康服务。"
            },
            "address": "41 Dora Street, Hurstville",
            "phone": "(02) 8048 3350",
            "email": "headspace.hurstville@stride.com.au",
            "website": "https://headspace.org.au/headspace-centres/hurstville/"
        },
        {
            "name": "Lifeline",
            "lat": -33.8688,
            "lng": 151.2093,
            "community": "Health & Wellbeing",
            "languages": ["English"],
            "description": {
                "English": "24/7 crisis support and suicide prevention.",
                "Mandarin": "24/7 危机支持和自杀预防。"
            },
            "address": "National Service - Multiple Locations",
            "phone": "13 11 14",
            "email": "info@lifeline.org.au",
            "website": "https://www.lifeline.org.au/"
        },
        // Carers Support Services
        {
            "name": "Carers NSW",
            "lat": -33.8394,
            "lng": 151.2081,
            "community": "Carers Support Services",
            "languages": ["English"],
            "description": {
                "English": "The peak non-government organisation for carers in NSW.",
                "Mandarin": "新南威尔士州照顾者的最高非政府组织。"
            },
            "address": "Level 10/213 Miller St, North Sydney",
            "phone": "(02) 9280 4744",
            "email": "contact@carersnsw.org.au",
            "website": "https://www.carersnsw.org.au/"
        },
        // Children & Families
        {
            "name": "St George Family Support Services",
            "lat": -33.959,
            "lng": 151.129,
            "community": "Children & Families",
            "languages": ["English"],
            "description": {
                "English": "Provides support to vulnerable children, young people, and families.",
                "Mandarin": "为弱势儿童、青少年和家庭提供支持。"
            },
            "address": "42 Jubilee Avenue, Carlton",
            "phone": "(02) 9553 9100",
            "email": "information@sgfss.org.au",
            "website": "https://www.sgfss.org.au/"
        },
        {
            "name": "Tresillian",
            "lat": -33.8688,
            "lng": 151.2093,
            "community": "Children & Families",
            "languages": ["English"],
            "description": {
                "English": "Early parenting support for families with young children.",
                "Mandarin": "为有幼儿的家庭提供早期育儿支持。"
            },
            "address": "Multiple Locations - Sydney Metro",
            "phone": "1300 272 736",
            "email": "enquiries@tresillian.org.au",
            "website": "https://www.tresillian.org.au/"
        },
        // Community Support
        {
            "name": "3Bridges Community",
            "lat": -33.973,
            "lng": 151.09,
            "community": "Community Support",
            "languages": ["English"],
            "description": {
                "English": "Offers a wide range of services for all ages and cultures.",
                "Mandarin": "为所有年龄和文化的人提供广泛的服务。"
            },
            "address": "643/643A King Georges Road, Penshurst",
            "phone": "1300 327 434",
            "email": "admin@3bridges.org.au",
            "website": "https://3bridges.org.au/"
        },
        // Disability Services
        {
            "name": "Northcott",
            "lat": -33.967,
            "lng": 151.104,
            "community": "Disability Services",
            "languages": ["English"],
            "description": {
                "English": "Supports people with disability to live the life they choose.",
                "Mandarin": "支持残疾人士过上他们选择的生活。"
            },
            "address": "Level 2, Suite 2, 12 Butler Road, Hurstville",
            "phone": "1800 818 286",
            "email": "northcott@northcott.com.au",
            "website": "https://northcott.com.au/"
        },
        // Domestic Violence
        {
            "name": "1800RESPECT",
            "lat": -33.8688,
            "lng": 151.2093,
            "community": "Domestic Violence",
            "languages": ["English"],
            "description": {
                "English": "National sexual assault, domestic family violence counselling service.",
                "Mandarin": "国家性侵犯、家庭暴力咨询服务。"
            },
            "address": "National Service - Phone & Online",
            "phone": "1800 737 732",
            "email": "info@1800respect.org.au",
            "website": "https://www.1800respect.org.au/"
        },
        // Food & Emergency Support
        {
            "name": "Salvation Army Hurstville",
            "lat": -33.967,
            "lng": 151.104,
            "community": "Food & Emergency Support",
            "languages": ["English"],
            "description": {
                "English": "Emergency relief and community support.",
                "Mandarin": "紧急救援和社区支持。"
            },
            "address": "Cnr Bond and Dore Streets, Hurstville",
            "phone": "(02) 9570 2617",
            "email": "hurstvillesalvos@salvationarmy.org.au",
            "website": "https://www.salvationarmy.org.au/hurstville"
        },
        // Government Departments
        {
            "name": "Bayside Council",
            "lat": -33.96,
            "lng": 151.15,
            "community": "Government Departments",
            "languages": ["English"],
            "description": {
                "English": "Local government services.",
                "Mandarin": "地方政府服务。"
            },
            "address": "444-446 Princes Highway, Rockdale",
            "phone": "1300 581 299",
            "email": "council@bayside.nsw.gov.au",
            "website": "https://www.bayside.nsw.gov.au/"
        },
        // LGBTQIA+
        {
            "name": "ACON",
            "lat": -33.88,
            "lng": 151.21,
            "community": "LGBTQIA+",
            "languages": ["English"],
            "description": {
                "English": "Health promotion organisation for LGBTQIA+ people.",
                "Mandarin": "为 LGBTQIA+ 人士提供健康促进的组织。"
            },
            "address": "414 Elizabeth Street, Surry Hills",
            "phone": "1800 063 060",
            "email": "acon@acon.org.au",
            "website": "https://www.acon.org.au/"
        },
        // Multicultural
        {
            "name": "Advance Diversity Services",
            "lat": -33.967,
            "lng": 151.104,
            "community": "Multicultural",
            "languages": ["English"],
            "description": {
                "English": "Services for culturally and linguistically diverse communities.",
                "Mandarin": "为文化和语言多样化的社区提供服务。"
            },
            "address": "Suite 231 & 232 (Building 2/Level 3), 7-11 The Avenue, Hurstville",
            "phone": "(02) 9597 5455",
            "email": "info@advancediversity.org.au",
            "website": "https://www.advancediversity.org.au/"
        }
    ];

    /**
     * Validates partner data structure and content
     * 
     * Performs comprehensive validation of partner organization data including
     * required fields, data types, email format, URL validity, and duplicate detection.
     * 
     * @param {Array<Object>} partners - Array of partner organization objects
     * @param {string} partners[].name - Organization name
     * @param {number} partners[].lat - Latitude coordinate
     * @param {number} partners[].lng - Longitude coordinate
     * @param {string} partners[].community - Community category
     * @param {Array<string>} partners[].languages - Supported languages
     * @param {Object} partners[].description - Multilingual descriptions
     * @param {string} partners[].address - Physical address
     * @param {string} partners[].phone - Contact phone number
     * @param {string} partners[].email - Contact email address
     * @param {string} partners[].website - Organization website URL
     * 
     * @returns {Object} Validation result object
     * @returns {Array<string>} returns.errors - Array of validation errors
     * @returns {Array<string>} returns.warnings - Array of validation warnings
     * @returns {boolean} returns.isValid - True if no errors found
     * 
     * @example
     * const result = validatePartnerData(partners);
     * if (result.isValid) {
     *   console.log('Data is valid');
     * } else {
     *   console.error('Validation errors:', result.errors);
     * }
     */
    function validatePartnerData(partners) {
        const errors = [];
        const warnings = [];
        
        const validCommunities = [
            'First Nations', 'Arts', 'Youth', 'Health & Wellbeing',
            'Carers Support Services', 'Children & Families', 'Community Support',
            'Disability Services', 'Domestic Violence', 'Food & Emergency Support',
            'Government Departments', 'LGBTQIA+', 'Multicultural'
        ];
        
        const requiredFields = ['name', 'lat', 'lng', 'community', 'languages', 'description', 'address', 'phone', 'email', 'website'];
        
        partners.forEach((partner, index) => {
            // Check required fields
            requiredFields.forEach(field => {
                if (!partner[field]) {
                    errors.push(`Partner ${index} (${partner.name || 'Unknown'}): Missing ${field}`);
                }
            });
            
            // Validate coordinates
            if (typeof partner.lat !== 'number' || typeof partner.lng !== 'number') {
                errors.push(`Partner ${index} (${partner.name}): Invalid coordinates`);
            }
            
            // Validate community
            if (!validCommunities.includes(partner.community)) {
                errors.push(`Partner ${index} (${partner.name}): Invalid community '${partner.community}'`);
            }
            
            // Validate email format
            if (partner.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partner.email)) {
                errors.push(`Partner ${index} (${partner.name}): Invalid email format`);
            }
            
            // Validate website URL
            if (partner.website) {
                try {
                    new URL(partner.website);
                } catch (e) {
                    errors.push(`Partner ${index} (${partner.name}): Invalid website URL`);
                }
            }
            
            // Check for English description
            if (!partner.description || !partner.description.English) {
                errors.push(`Partner ${index} (${partner.name}): Missing English description`);
            }
            
            // Validate languages array
            if (!Array.isArray(partner.languages) || partner.languages.length === 0) {
                warnings.push(`Partner ${index} (${partner.name}): No languages specified`);
            }
        });
        
        // Check for duplicates
        const names = partners.map(p => p.name);
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
        if (duplicates.length > 0) {
            warnings.push(`Duplicate names found: ${[...new Set(duplicates)].join(', ')}`);
        }
        
        return { errors, warnings, isValid: errors.length === 0 };
    }
    
    // Sanitize partner data before validation (if security manager is available)
    let sanitizedPartners = partners;
    if (security && security.sanitizePartnerData) {
        console.log('🧹 Sanitizing partner data...');
        sanitizedPartners = security.sanitizePartnerData(partners);
    } else {
        console.log('ℹ️ Using original partner data (security manager not available)');
    }
    
    // Run validation on startup
    console.log('🔍 Validating partner data...');
    const validation = validatePartnerData(sanitizedPartners);
    
    if (validation.isValid) {
        console.log(`✅ Partner data validation passed! ${partners.length} partners loaded.`);
        if (validation.warnings.length > 0) {
            console.warn('⚠️ Warnings:', validation.warnings);
        }
    } else {
        console.error('❌ Partner data validation failed!');
        console.error('Errors:', validation.errors);
        console.warn('Warnings:', validation.warnings);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; left: 20px; right: 20px; z-index: 10000;
            background: #ff4444; color: white; padding: 15px; border-radius: 8px;
            font-family: Arial, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        // Create error content safely using DOM methods
        const strongElement = document.createElement('strong');
        strongElement.textContent = '⚠️ Data Validation Errors Found';
        
        const brElement = document.createElement('br');
        
        const errorText = document.createTextNode(`${validation.errors.length} errors detected in partner data. Check console for details.`);
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = 'float: right; background: none; border: 1px solid white; color: white; padding: 5px 10px; cursor: pointer; border-radius: 4px;';
        closeButton.addEventListener('click', () => errorDiv.remove());
        
        errorDiv.appendChild(strongElement);
        errorDiv.appendChild(brElement);
        errorDiv.appendChild(errorText);
        errorDiv.appendChild(closeButton);
        document.body.appendChild(errorDiv);
    }

    const translations = {
        "English": {
            "titleFind": "Find ",
            "titleResources": " resources",
            "titleAtTheLibrary": "at the library",
            "headingSelectLanguage": "Select your language:",
            "headingChooseCategory": "Choose a Category:",
            "listHeader": "Service Directory",
            "labelAddress": "Address:",
            "labelPhone": "Phone:",
            "labelEmail": "Email:",
            "noServicesFound": "No services found for this category.",
            "catFirstNations": "First Nations",
            "catArts": "Arts",
            "catHealth": "Health & Wellbeing",
            "catYouth": "Youth",
            "catCarers": "Carers Support Services",
            "catChildrenFamilies": "Children & Families",
            "catCommunitySupport": "Community Support",
            "catDisability": "Disability Services",
            "catDomesticViolence": "Domestic Violence",
            "catFood": "Food & Emergency Support",
            "catGovernment": "Government Departments",
            "catLgbtqia": "LGBTQIA+",
            "catMulticultural": "Multicultural",
            "clearAllFilters": "Clear All Filters"
        },
        "Mandarin": {
            "titleFind": "查找",
            "titleResources": "资源",
            "titleAtTheLibrary": "在图书馆",
            "headingSelectLanguage": "选择你的语言:",
            "headingChooseCategory": "选择一个类别:",
            "listHeader": "服务目录",
            "labelAddress": "地址:",
            "labelPhone": "电话:",
            "labelEmail": "电子邮件:",
            "noServicesFound": "此类别未找到服务。",
            "catFirstNations": "原住民服务",
            "catArts": "艺术",
            "catHealth": "健康与福祉",
            "catYouth": "青年",
            "catCarers": "照顾者支持服务",
            "catChildrenFamilies": "儿童与家庭",
            "catCommunitySupport": "社区支持",
            "catDisability": "残疾人服务",
            "catDomesticViolence": "家庭暴力",
            "catFood": "食品和紧急支持",
            "catGovernment": "政府部门",
            "catLgbtqia": "LGBTQIA+ 社区",
            "catMulticultural": "多元文化",
            "clearAllFilters": "清除所有筛选"
        },
        "Cantonese": {
            "titleFind": "搵",
            "titleResources": "資源",
            "titleAtTheLibrary": "喺圖書館",
            "headingSelectLanguage": "選擇你的語言:",
            "headingChooseCategory": "選擇一個類別:",
            "listHeader": "服務目錄",
            "labelAddress": "地址:",
            "labelPhone": "電話:",
            "labelEmail": "電子郵件:",
            "noServicesFound": "呢個類別搵唔到服務。",
            "catFirstNations": "原住民服務",
            "catArts": "藝術",
            "catHealth": "健康與福祉",
            "catYouth": "青年",
            "catCarers": "照顧者支援服務",
            "catChildrenFamilies": "兒童與家庭",
            "catCommunitySupport": "社區支援",
            "catDisability": "殘疾人服務",
            "catDomesticViolence": "家庭暴力",
            "catFood": "食品和緊急支援",
            "catGovernment": "政府部門",
            "catLgbtqia": "LGBTQIA+ 社區",
            "catMulticultural": "多元文化",
            "clearAllFilters": "清除所有篩選"
        },
        "Nepali": {
            "titleFind": "खोज्नुहोस्",
            "titleResources": "स्रोतहरू",
            "titleAtTheLibrary": "पुस्तकालयमा",
            "headingSelectLanguage": "आफ्नो भाषा छान्नुहोस्:",
            "headingChooseCategory": "एउटा श्रेणी छान्नुहोस्:",
            "listHeader": "सेवा निर्देशिका",
            "labelAddress": "ठेगाना:",
            "labelPhone": "फोन:",
            "labelEmail": "इमेल:",
            "noServicesFound": "यस श्रेणीका लागि कुनै सेवाहरू फेला परेन।",
            "catFirstNations": "प्रथम राष्ट्र",
            "catArts": "कला",
            "catHealth": "स्वास्थ्य र कल्याण",
            "catYouth": "युवा",
            "catCarers": "हेरचाहकर्ता समर्थन सेवाहरू",
            "catChildrenFamilies": "बालबालिका र परिवारहरू",
            "catCommunitySupport": "सामुदायिक समर्थन",
            "catDisability": "अपाङ्गता सेवाहरू",
            "catDomesticViolence": "घरेलु हिंसा",
            "catFood": "खाद्य र आपतकालीन समर्थन",
            "catGovernment": "सरकारी विभागहरू",
            "catLgbtqia": "LGBTQIA+ समुदायहरू",
            "catMulticultural": "बहुसांस्कृतिक",
            "clearAllFilters": "सबै फिल्टरहरू हटाउनुहोस्"
        },
        "Italian": {
            "titleFind": "Trova",
            "titleResources": "risorse",
            "titleAtTheLibrary": "in biblioteca",
            "headingSelectLanguage": "Seleziona la tua lingua:",
            "headingChooseCategory": "Scegli una categoria:",
            "listHeader": "Elenco dei servizi",
            "labelAddress": "Indirizzo:",
            "labelPhone": "Telefono:",
            "labelEmail": "E-mail:",
            "noServicesFound": "Nessun servizio trovato per questa categoria.",
            "catFirstNations": "Prime Nazioni",
            "catArts": "Arte",
            "catHealth": "Salute e benessere",
            "catYouth": "Gioventù",
            "catCarers": "Servizi di supporto per i caregiver",
            "catChildrenFamilies": "Bambini e famiglie",
            "catCommunitySupport": "Supporto comunitario",
            "catDisability": "Servizi per la disabilità",
            "catDomesticViolence": "Violenza domestica",
            "catFood": "Cibo e supporto di emergenza",
            "catGovernment": "Dipartimenti governativi",
            "catLgbtqia": "Comunità LGBTQIA+",
            "catMulticultural": "Multiculturale",
            "clearAllFilters": "Cancella Tutti i Filtri"
        },
        "Greek": {
            "titleFind": "Βρείτε",
            "titleResources": "πόρους",
            "titleAtTheLibrary": "στη βιβλιοθήκη",
            "headingSelectLanguage": "Επιλέξτε τη γλώσσα σας:",
            "headingChooseCategory": "Επιλέξτε μια κατηγορία:",
            "listHeader": "Κατάλογος Υπηρεσιών",
            "labelAddress": "Διεύθυνση:",
            "labelPhone": "Τηλέφωνο:",
            "labelEmail": "Ηλεκτρονική Διεύθυνση:",
            "noServicesFound": "Δεν βρέθηκαν υπηρεσίες για αυτήν την κατηγορία.",
            "catFirstNations": "Υπηρεσίες Πρώτων Εθνών",
            "catArts": "Τέχνες",
            "catHealth": "Υγεία & Ευεξία",
            "catYouth": "Νεολαία",
            "catCarers": "Υπηρεσίες Υποστήριξης Φροντιστών",
            "catChildrenFamilies": "Παιδιά & Οικογένειες",
            "catCommunitySupport": "Κοινοτική Υποστήριξη",
            "catDisability": "Υπηρεσίες Αναπηρίας",
            "catDomesticViolence": "Ενδοοικογενειακή Βία",
            "catFood": "Τρόφιμα & Έκτακτη Ανάγκη",
            "catGovernment": "Κυβερνητικές Υπηρεσίες",
            "catLgbtqia": "Κοινότητες LGBTQIA+",
            "catMulticultural": "Πολυπολιτισμικό",
            "clearAllFilters": "Καθαρισμός Όλων των Φίλτρων"
        }
    };

    let map, markerLayer;
    let selectedLanguage = 'English';
    let selectedCommunity = 'First Nations';
    let originalTexts = {};

    /**
     * Initializes the Leaflet map component
     * 
     * Creates and configures the interactive map using Leaflet.js library,
     * sets up OpenStreetMap tiles, creates marker layer group, and handles
     * map sizing and error cases.
     * 
     * @throws {Error} Logs error if map container is not found or initialization fails
     * 
     * @example
     * initializeMap(); // Creates map centered on Sydney area
     */
    function initializeMap() {
        console.log('Initializing map...');
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }
        
        try {
            map = L.map('map').setView([-33.97, 151.08], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            markerLayer = L.layerGroup().addTo(map);
            
            setTimeout(() => {
                if (map) {
                    map.invalidateSize();
                }
            }, 100);
            
            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    /**
     * Generates QR code for organization website URLs
     * 
     * Creates a QR code image element for the provided URL with optional
     * security validation. Falls back to basic validation if SecurityManager
     * is not available. Handles errors gracefully with user-friendly messages.
     * 
     * @param {string} url - The URL to encode in the QR code
     * 
     * @returns {HTMLImageElement|HTMLSpanElement} QR code image element or error message span
     * 
     * @throws {Error} Returns error span if URL is invalid or QR generation fails
     * 
     * @example
     * const qrElement = generateQrCode('https://example.org');
     * document.body.appendChild(qrElement);
     */
    function generateQrCode(url) {
        try {
            // Sanitize URL if security manager is available
            let sanitizedUrl = url;
            if (security && security.sanitizer && security.sanitizer.sanitizeURL) {
                sanitizedUrl = security.sanitizer.sanitizeURL(url);
                if (!sanitizedUrl) {
                    throw new Error('Invalid URL provided');
                }
            } else {
                // Basic URL validation without security manager
                try {
                    new URL(url);
                } catch (e) {
                    throw new Error('Invalid URL provided');
                }
            }
            
            // Check if qrcode function is available
            if (typeof qrcode === 'undefined') {
                throw new Error('QR code library not loaded');
            }
            
            // Create QR code with automatic type detection
            const qr = qrcode(0, 'L');
            qr.addData(sanitizedUrl);
            qr.make();
            
            // Get the module count for the QR code
            const moduleCount = qr.getModuleCount();
            const cellSize = 4;
            const margin = 8;
            const size = moduleCount * cellSize + margin * 2;
            
            // Create canvas element to draw QR code
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = '80px';
            canvas.style.height = '80px';
            
            const ctx = canvas.getContext('2d');
            
            // Fill background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            
            // Draw QR code modules
            ctx.fillStyle = '#000000';
            for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                    if (qr.isDark(row, col)) {
                        ctx.fillRect(
                            col * cellSize + margin,
                            row * cellSize + margin,
                            cellSize,
                            cellSize
                        );
                    }
                }
            }
            
            // Convert canvas to image
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');
            img.alt = `QR code for ${sanitizedUrl}`;
            img.style.cssText = 'width: 80px; height: 80px;';
            
            return img;
            
            return img;
        } catch (e) {
            console.error('QR Code generation failed:', e);
            console.error('URL was:', url);
            console.error('QR code library available:', typeof qrcode !== 'undefined');
            
            // Create a simple fallback QR code placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 80px; 
                height: 80px; 
                background: #f0f0f0; 
                border: 2px dashed #ccc; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 10px; 
                color: #666; 
                text-align: center;
                border-radius: 4px;
            `;
            placeholder.textContent = 'QR Code';
            placeholder.title = `QR code for ${url}`;
            
            return placeholder;
        }
    }

    /**
     * Stores original text content for translation system
     * 
     * Captures the original English text content from elements with
     * data-translate-key attributes to enable language switching
     * without losing the original content.
     * 
     * @modifies {Object} originalTexts - Global object storing original text content
     * 
     * @example
     * storeOriginalTexts(); // Stores all translatable text content
     */
    function storeOriginalTexts() {
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            originalTexts[el.dataset.translateKey] = el.innerText;
        });
    }

    /**
     * Applies translations to UI elements
     * 
     * Updates all elements with data-translate-key attributes to display
     * text in the specified language. Falls back to English if translation
     * is not available for the requested language.
     * 
     * @param {string} language - Target language code (e.g., 'English', 'Mandarin', 'Greek')
     * 
     * @modifies {HTMLElement} Updates text content of translatable elements
     * @calls updateDisplay() - Refreshes the organization display after translation
     * 
     * @example
     * applyTranslations('Mandarin'); // Switches UI to Mandarin
     */
    function applyTranslations(language) {
        const translationSet = translations[language] || translations['English'];
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translationSet[key]) {
                el.innerText = translationSet[key];
            }
        });
        updateDisplay();
    }

    /**
     * Updates the map markers and organization list display
     * 
     * Filters organizations based on selected language and community category,
     * clears existing map markers and list items, then populates both the map
     * and list with filtered results. Handles empty results with user feedback.
     * 
     * @modifies {L.LayerGroup} markerLayer - Clears and repopulates map markers
     * @modifies {HTMLUListElement} organisationList - Updates organization list content
     * 
     * @uses {string} selectedLanguage - Global variable for current language filter
     * @uses {string} selectedCommunity - Global variable for current community filter
     * @uses {Array<Object>} sanitizedPartners - Global array of validated partner data
     * 
     * @example
     * selectedCommunity = 'Arts';
     * updateDisplay(); // Shows only Arts organizations
     */
    function updateDisplay() {
        console.log('Updating display for community:', selectedCommunity);
        const organisationList = document.getElementById('organisation-list');
        const listHeader = document.getElementById('list-header');
        
        if (!organisationList || !markerLayer) {
            console.error('Missing elements');
            return;
        }
        
        markerLayer.clearLayers();
        // Clear list safely
        while (organisationList.firstChild) {
            organisationList.removeChild(organisationList.firstChild);
        }
        
        const currentTranslations = translations[selectedLanguage] || translations['English'];
        if (listHeader) {
            listHeader.textContent = currentTranslations.listHeader;
        }
        
        const filteredPartners = sanitizedPartners.filter(p => {
            const languageMatch = p.languages.includes(selectedLanguage) || p.languages.includes('English');
            const communityMatch = p.community === selectedCommunity;
            return languageMatch && communityMatch;
        });
        
        console.log('Found', filteredPartners.length, 'partners');

        if (filteredPartners.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.className = 'organisation-item';
            const noResultsText = document.createElement('p');
            noResultsText.textContent = currentTranslations.noServicesFound;
            noResultsItem.appendChild(noResultsText);
            organisationList.appendChild(noResultsItem);
            return;
        }

        filteredPartners.forEach((partner) => {
            const description = partner.description[selectedLanguage] || partner.description['English'];
            const emailHTML = (partner.email && partner.email !== "N/A") 
                ? `<p><strong>${currentTranslations.labelEmail}</strong> <a href="mailto:${partner.email}">${partner.email}</a></p>`
                : '';

            const listItem = document.createElement('li');
            listItem.className = 'organisation-item';
            
            // Create item details container
            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            
            // Create and add title
            const title = document.createElement('h3');
            title.textContent = partner.name;
            itemDetails.appendChild(title);
            
            // Create and add description
            const descriptionP = document.createElement('p');
            descriptionP.className = 'item-description';
            descriptionP.textContent = description;
            itemDetails.appendChild(descriptionP);
            
            // Create and add address
            const addressP = document.createElement('p');
            const addressLabel = document.createElement('strong');
            addressLabel.textContent = currentTranslations.labelAddress;
            addressP.appendChild(addressLabel);
            addressP.appendChild(document.createTextNode(' ' + partner.address));
            itemDetails.appendChild(addressP);
            
            // Create and add phone
            const phoneP = document.createElement('p');
            const phoneLabel = document.createElement('strong');
            phoneLabel.textContent = currentTranslations.labelPhone;
            phoneP.appendChild(phoneLabel);
            phoneP.appendChild(document.createTextNode(' ' + partner.phone));
            itemDetails.appendChild(phoneP);
            
            // Add email if exists
            if (partner.email && partner.email !== 'N/A') {
                const emailP = document.createElement('p');
                const emailLabel = document.createElement('strong');
                emailLabel.textContent = currentTranslations.labelEmail;
                emailP.appendChild(emailLabel);
                emailP.appendChild(document.createTextNode(' '));
                
                const emailLink = document.createElement('a');
                emailLink.href = `mailto:${partner.email}`;
                emailLink.textContent = partner.email;
                emailP.appendChild(emailLink);
                itemDetails.appendChild(emailP);
            }
            
            // Create QR code container
            const qrContainer = document.createElement('div');
            qrContainer.className = 'item-qr-code';
            qrContainer.appendChild(generateQrCode(partner.website));
            
            // Assemble the list item
            listItem.appendChild(itemDetails);
            listItem.appendChild(qrContainer);
            organisationList.appendChild(listItem);

            if (partner.lat && partner.lng) {
                const marker = L.marker([partner.lat, partner.lng]).addTo(markerLayer);
                
                // Create popup content safely using DOM methods
                const popupContainer = document.createElement('div');
                
                // Create title
                const popupTitle = document.createElement('h3');
                popupTitle.textContent = partner.name;
                popupContainer.appendChild(popupTitle);
                
                // Create description
                const popupDesc = document.createElement('p');
                popupDesc.className = 'popup-description';
                popupDesc.textContent = description;
                popupContainer.appendChild(popupDesc);
                
                // Create details container
                const popupDetails = document.createElement('div');
                popupDetails.className = 'popup-details';
                
                // Add address
                const popupAddress = document.createElement('p');
                const addressLabel = document.createElement('strong');
                addressLabel.textContent = currentTranslations.labelAddress;
                popupAddress.appendChild(addressLabel);
                popupAddress.appendChild(document.createTextNode(' ' + partner.address));
                popupDetails.appendChild(popupAddress);
                
                // Add phone
                const popupPhone = document.createElement('p');
                const phoneLabel = document.createElement('strong');
                phoneLabel.textContent = currentTranslations.labelPhone;
                popupPhone.appendChild(phoneLabel);
                popupPhone.appendChild(document.createTextNode(' ' + partner.phone));
                popupDetails.appendChild(popupPhone);
                
                // Add email if exists
                if (partner.email && partner.email !== 'N/A') {
                    const popupEmail = document.createElement('p');
                    const emailLabel = document.createElement('strong');
                    emailLabel.textContent = currentTranslations.labelEmail;
                    popupEmail.appendChild(emailLabel);
                    popupEmail.appendChild(document.createTextNode(' '));
                    
                    const emailLink = document.createElement('a');
                    emailLink.href = `mailto:${partner.email}`;
                    emailLink.textContent = partner.email;
                    popupEmail.appendChild(emailLink);
                    popupDetails.appendChild(popupEmail);
                }
                
                popupContainer.appendChild(popupDetails);
                
                // Add QR code
                const popupQr = document.createElement('div');
                popupQr.className = 'popup-qr-code';
                popupQr.appendChild(generateQrCode(partner.website));
                popupContainer.appendChild(popupQr);
                
                marker.bindPopup(popupContainer);
            }
        });
    }

    /**
     * Sets up event listeners for language and community filter buttons
     * 
     * Attaches click event handlers to all filter buttons, manages active states,
     * updates global filter variables, and triggers display updates. Handles both
     * language selection and community category filtering.
     * 
     * @modifies {HTMLButtonElement} Adds/removes 'active' class from filter buttons
     * @modifies {string} selectedLanguage - Updates global language filter
     * @modifies {string} selectedCommunity - Updates global community filter
     * 
     * @listens click - On language and community filter buttons
     * @calls applyTranslations() - When language filter changes
     * @calls updateDisplay() - When community filter changes
     * 
     * @example
     * setupFilterButtons(); // Enables all filter button interactions
     */
    function setupFilterButtons() {
        const languageFilters = document.getElementById('language-filters');
        const communityFilters = document.getElementById('community-filters');
        const clearAllFiltersBtn = document.getElementById('clear-all-filters');
        
        if (languageFilters) {
            languageFilters.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (button) {
                    const filterValue = button.getAttribute('data-filter');
                    
                    languageFilters.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    selectedLanguage = filterValue;
                    applyTranslations(selectedLanguage);
                }
            });
        }
        
        if (communityFilters) {
            communityFilters.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (button) {
                    const filterValue = button.getAttribute('data-filter');
                    
                    communityFilters.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    selectedCommunity = filterValue;
                    updateDisplay();
                }
            });
        }
        
        // Clear all filters functionality
        if (clearAllFiltersBtn) {
            clearAllFiltersBtn.addEventListener('click', () => {
                // Reset to default values
                selectedLanguage = 'English';
                selectedCommunity = 'First Nations';
                
                // Reset language filter buttons
                if (languageFilters) {
                    languageFilters.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
                    const englishBtn = languageFilters.querySelector('[data-filter="English"]');
                    if (englishBtn) englishBtn.classList.add('active');
                }
                
                // Reset community filter buttons
                if (communityFilters) {
                    communityFilters.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
                    const firstNationsBtn = communityFilters.querySelector('[data-filter="First Nations"]');
                    if (firstNationsBtn) firstNationsBtn.classList.add('active');
                }
                
                // Apply changes
                applyTranslations(selectedLanguage);
                updateDisplay();
            });
        }
    }

    /**
     * Starts the animated scrolling category text effect
     * 
     * Creates a rotating text animation in the page title that cycles through
     * different community service categories. Uses fade transitions and
     * updates the text content every 3 seconds.
     * 
     * @modifies {HTMLElement} #scrolling-category - Updates text content with animation
     * 
     * @returns {number} Interval ID for the animation timer
     * 
     * @example
     * const animationId = startScrollingCategory();
     * // Later: clearInterval(animationId) to stop animation
     */
    function startScrollingCategory() {
        const categories = [
            'community', 'health', 'arts', 'youth', 'family', 'support', 'cultural', 'disability', 'emergency', 'government'
        ];
        
        const scrollingElement = document.getElementById('scrolling-category');
        if (!scrollingElement) return;
        
        let currentIndex = 0;
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % categories.length;
            scrollingElement.textContent = categories[currentIndex];
        }, 3000);
    }

    // Initialize everything
    console.log('Initializing application...');
    storeOriginalTexts();
    initializeMap();
    setupFilterButtons();
    startScrollingCategory();
    updateDisplay();
    
    console.log('Application initialized successfully');
});