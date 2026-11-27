/* NearShop Karnataka - shared application logic. Loaded on every page after config.js */
(function () {
  'use strict';
  var cfg = window.NEARSHOP_CONFIG || {};
  var NS = (window.NS = {});

  // ---------- Supabase client -------------------------------------------
  if (!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_KEY) {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.insertAdjacentHTML('afterbegin',
        '<div class="alert alert-danger m-3">Configuration error: supabase.js or config.js failed to load. ' +
        'Keep all files in the same folder and open the site through a web server (see README).</div>');
    });
    return;
  }
  var sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);
  NS.sb = sb;
  NS.cfg = cfg;

  // ---------- Karnataka reference data ----------------------------------
  NS.CITIES = ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Udupi', 'Shivamogga',
    'Kalaburagi', 'Tumakuru', 'Davangere', 'Ballari', 'Hassan', 'Mandya', 'Dharwad', 'Vijayapura'];
  NS.DISTRICTS = ['Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
    'Chamarajanagar', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere',
    'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru',
    'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayanagara',
    'Vijayapura', 'Yadgir'];

  // ---------- i18n (English / Kannada) ----------------------------------
  var T = {
    en: {
      brand: 'NearShop Karnataka', tagline: 'Find products. Discover local shops. Save time.',
      nav_home: 'Home', nav_search: 'Search Products', nav_shops: 'Nearby Shops', nav_catalogue: 'Product Catalogue', nav_login: 'Login',
      nav_customer_login: 'Customer Login', nav_shop_login: 'Shop Owner Login', nav_signup: 'Customer Sign Up',
      nav_register_shop: 'Register Shop', nav_dashboard: 'Dashboard', nav_admin: 'Admin Panel',
      nav_logout: 'Logout', nav_products: 'Manage Products',
      hero_title: 'Check product availability before you visit local shops',
      hero_sub: 'Search shops across Karnataka, compare prices and see when stock was last updated.',
      search_ph: 'Search a product, e.g. rice, charger, notebook', search_btn: 'Search Products',
      all_cities: 'All cities', all_categories: 'All categories', pin_ph: 'PIN code (optional)',
      categories: 'Browse categories', featured: 'Recently updated in-stock products', verified_shops: 'Verified local shops',
      view_all: 'View all', cta_title: 'Own a shop in Karnataka?',
      cta_text: 'List your shop, update stock in seconds and let nearby customers know what you have today.',
      how_title: 'How it works', how1: 'Search a product', how2: 'Compare shops, prices and stock', how3: 'Contact the shop, then visit',
      privacy: 'Privacy: we collect only what is needed for shop discovery and enquiries (DPDP Act, 2023).',
      stock_note: 'Stock is reported by shop owners and may change. Check the "last updated" time and call before travelling.',
      available: 'Available', low_stock: 'Low Stock', out_of_stock: 'Out of Stock', unverified: 'Unverified',
      fresh: 'Recently updated', aging: 'Update recommended', unverified_long: 'Availability unverified',
      last_updated: 'Stock last updated', contact_shop: 'Contact Shop', call: 'Call', enquire: 'Send enquiry',
      report: 'Report issue', view_shop: 'View shop', compare: 'Compare prices', lowest: 'Lowest price',
      register_shop: 'Register Shop', search: 'Search', price: 'Price', max_price: 'Max price (₹)',
      category: 'Category', city: 'City', district: 'District', pincode: 'PIN code', address: 'Address',
      phone: 'Phone', hours: 'Opening hours', name: 'Name', full_name: 'Full name', email: 'Email',
      mobile: 'Mobile number', password: 'Password', save: 'Save', delete: 'Delete', cancel: 'Cancel',
      send: 'Send', close: 'Close', loading: 'Loading...', no_results: 'No matching stock found.',
      no_results_hint: 'Try a shorter name, another city, or remove filters.',
      in_stock_only: 'In stock only', sort: 'Sort by', sort_price: 'Price (low to high)',
      sort_distance: 'Distance (nearest)', sort_updated: 'Recently updated', use_location: 'Use my location',
      km_away: 'km away', results: 'results', qty: 'Quantity', status: 'Status', product: 'Product',
      shop: 'Shop', actions: 'Actions', pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
      access_denied: 'Access denied. You do not have permission to view this page.',
      login_title: 'Login', login_btn: 'Login', no_account: 'No account?', have_account: 'Already registered?',
      role_customer: 'Customer', role_shop: 'Shop owner', role_admin: 'Administrator',
      register_customer: 'Create customer account', register_shop_title: 'Register your shop',
      consent: 'I agree to the processing of my personal data for shop discovery and enquiries, as described in the privacy notice.',
      shop_details: 'Shop details', owner_details: 'Owner details', category_focus: 'Main category',
      reg_shop_note: 'Your shop will be visible to customers only after admin approval.',
      check_email: 'Account created. Please confirm your email address (check your inbox), then log in.',
      enquiries: 'Enquiries', my_enquiries: 'My enquiries', message: 'Message', reply: 'Reply',
      write_review: 'Rate this shop', reviews: 'Reviews', rating: 'Rating', comment: 'Comment (optional)',
      stats_total: 'Listed products', stats_available: 'Available', stats_low: 'Low stock', stats_out: 'Out of stock',
      stats_stale: 'Stale (>72h)', add_product: 'Add product to my shop', your_listings: 'Your listings',
      quantity_updated: 'Saved', confirm_stock: 'Confirm still in stock', mark_out: 'Mark out of stock',
      shop_status: 'Shop verification', delete_account: 'Delete my account and data',
      lang_switch: 'ಕನ್ನಡ', footer: 'NearShop Karnataka - connecting local shops and customers.',
      shops_title: 'Local shops', shop_search_ph: 'Search shop name', open_map: 'Open in OpenStreetMap',
      products_here: 'Products at this shop', filter_products: 'Filter products...', where_to_buy: 'Where to buy',
      logged_in_as: 'Signed in as', my_profile: 'My profile', edit: 'Edit', saving: 'Saving...',
      enquiry_sent: 'Enquiry sent to the shop.', report_sent: 'Report submitted. Thank you.',
      login_needed: 'Please log in as a customer first.', customers_only: 'Only customer accounts can do this.',
      reason: 'Reason', details: 'Details'
    },
    kn: {
      brand: 'ನಿಯರ್‌ಶಾಪ್ ಕರ್ನಾಟಕ', tagline: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ. ಹತ್ತಿರದ ಅಂಗಡಿಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ. ಸಮಯ ಉಳಿಸಿ.',
      nav_home: 'ಮುಖಪುಟ', nav_search: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ', nav_shops: 'ಹತ್ತಿರದ ಅಂಗಡಿಗಳು', nav_catalogue: 'ಉತ್ಪನ್ನಗಳ ಪಟ್ಟಿ', nav_login: 'ಲಾಗಿನ್',
      nav_customer_login: 'ಗ್ರಾಹಕ ಲಾಗಿನ್', nav_shop_login: 'ಅಂಗಡಿ ಮಾಲೀಕ ಲಾಗಿನ್', nav_signup: 'ಗ್ರಾಹಕ ನೋಂದಣಿ',
      nav_register_shop: 'ಅಂಗಡಿಯನ್ನು ನೋಂದಾಯಿಸಿ', nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', nav_admin: 'ನಿರ್ವಾಹಕ ಪ್ಯಾನೆಲ್',
      nav_logout: 'ಲಾಗ್ ಔಟ್', nav_products: 'ಉತ್ಪನ್ನ ನಿರ್ವಹಣೆ',
      hero_title: 'ಅಂಗಡಿಗೆ ಹೋಗುವ ಮೊದಲು ಉತ್ಪನ್ನ ಲಭ್ಯವಿದೆಯೇ ಎಂದು ನೋಡಿ',
      hero_sub: 'ಕರ್ನಾಟಕದ ಅಂಗಡಿಗಳಲ್ಲಿ ಹುಡುಕಿ, ಬೆಲೆ ಹೋಲಿಸಿ, ಸ್ಟಾಕ್ ಯಾವಾಗ ನವೀಕರಿಸಲಾಗಿದೆ ಎಂದು ತಿಳಿಯಿರಿ.',
      search_ph: 'ಉತ್ಪನ್ನ ಹುಡುಕಿ, ಉದಾ. ಅಕ್ಕಿ, ಚಾರ್ಜರ್, ನೋಟ್‌ಬುಕ್', search_btn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ',
      all_cities: 'ಎಲ್ಲಾ ನಗರಗಳು', all_categories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು', pin_ph: 'ಪಿನ್ ಕೋಡ್ (ಐಚ್ಛಿಕ)',
      categories: 'ವರ್ಗಗಳನ್ನು ನೋಡಿ', featured: 'ಇತ್ತೀಚೆಗೆ ನವೀಕರಿಸಿದ ಲಭ್ಯ ಉತ್ಪನ್ನಗಳು', verified_shops: 'ಪರಿಶೀಲಿತ ಸ್ಥಳೀಯ ಅಂಗಡಿಗಳು',
      view_all: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ', cta_title: 'ಕರ್ನಾಟಕದಲ್ಲಿ ನಿಮ್ಮದೇ ಅಂಗಡಿ ಇದೆಯೇ?',
      cta_text: 'ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ಪಟ್ಟಿ ಮಾಡಿ, ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸ್ಟಾಕ್ ನವೀಕರಿಸಿ.',
      how_title: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', how1: 'ಉತ್ಪನ್ನ ಹುಡುಕಿ', how2: 'ಅಂಗಡಿ, ಬೆಲೆ ಮತ್ತು ಸ್ಟಾಕ್ ಹೋಲಿಸಿ', how3: 'ಅಂಗಡಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ, ನಂತರ ಭೇಟಿ ನೀಡಿ',
      privacy: 'ಗೌಪ್ಯತೆ: ಅಂಗಡಿ ಹುಡುಕಾಟ ಮತ್ತು ವಿಚಾರಣೆಗೆ ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಸಂಗ್ರಹಿಸುತ್ತೇವೆ (DPDP ಕಾಯ್ದೆ, 2023).',
      stock_note: 'ಸ್ಟಾಕ್ ಮಾಹಿತಿಯನ್ನು ಅಂಗಡಿ ಮಾಲೀಕರು ನೀಡುತ್ತಾರೆ ಮತ್ತು ಬದಲಾಗಬಹುದು. ಹೊರಡುವ ಮೊದಲು ಕರೆ ಮಾಡಿ.',
      available: 'ಲಭ್ಯವಿದೆ', low_stock: 'ಕಡಿಮೆ ಸ್ಟಾಕ್', out_of_stock: 'ಸ್ಟಾಕ್ ಇಲ್ಲ', unverified: 'ಖಚಿತವಿಲ್ಲ',
      fresh: 'ಇತ್ತೀಚೆಗೆ ನವೀಕರಿಸಲಾಗಿದೆ', aging: 'ನವೀಕರಣ ಅಗತ್ಯ', unverified_long: 'ಲಭ್ಯತೆ ಖಚಿತವಿಲ್ಲ',
      last_updated: 'ಸ್ಟಾಕ್ ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಿದ್ದು', contact_shop: 'ಅಂಗಡಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ', call: 'ಕರೆ ಮಾಡಿ',
      enquire: 'ವಿಚಾರಣೆ ಕಳುಹಿಸಿ', report: 'ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ', view_shop: 'ಅಂಗಡಿ ನೋಡಿ', compare: 'ಬೆಲೆ ಹೋಲಿಸಿ', lowest: 'ಕಡಿಮೆ ಬೆಲೆ',
      register_shop: 'ಅಂಗಡಿಯನ್ನು ನೋಂದಾಯಿಸಿ', search: 'ಹುಡುಕಿ', price: 'ಬೆಲೆ', max_price: 'ಗರಿಷ್ಠ ಬೆಲೆ (₹)',
      category: 'ವರ್ಗ', city: 'ನಗರ', district: 'ಜಿಲ್ಲೆ', pincode: 'ಪಿನ್ ಕೋಡ್', address: 'ವಿಳಾಸ',
      phone: 'ಫೋನ್', hours: 'ಕೆಲಸದ ಸಮಯ', name: 'ಹೆಸರು', full_name: 'ಪೂರ್ಣ ಹೆಸರು', email: 'ಇಮೇಲ್',
      mobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', password: 'ಪಾಸ್‌ವರ್ಡ್', save: 'ಉಳಿಸಿ', delete: 'ಅಳಿಸಿ', cancel: 'ರದ್ದುಮಾಡಿ',
      send: 'ಕಳುಹಿಸಿ', close: 'ಮುಚ್ಚಿ', loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', no_results: 'ಯಾವುದೇ ಸ್ಟಾಕ್ ಸಿಗಲಿಲ್ಲ.',
      no_results_hint: 'ಚಿಕ್ಕ ಹೆಸರು ಅಥವಾ ಬೇರೆ ನಗರ ಪ್ರಯತ್ನಿಸಿ.',
      in_stock_only: 'ಲಭ್ಯವಿರುವುದು ಮಾತ್ರ', sort: 'ವಿಂಗಡಿಸಿ', sort_price: 'ಬೆಲೆ (ಕಡಿಮೆಯಿಂದ ಹೆಚ್ಚು)',
      sort_distance: 'ದೂರ (ಹತ್ತಿರದ್ದು)', sort_updated: 'ಇತ್ತೀಚೆಗೆ ನವೀಕರಿಸಿದ್ದು', use_location: 'ನನ್ನ ಸ್ಥಳ ಬಳಸಿ',
      km_away: 'ಕಿ.ಮೀ ದೂರ', results: 'ಫಲಿತಾಂಶಗಳು', qty: 'ಪ್ರಮಾಣ', status: 'ಸ್ಥಿತಿ', product: 'ಉತ್ಪನ್ನ',
      shop: 'ಅಂಗಡಿ', actions: 'ಕ್ರಿಯೆಗಳು', pending: 'ಬಾಕಿ ಇದೆ', approved: 'ಅನುಮೋದಿತ', rejected: 'ತಿರಸ್ಕೃತ',
      access_denied: 'ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ.',
      login_title: 'ಲಾಗಿನ್', login_btn: 'ಲಾಗಿನ್', no_account: 'ಖಾತೆ ಇಲ್ಲವೇ?', have_account: 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?',
      role_customer: 'ಗ್ರಾಹಕ', role_shop: 'ಅಂಗಡಿ ಮಾಲೀಕ', role_admin: 'ನಿರ್ವಾಹಕ',
      register_customer: 'ಗ್ರಾಹಕ ಖಾತೆ ರಚಿಸಿ', register_shop_title: 'ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ನೋಂದಾಯಿಸಿ',
      consent: 'ಅಂಗಡಿ ಹುಡುಕಾಟ ಮತ್ತು ವಿಚಾರಣೆಗಾಗಿ ನನ್ನ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಬಳಸಲು ಒಪ್ಪುತ್ತೇನೆ.',
      shop_details: 'ಅಂಗಡಿ ವಿವರಗಳು', owner_details: 'ಮಾಲೀಕರ ವಿವರಗಳು', category_focus: 'ಮುಖ್ಯ ವರ್ಗ',
      reg_shop_note: 'ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆಯ ನಂತರ ಮಾತ್ರ ನಿಮ್ಮ ಅಂಗಡಿ ಗ್ರಾಹಕರಿಗೆ ಕಾಣಿಸುತ್ತದೆ.',
      check_email: 'ಖಾತೆ ರಚಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಇಮೇಲ್ ದೃಢೀಕರಿಸಿ, ನಂತರ ಲಾಗಿನ್ ಮಾಡಿ.',
      enquiries: 'ವಿಚಾರಣೆಗಳು', my_enquiries: 'ನನ್ನ ವಿಚಾರಣೆಗಳು', message: 'ಸಂದೇಶ', reply: 'ಉತ್ತರ',
      write_review: 'ಈ ಅಂಗಡಿಗೆ ರೇಟಿಂಗ್ ನೀಡಿ', reviews: 'ವಿಮರ್ಶೆಗಳು', rating: 'ರೇಟಿಂಗ್', comment: 'ಕಾಮೆಂಟ್ (ಐಚ್ಛಿಕ)',
      stats_total: 'ಪಟ್ಟಿ ಮಾಡಿದ ಉತ್ಪನ್ನಗಳು', stats_available: 'ಲಭ್ಯ', stats_low: 'ಕಡಿಮೆ ಸ್ಟಾಕ್', stats_out: 'ಸ್ಟಾಕ್ ಇಲ್ಲ',
      stats_stale: 'ಹಳೆಯದು (>72ಗಂ)', add_product: 'ನನ್ನ ಅಂಗಡಿಗೆ ಉತ್ಪನ್ನ ಸೇರಿಸಿ', your_listings: 'ನಿಮ್ಮ ಪಟ್ಟಿ',
      quantity_updated: 'ಉಳಿಸಲಾಗಿದೆ', confirm_stock: 'ಇನ್ನೂ ಸ್ಟಾಕ್ ಇದೆ ಎಂದು ದೃಢೀಕರಿಸಿ', mark_out: 'ಸ್ಟಾಕ್ ಇಲ್ಲ ಎಂದು ಗುರುತಿಸಿ',
      shop_status: 'ಅಂಗಡಿ ಪರಿಶೀಲನೆ', delete_account: 'ನನ್ನ ಖಾತೆ ಮತ್ತು ಡೇಟಾ ಅಳಿಸಿ',
      lang_switch: 'English', footer: 'ನಿಯರ್‌ಶಾಪ್ ಕರ್ನಾಟಕ - ಸ್ಥಳೀಯ ಅಂಗಡಿಗಳು ಮತ್ತು ಗ್ರಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
      shops_title: 'ಸ್ಥಳೀಯ ಅಂಗಡಿಗಳು', shop_search_ph: 'ಅಂಗಡಿ ಹೆಸರು ಹುಡುಕಿ', open_map: 'ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯಿರಿ',
      products_here: 'ಈ ಅಂಗಡಿಯ ಉತ್ಪನ್ನಗಳು', filter_products: 'ಉತ್ಪನ್ನ ಫಿಲ್ಟರ್...', where_to_buy: 'ಎಲ್ಲಿ ಖರೀದಿಸಬಹುದು',
      logged_in_as: 'ಲಾಗಿನ್ ಆಗಿದ್ದಾರೆ', my_profile: 'ನನ್ನ ಪ್ರೊಫೈಲ್', edit: 'ತಿದ್ದಿ', saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
      enquiry_sent: 'ವಿಚಾರಣೆಯನ್ನು ಅಂಗಡಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.', report_sent: 'ವರದಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದ.',
      login_needed: 'ದಯವಿಟ್ಟು ಮೊದಲು ಗ್ರಾಹಕರಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ.', customers_only: 'ಗ್ರಾಹಕ ಖಾತೆಗಳು ಮಾತ್ರ ಇದನ್ನು ಮಾಡಬಹುದು.',
      reason: 'ಕಾರಣ', details: 'ವಿವರಗಳು'
    }
  };
  var lang = 'en';
  try { lang = localStorage.getItem('ns_lang') === 'kn' ? 'kn' : 'en'; } catch (e) { /* storage blocked */ }
  var current = { user: null, profile: null, active: '' };
  var langListeners = [];

  function t(key, vars) {
    var s = (T[lang] && T[lang][key]) || T.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  NS.t = t;
  NS.lang = function () { return lang; };
  NS.onLang = function (fn) { langListeners.push(fn); };
  NS.catName = function (c) { return c ? (lang === 'kn' && c.name_kn ? c.name_kn : c.name) : ''; };

  function applyI18n(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    root.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
  }
  NS.applyI18n = applyI18n;

  function setLang(l) {
    lang = l === 'kn' ? 'kn' : 'en';
    try { localStorage.setItem('ns_lang', lang); } catch (e) { /* ignore */ }
    document.documentElement.lang = lang;
    renderNav();
    renderFooter();
    applyI18n();
    langListeners.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }

  // ---------- Helpers ----------------------------------------------------
  function esc(s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  NS.esc = esc;
  NS.inr = function (n) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n) || 0);
  };
  NS.normPhone = function (v) {
    var d = String(v || '').replace(/[^0-9]/g, '');
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    else if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return d;
  };
  NS.validPhone = function (v) { return /^[6-9][0-9]{9}$/.test(NS.normPhone(v)); };
  NS.validPin = function (v) { return /^(5[6-8][0-9]{4}|59[01][0-9]{3})$/.test(String(v || '').trim()); };
  NS.validPassword = function (v) { return typeof v === 'string' && v.length >= 8 && /[A-Za-z]/.test(v) && /[0-9]/.test(v); };
  NS.validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim()); };
  NS.isUuid = function (v) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v || '')); };
  NS.param = function (k) { return new URLSearchParams(location.search).get(k) || ''; };
  NS.safeTerm = function (s) { return String(s || '').replace(/[,()*%\\"'`;:<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60); };
  NS.currentPage = function () { return (location.pathname.split('/').pop() || 'index.html') + location.search; };
  NS.safeNext = function (n) { return /^[a-z0-9\-]+\.html(\?[A-Za-z0-9=&%_\-\.]*)?$/i.test(n || '') ? n : ''; };
  NS.dashboardFor = function (role) {
    return role === 'admin' ? 'admin-dashboard.html' : role === 'shop_owner' ? 'shop-dashboard.html' : 'customer-dashboard.html';
  };
  NS.errMsg = function (e) {
    if (!e) return 'Unknown error';
    if (e.code === '23505') return 'That already exists.';
    if (e.code === '42501' || /row-level security|permission denied/i.test(e.message || '')) return 'You do not have permission to do that.';
    if (e.code === '23514') return 'One of the values is not valid (check price, quantity, PIN code and phone).';
    return e.message || String(e);
  };
  NS.alert = function (type, msg) {
    return '<div class="alert alert-' + type + '" role="alert">' + esc(msg) + '</div>';
  };
  NS.flash = function (el, type, msg) { if (el) el.innerHTML = NS.alert(type, msg); };

  function fmtAgo(iso) {
    var mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 2) return lang === 'kn' ? 'ಇದೀಗ' : 'just now';
    if (mins < 60) return lang === 'kn' ? mins + ' ನಿಮಿಷದ ಹಿಂದೆ' : mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 48) return lang === 'kn' ? hrs + ' ಗಂಟೆಯ ಹಿಂದೆ' : hrs + ' hr ago';
    var days = Math.round(hrs / 24);
    return lang === 'kn' ? days + ' ದಿನಗಳ ಹಿಂದೆ' : days + ' days ago';
  }
  NS.timeAgo = fmtAgo;
  NS.fmtDate = function (iso) {
    return new Date(iso).toLocaleString(lang === 'kn' ? 'kn-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };
  NS.freshness = function (iso) {
    var h = (Date.now() - new Date(iso).getTime()) / 3600000;
    if (h <= (cfg.STOCK_FRESH_HOURS || 24)) return 'fresh';
    if (h <= (cfg.STOCK_AGING_HOURS || 72)) return 'aging';
    return 'unverified';
  };

  // Stock badge. Rule: out of stock is always shown as out of stock; an "available"
  // claim older than the aging threshold is downgraded to "unverified".
  NS.stockBadge = function (it) {
    var f = NS.freshness(it.last_updated);
    var s = it.availability_status;
    if (s === 'out_of_stock') return '<span class="badge badge-out">' + esc(t('out_of_stock')) + '</span>';
    if (f === 'unverified') return '<span class="badge badge-unv">' + esc(t('unverified_long')) + '</span>';
    if (s === 'low_stock') return '<span class="badge badge-low">' + esc(t('low_stock')) + '</span>';
    return '<span class="badge badge-av">' + esc(t('available')) + '</span>';
  };
  NS.freshLine = function (it) {
    var f = NS.freshness(it.last_updated);
    return '<span class="small fresh-' + f + '">' + esc(t('last_updated')) + ': ' + esc(fmtAgo(it.last_updated)) +
      ' &middot; ' + esc(t(f === 'unverified' ? 'unverified_long' : f)) + '</span>';
  };

  var PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" fill="#e5e7eb"/>' +
    '<path d="M18 50l12-14 9 10 6-7 9 11z" fill="#9ca3af"/><circle cx="27" cy="26" r="5" fill="#9ca3af"/></svg>');
  NS.imgSrc = function (url) {
    var base = cfg.SUPABASE_URL + '/storage/v1/object/public/product-images/';
    return url && String(url).indexOf(base) === 0 ? url : PLACEHOLDER;
  };

  // ---------- Geolocation ------------------------------------------------
  var userPos = null;
  NS.getPos = function () {
    return new Promise(function (resolve, reject) {
      if (userPos) return resolve(userPos);
      if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
      navigator.geolocation.getCurrentPosition(function (p) {
        userPos = { lat: p.coords.latitude, lng: p.coords.longitude };
        resolve(userPos);
      }, function (e) { reject(e); }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
    });
  };
  NS.distKm = function (a, shop) {
    if (!a || shop.latitude === null || shop.longitude === null || shop.latitude === undefined) return null;
    var R = 6371, rad = Math.PI / 180;
    var dLat = (shop.latitude - a.lat) * rad, dLng = (shop.longitude - a.lng) * rad;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * rad) * Math.cos(shop.latitude * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };
  NS.osmUrl = function (shop) {
    if (shop.latitude !== null && shop.longitude !== null && shop.latitude !== undefined) {
      var la = Number(shop.latitude), lo = Number(shop.longitude);
      return 'https://www.openstreetmap.org/?mlat=' + la + '&mlon=' + lo + '#map=17/' + la + '/' + lo;
    }
    return 'https://www.openstreetmap.org/search?query=' +
      encodeURIComponent([shop.shop_name, shop.city, shop.pincode, 'Karnataka'].join(', '));
  };

  // ---------- Auth -------------------------------------------------------
  async function loadUser() {
    try {
      var s = await sb.auth.getSession();
      var session = s && s.data && s.data.session;
      if (!session) return { user: null, profile: null };
      var p = await sb.from('profiles').select('id,full_name,email,phone,role,preferred_language').eq('id', session.user.id).maybeSingle();
      return { user: session.user, profile: p.data || null };
    } catch (e) {
      console.error(e);
      return { user: null, profile: null };
    }
  }
  NS.signOut = async function () { await sb.auth.signOut(); location.href = 'index.html'; };

  function renderNav() {
    var host = document.getElementById('ns-nav');
    if (!host) return;
    var u = current.user, p = current.profile, a = current.active;
    function link(href, key, id) {
      return '<li class="nav-item"><a class="nav-link' + (a === id ? ' active' : '') + '" href="' + href + '">' + esc(t(key)) + '</a></li>';
    }
    var right = '';
    if (u && p) {
      right += link(NS.dashboardFor(p.role), 'nav_dashboard', 'dashboard');
      if (p.role === 'shop_owner') right += link('manage-products.html', 'nav_products', 'products');
      right += '<li class="nav-item"><span class="nav-link disabled small">' + esc(p.full_name) + '</span></li>';
      right += '<li class="nav-item"><button class="btn btn-sm btn-outline-light ms-lg-2 mt-1" id="ns-logout">' + esc(t('nav_logout')) + '</button></li>';
    } else {
      right += link('login.html?role=customer', 'nav_customer_login', 'login');
      right += link('customer-register.html', 'nav_signup', 'signup');
      right += link('login.html?role=shop_owner', 'nav_shop_login', 'shoplogin');
      right += '<li class="nav-item"><a class="btn btn-sm btn-light ms-lg-2 mt-1" href="shop-register.html">' + esc(t('nav_register_shop')) + '</a></li>';
    }
    host.innerHTML =
      '<nav class="navbar navbar-expand-lg navbar-ns"><div class="container">' +
      '<a class="navbar-brand fw-bold" href="index.html">&#127978; ' + esc(t('brand')) + '</a>' +
      '<button class="navbar-toggler border-light" type="button" data-bs-toggle="collapse" data-bs-target="#nsMenu" aria-controls="nsMenu" aria-expanded="false" aria-label="Menu">' +
      '<span class="navbar-toggler-icon" style="filter:invert(1)"></span></button>' +
      '<div class="collapse navbar-collapse" id="nsMenu"><ul class="navbar-nav me-auto">' +
      link('index.html', 'nav_home', 'home') + link('search.html', 'nav_search', 'search') + link('shops.html', 'nav_shops', 'shops') + link('catalogue.html', 'nav_catalogue', 'catalogue') +
      '</ul><ul class="navbar-nav align-items-lg-center">' + right +
      '<li class="nav-item"><button class="btn btn-sm btn-outline-light ms-lg-2 mt-1" id="ns-lang" aria-label="Language">' + esc(t('lang_switch')) + '</button></li>' +
      '</ul></div></div></nav>';
    var lb = document.getElementById('ns-lang');
    if (lb) lb.addEventListener('click', function () { setLang(lang === 'kn' ? 'en' : 'kn'); });
    var ob = document.getElementById('ns-logout');
    if (ob) ob.addEventListener('click', NS.signOut);
  }

  function renderFooter() {
    var host = document.getElementById('ns-footer');
    if (!host) return;
    host.innerHTML = '<footer class="ns-footer mt-5 py-4"><div class="container small text-muted">' +
      '<div>' + esc(t('footer')) + '</div><div class="mt-1">' + esc(t('privacy')) + '</div>' +
      '<div class="mt-1">' + esc(t('stock_note')) + '</div></div></footer>';
  }

  // Every page calls NS.init(). opts.roles = array of allowed roles (page guard).
  // NOTE: this guard is UX only. Real enforcement is Row Level Security in the database.
  NS.init = async function (opts) {
    opts = opts || {};
    document.documentElement.lang = lang;
    var ctx = await loadUser();
    current = { user: ctx.user, profile: ctx.profile, active: opts.active || '' };
    renderNav();
    renderFooter();
    applyI18n();
    if (opts.roles) {
      var main = document.getElementById('main');
      if (!ctx.user || !ctx.profile) {
        var r = opts.roles[0] === 'admin' ? 'admin' : opts.roles[0];
        location.replace('login.html?role=' + r + '&next=' + encodeURIComponent(NS.currentPage()));
        return null;
      }
      if (opts.roles.indexOf(ctx.profile.role) < 0) {
        if (main) main.innerHTML = NS.alert('danger', t('access_denied'));
        return null;
      }
    }
    return ctx;
  };

  // ---------- Data access ------------------------------------------------
  var INV_SELECT = 'id,quantity,price,availability_status,last_updated,product_id,shop_id,' +
    'products!inner(id,name,brand,variant,image_url,category_id,categories(name,name_kn)),' +
    'shops!inner(id,shop_name,address,city,district,pincode,phone,opening_hours,latitude,longitude,verification_status)';
  NS.INV_SELECT = INV_SELECT;

  NS.loadCategories = async function () {
    var r = await sb.from('categories').select('id,name,name_kn,icon').order('name');
    return r.data || [];
  };

  // Public search: only APPROVED shops, regardless of who is logged in.
  NS.searchInventory = async function (o) {
    o = o || {};
    var ids = null;
    if (o.productId) {
      ids = [o.productId];
    } else {
      var pq = sb.from('products').select('id').limit(100);
      var terms = NS.safeTerm(o.q).split(' ').filter(Boolean).slice(0, 4);
      terms.forEach(function (w) {
        pq = pq.or('name.ilike.*' + w + '*,brand.ilike.*' + w + '*,variant.ilike.*' + w + '*');
      });
      if (o.categoryId) pq = pq.eq('category_id', o.categoryId);
      var pr = await pq;
      if (pr.error) return { data: [], error: pr.error };
      ids = (pr.data || []).map(function (x) { return x.id; });
      if (!ids.length) return { data: [], error: null };
    }
    var q = sb.from('shop_inventory').select(INV_SELECT)
      .in('product_id', ids)
      .eq('shops.verification_status', 'approved')
      .order('price', { ascending: true })
      .limit(o.limit || 200);
    if (o.city) q = q.eq('shops.city', o.city);
    if (o.pincode) q = q.eq('shops.pincode', o.pincode);
    if (o.maxPrice) q = q.lte('price', o.maxPrice);
    if (o.inStock) q = q.gt('quantity', 0);
    return await q;
  };

  // ---------- Result card ------------------------------------------------
  NS.resultCard = function (it, opts) {
    opts = opts || {};
    var p = it.products, s = it.shops;
    var name = p.name + (p.variant ? ' (' + p.variant + ')' : '');
    var dist = opts.pos ? NS.distKm(opts.pos, s) : null;
    var call = 'tel:+91' + NS.normPhone(s.phone);
    return '<div class="card card-hover mb-3' + (opts.lowest ? ' lowest' : '') + '"><div class="card-body">' +
      '<div class="d-flex gap-3">' +
      '<img class="prod-img" alt="" loading="lazy" src="' + esc(NS.imgSrc(p.image_url)) + '">' +
      '<div class="flex-grow-1">' +
      '<div class="d-flex justify-content-between flex-wrap gap-2"><div>' +
      '<a class="fw-semibold text-decoration-none" href="product-details.html?id=' + esc(p.id) + '">' + esc(name) + '</a>' +
      '<div class="small text-muted">' + esc(p.brand || '') + (p.categories ? ' &middot; ' + esc(NS.catName(p.categories)) : '') + '</div></div>' +
      '<div class="text-end"><div class="fs-5 fw-bold">' + esc(NS.inr(it.price)) + '</div>' +
      (opts.lowest ? '<span class="badge bg-success">' + esc(t('lowest')) + '</span>' : '') + '</div></div>' +
      '<div class="mt-1">' + NS.stockBadge(it) + ' ' + NS.freshLine(it) + '</div>' +
      '<div class="mt-2 small"><a href="shop-details.html?id=' + esc(s.id) + '" class="fw-semibold">' + esc(s.shop_name) + '</a> &middot; ' +
      esc(s.address) + ', ' + esc(s.city) + ' ' + esc(s.pincode) +
      (dist !== null ? ' &middot; <strong>' + dist.toFixed(1) + ' ' + esc(t('km_away')) + '</strong>' : '') + '</div>' +
      '<div class="mt-2 d-flex flex-wrap gap-2">' +
      '<a class="btn btn-sm btn-ns" href="' + esc(call) + '">&#128222; ' + esc(t('call')) + ' ' + esc(NS.normPhone(s.phone)) + '</a>' +
      '<button class="btn btn-sm btn-outline-ns" data-enq="' + esc(s.id) + '|' + esc(p.id) + '" data-sn="' + esc(s.shop_name) + '" data-pn="' + esc(name) + '">' + esc(t('enquire')) + '</button>' +
      '<a class="btn btn-sm btn-outline-secondary" href="product-details.html?id=' + esc(p.id) + '">' + esc(t('compare')) + '</a>' +
      '</div></div></div></div></div>';
  };

  // Delegated click handler for enquiry buttons rendered by resultCard / pages.
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-enq]');
    if (b) {
      var parts = b.getAttribute('data-enq').split('|');
      NS.openEnquiry({ shopId: parts[0], productId: parts[1] || null, shopName: b.getAttribute('data-sn'), productName: b.getAttribute('data-pn') });
    }
    var r = e.target.closest && e.target.closest('[data-rep]');
    if (r) {
      var rp = r.getAttribute('data-rep').split('|');
      NS.openReport({ shopId: rp[0], productId: rp[1] || null, shopName: r.getAttribute('data-sn') });
    }
  });

  // ---------- Modals: enquiry & report ----------------------------------
  function ensureModal(id, title, bodyHtml) {
    var el = document.getElementById(id);
    if (el) el.remove();
    document.body.insertAdjacentHTML('beforeend',
      '<div class="modal fade" id="' + id + '" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
      '<div class="modal-header"><h5 class="modal-title">' + esc(title) + '</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body">' + bodyHtml + '</div></div></div></div>');
    return document.getElementById(id);
  }
  async function needCustomer() {
    var ctx = await loadUser();
    if (!ctx.user || !ctx.profile) {
      location.href = 'login.html?role=customer&next=' + encodeURIComponent(NS.currentPage());
      return null;
    }
    if (ctx.profile.role !== 'customer') { window.alert(t('customers_only')); return null; }
    return ctx;
  }

  NS.openEnquiry = async function (o) {
    var ctx = await needCustomer();
    if (!ctx) return;
    var def = o.productName ? (lang === 'kn' ? o.productName + ' ಲಭ್ಯವಿದೆಯೇ?' : 'Is "' + o.productName + '" available today?') : '';
    var el = ensureModal('nsEnq', t('enquire') + ' - ' + o.shopName,
      '<div id="nsEnqMsg"></div><div class="mb-2"><label class="form-label" for="nsEnqText">' + esc(t('message')) + '</label>' +
      '<textarea id="nsEnqText" class="form-control" rows="3" maxlength="1000" required>' + esc(def) + '</textarea></div>' +
      '<div class="mb-3"><label class="form-label" for="nsEnqPhone">' + esc(t('mobile')) + '</label>' +
      '<input id="nsEnqPhone" class="form-control" inputmode="numeric" maxlength="14" value="' + esc(ctx.profile.phone || '') + '"></div>' +
      '<button class="btn btn-ns" id="nsEnqSend">' + esc(t('send')) + '</button>');
    var modal = new bootstrap.Modal(el);
    modal.show();
    document.getElementById('nsEnqSend').addEventListener('click', async function () {
      var btn = this, msg = document.getElementById('nsEnqText').value.trim();
      var ph = document.getElementById('nsEnqPhone').value;
      var out = document.getElementById('nsEnqMsg');
      if (msg.length < 3) return NS.flash(out, 'warning', 'Message is too short.');
      if (!NS.validPhone(ph)) return NS.flash(out, 'warning', 'Enter a valid 10-digit Indian mobile number.');
      btn.disabled = true;
      var r = await sb.from('enquiries').insert({
        customer_id: ctx.user.id, shop_id: o.shopId, product_id: o.productId || null,
        message: msg, customer_phone: NS.normPhone(ph)
      });
      btn.disabled = false;
      if (r.error) return NS.flash(out, 'danger', NS.errMsg(r.error));
      NS.flash(out, 'success', t('enquiry_sent'));
      btn.remove();
    });
  };

  NS.openReport = async function (o) {
    var ctx = await needCustomer();
    if (!ctx) return;
    var el = ensureModal('nsRep', t('report') + ' - ' + o.shopName,
      '<div id="nsRepMsg"></div><div class="mb-2"><label class="form-label" for="nsRepReason">' + esc(t('reason')) + '</label>' +
      '<select id="nsRepReason" class="form-select"><option value="wrong_stock">Stock information is wrong</option>' +
      '<option value="wrong_price">Price is wrong</option><option value="fake_shop">Fake or misleading shop</option>' +
      '<option value="wrong_details">Shop details are wrong</option><option value="other">Other</option></select></div>' +
      '<div class="mb-3"><label class="form-label" for="nsRepText">' + esc(t('details')) + '</label>' +
      '<textarea id="nsRepText" class="form-control" rows="3" maxlength="1000"></textarea></div>' +
      '<button class="btn btn-ns" id="nsRepSend">' + esc(t('send')) + '</button>');
    var modal = new bootstrap.Modal(el);
    modal.show();
    document.getElementById('nsRepSend').addEventListener('click', async function () {
      var btn = this, out = document.getElementById('nsRepMsg');
      btn.disabled = true;
      var r = await sb.from('reports').insert({
        reporter_id: ctx.user.id, shop_id: o.shopId, product_id: o.productId || null,
        reason: document.getElementById('nsRepReason').value,
        details: document.getElementById('nsRepText').value.trim() || null
      });
      btn.disabled = false;
      if (r.error) return NS.flash(out, 'danger', NS.errMsg(r.error));
      NS.flash(out, 'success', t('report_sent'));
      btn.remove();
    });
  };

  // Fill <select> with categories
  NS.fillCategorySelect = function (sel, cats, firstKey) {
    var keep = sel.value;
    sel.innerHTML = '<option value="">' + esc(t(firstKey || 'all_categories')) + '</option>' +
      cats.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(NS.catName(c)) + '</option>'; }).join('');
    sel.value = keep;
  };
  NS.fillCitySelect = function (sel) {
    var keep = sel.value;
    sel.innerHTML = '<option value="">' + esc(t('all_cities')) + '</option>' +
      NS.CITIES.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('');
    sel.value = keep;
  };
})();
