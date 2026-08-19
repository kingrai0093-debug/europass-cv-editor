export interface ProfileTemplate {
  id: string;
  category: string;
  title: string;
  summary: string;
  digitalSkills: string[];
  skillsList: string[];
}

export const EXECUTIVE_SUMMARY_TEMPLATES: ProfileTemplate[] = [
  // 1. SECURITY & PROTECTION
  {
    id: 'sec-1',
    category: 'Security & Protection Services',
    title: 'Physical Security Guard / Facility Officer',
    summary: 'Vigilant and SIA-licensed Security Guard with 6+ years of experience protecting commercial premises, operating CCTV monitoring suites, conducting perimeter patrols, and managing visitor access control with calm crisis escalation skills.',
    digitalSkills: ['CCTV Monitoring Systems', 'Access Control Software (Lenel/Honeywell)', 'Incident Reporting Software', 'Radio Communication Protocols', 'MS Office'],
    skillsList: ['Perimeter Security Patrols', 'Surveillance Monitoring', 'Conflict De-escalation', 'First Aid & Emergency Response', 'Access Log Maintenance', 'Crowd Management']
  },
  {
    id: 'sec-2',
    category: 'Security & Protection Services',
    title: 'CCTV Operator / Control Room Specialist',
    summary: 'Attentive CCTV Control Room Operator adept at multi-screen real-time surveillance, tracking suspicious activities, logging incident reports, and coordinating immediate radio response with field security officers.',
    digitalSkills: ['VMS Software (Milestone/Genetec)', 'CCTV Matrix Controllers', 'Digital Video Recorders (DVR/NVR)', 'Incident Logging Databases'],
    skillsList: ['Real-Time Video Surveillance', 'Control Room Operations', 'Incident Triage & Escalation', 'Evidence Preservation', 'Radio Dispatch']
  },
  {
    id: 'sec-3',
    category: 'Security & Protection Services',
    title: 'Security Supervisor / Team Leader',
    summary: 'Proactive Security Supervisor with 8+ years leading security personnel teams, overseeing shift rosters, conducting risk assessments, enforcing SOP compliance, and liaising with law enforcement.',
    digitalSkills: ['Shift Scheduling Software', 'Access Control Admin Systems', 'Digital Incident Reporting', 'MS Office / Excel'],
    skillsList: ['Security Team Leadership', 'Threat & Risk Assessment', 'SOP Enforcement', 'Emergency Response Coordination', 'Client Liaison']
  },

  // 2. HOSPITALITY & CULINARY ARTS
  {
    id: 'hosp-1',
    category: 'Hospitality & Culinary Arts',
    title: 'Executive Chef',
    summary: 'Creative and results-driven Executive Chef with 12+ years directing high-volume fine dining kitchens, menu development, food cost optimization, supplier negotiations, and HACCP compliance.',
    digitalSkills: ['Kitchen Inventory Software (MarketMan)', 'POS Menu Systems (Toast/Lightspeed)', 'MS Excel Costing', 'Recipe Management Apps'],
    skillsList: ['Culinary Leadership & Menu Design', 'HACCP & Food Safety', 'Food Cost & Portion Control', 'Staff Training & Mentorship', 'High-Volume Kitchen Management']
  },
  {
    id: 'hosp-2',
    category: 'Hospitality & Culinary Arts',
    title: 'Sous Chef',
    summary: 'Detail-oriented Sous Chef skilled in kitchen line management, expediting orders during peak services, dish presentation, food prep oversight, and maintaining high hygiene standards.',
    digitalSkills: ['POS Systems', 'Digital Temperature Loggers', 'Inventory Tracking Apps'],
    skillsList: ['Kitchen Line Supervision', 'Food Preparation & Expediting', 'Hygiene & Sanitation', 'Inventory Control', 'Recipe Standardization']
  },
  {
    id: 'hosp-3',
    category: 'Hospitality & Culinary Arts',
    title: 'Commis Chef',
    summary: 'Enthusiastic Commis Chef with strong foundational knife skills, station preparation, mis-en-place organization, and eager support for senior chefs in fast-paced commercial kitchens.',
    digitalSkills: ['Digital Kitchen Order Displays (KDS)', 'Basic Inventory Apps'],
    skillsList: ['Knife Skills & Station Prep', 'Mise en Place', 'Food Hygiene (Level 2)', 'Stock Rotation (FIFO)', 'Team Collaboration']
  },
  {
    id: 'hosp-4',
    category: 'Hospitality & Culinary Arts',
    title: 'Pastry Chef / Baker',
    summary: 'Artisanal Pastry Chef specialized in gourmet desserts, artisanal bread baking, chocolate work, pastry decoration, and specialized allergen-free baking.',
    digitalSkills: ['Digital Bakery Scales', 'Recipe Costing Spreadsheets', 'POS Systems'],
    skillsList: ['Artisanal Baking & Pastry', 'Cake Decoration & Chocolate Work', 'Temperature & Humidity Control', 'Ingredient Sourcing', 'Plated Dessert Presentation']
  },
  {
    id: 'hosp-5',
    category: 'Hospitality & Culinary Arts',
    title: 'Line Cook',
    summary: 'Fast and reliable Line Cook experienced in grilling, sautéing, frying, and plating high volumes of meals to precise recipe specifications under pressure.',
    digitalSkills: ['Kitchen Display Systems (KDS)', 'Ticket Printing Printers'],
    skillsList: ['Multi-Station Cooking', 'Order Timing & Execution', 'Food Quality Inspection', 'Sanitation & Station Cleanliness', 'Working Under Pressure']
  },
  {
    id: 'hosp-6',
    category: 'Hospitality & Culinary Arts',
    title: 'Kitchen Helper / Dishwasher',
    summary: 'Hardworking Kitchen Helper committed to maintaining kitchen hygiene, operating industrial dishwashers, assisting with basic food prep, and unloading deliveries.',
    digitalSkills: ['Basic Equipment Operation Controls'],
    skillsList: ['Dishwashing & Sanitization', 'Basic Vegetable & Food Prep', 'Waste Disposal & Recycling', 'Heavy Lifting & Unloading', 'Kitchen Cleaning Protocols']
  },

  // 3. RESTAURANT & FOOD SERVICE
  {
    id: 'rest-1',
    category: 'Restaurant & Food Service',
    title: 'Restaurant Supervisor / Manager',
    summary: 'Customer-focused Restaurant Supervisor managing daily dining room operations, staff scheduling, guest satisfaction, cash audits, and service excellence.',
    digitalSkills: ['POS Systems (Micros/Toast/Square)', 'OpenTable / Resy Reservation Systems', 'Staff Rostering Software (7shifts)', 'MS Office'],
    skillsList: ['Floor Management & Guest Service', 'Staff Scheduling & Training', 'Cash Handling & Auditing', 'Complaint Resolution', 'Health Code Compliance']
  },
  {
    id: 'rest-2',
    category: 'Restaurant & Food Service',
    title: 'Waiter / Waitress (Food Server)',
    summary: 'Courteous and energetic Food Server skilled in order taking, wine & menu recommendations, table setting, multi-table management, and upselling.',
    digitalSkills: ['Mobile POS Handheld Terminals', 'Reservation Apps', 'Digital Payment Processors'],
    skillsList: ['Table Service & Hospitality', 'Menu Knowledge & Upselling', 'Order Accuracy', 'Tray Carrying & Table Clearing', 'Guest Relations']
  },
  {
    id: 'rest-3',
    category: 'Restaurant & Food Service',
    title: 'Barista',
    summary: 'Passionate Barista adept at espresso extraction, milk texturing, latte art, grinder calibration, and friendly customer service in high-volume coffee shops.',
    digitalSkills: ['Square / Toast POS', 'Digital Coffee Scales & Timers', 'Inventory Order Apps'],
    skillsList: ['Espresso Preparation & Latte Art', 'Coffee Grinder Calibration', 'Customer Service & Speed', 'Cash Handling', 'Beverage Menu Knowledge']
  },
  {
    id: 'rest-4',
    category: 'Restaurant & Food Service',
    title: 'Food Runner / Busser',
    summary: 'Prompt Food Runner ensuring hot food is delivered swiftly to guest tables, assisting waitstaff, resetting tables, and maintaining dining area cleanliness.',
    digitalSkills: ['POS Kitchen Orders Reading', 'Handheld Order Trackers'],
    skillsList: ['Food Delivery & Table Clearing', 'Dining Room Sanitation', 'Fast-Paced Support', 'Table Resetting', 'Team Communication']
  },
  {
    id: 'rest-5',
    category: 'Restaurant & Food Service',
    title: 'House Cook / Private Chef',
    summary: 'Versatile House Cook preparing customized, nutritious meals for private households, managing dietary restrictions, grocery shopping, and kitchen pantry upkeep.',
    digitalSkills: ['Meal Planning Apps', 'Online Grocery Ordering', 'Recipe Scaling Tools'],
    skillsList: ['Custom Meal Preparation', 'Dietary & Allergen Management', 'Grocery Budgeting & Shopping', 'Kitchen Hygiene & Maintenance', 'Private Catering']
  },

  // 4. LOGISTICS, TRANSPORT & DRIVING
  {
    id: 'drv-1',
    category: 'Logistics, Transport & Driving',
    title: 'Light Vehicle Driver / Company Chauffeur',
    summary: 'Safe and punctual Light Vehicle Driver providing passenger transport, executive chauffeur services, vehicle maintenance checks, and city navigation.',
    digitalSkills: ['GPS Navigation (Google Maps/Waze)', 'Ride Dispatch Apps', 'Vehicle Maintenance Logs'],
    skillsList: ['Defensive Driving & Traffic Safety', 'Route Planning & Navigation', 'Passenger Service & Courtesy', 'Vehicle Inspection & Upkeep', 'Punctuality']
  },
  {
    id: 'drv-2',
    category: 'Logistics, Transport & Driving',
    title: 'Heavy Bus Driver / Coach Operator',
    summary: 'Licensed Heavy Bus Driver holding valid passenger CPC endorsements, operating 50+ passenger coaches, managing ticket validation, and ensuring passenger safety.',
    digitalSkills: ['Digital Tachograph Systems', 'Fleet GPS Management', 'Electronic Ticketing Machines'],
    skillsList: ['Heavy Passenger Vehicle Driving', 'Passenger Safety & Comfort', 'Tachograph & Regulations Compliance', 'Emergency Evacuation Protocols', 'Pre-Trip Vehicle Inspections']
  },
  {
    id: 'drv-3',
    category: 'Logistics, Transport & Driving',
    title: 'Forklift Operator / Warehouse Counterbalance',
    summary: 'Certified Forklift Operator experienced in operating Reach Trucks, Counterbalance, and Order Pickers for safe loading/unloading, pallet stacking, and warehouse inventory movement.',
    digitalSkills: ['Barcode Handheld Scanners', 'WMS Software (SAP/Oracle)', 'Digital Inventory Tracking'],
    skillsList: ['Forklift & Heavy Equipment Operation', 'Pallet Stacking & Rack Loading', 'Warehouse Safety (OSHA)', 'Cargo Loading/Unloading', 'Stock Replenishment']
  },
  {
    id: 'drv-4',
    category: 'Logistics, Transport & Driving',
    title: 'Delivery Rider / Bike Courier',
    summary: 'Agile Delivery Rider providing fast and accurate last-mile parcel and food deliveries via motorbike or bicycle across urban zones.',
    digitalSkills: ['Delivery Apps (Deliveroo/UberEats/Courier)', 'GPS Mobile Navigation', 'Digital Proof of Delivery Scanners'],
    skillsList: ['Motorbike & Bicycle Operations', 'City Route Optimization', 'Time Management & Speed', 'Customer Interaction', 'Parcel Care & Handling']
  },
  {
    id: 'drv-5',
    category: 'Logistics, Transport & Driving',
    title: 'Light Truck Driver / Van Delivery',
    summary: 'Reliable Light Truck Driver handling regional parcel distribution, loading cargo safely, managing delivery dockets, and maintaining vehicle cleanliness.',
    digitalSkills: ['Route Optimization Apps', 'Digital Sign-on-Glass POD', 'Fleet Telematics'],
    skillsList: ['3.5T Vehicle Driving', 'Cargo Securing & Strapping', 'Delivery Manifest Verification', 'Customer Service', 'Multi-Drop Delivery']
  },
  {
    id: 'drv-6',
    category: 'Logistics, Transport & Driving',
    title: 'Warehouse Storekeeper / Material Handler',
    summary: 'Organized Warehouse Storekeeper managing goods receipt, stock binning, inventory audits, order picking, packing, and dispatch logistics.',
    digitalSkills: ['WMS Systems', 'Excel Inventory Spreadsheets', 'Barcode Scanners', 'ERP Logistics Modules'],
    skillsList: ['Stock Counting & Inventory Auditing', 'Order Picking & Packing', 'Goods Receipt Inspection', 'Warehouse Logistics', 'Safety Compliance']
  },

  // 5. CLEANING, HOUSEKEEPING & MAINTENANCE
  {
    id: 'clean-1',
    category: 'Cleaning, Housekeeping & Facility Services',
    title: 'Facility Cleaner / Janitor',
    summary: 'Thorough Facility Cleaner operating commercial floor scrubbers, sanitizing office facilities, managing waste streams, and adhering to chemical safety (COSHH).',
    digitalSkills: ['Facility Management Work Order Apps', 'Digital Cleaning Checklists'],
    skillsList: ['Commercial Floor Buffing & Scrubbing', 'Sanitization & Deep Cleaning', 'COSHH Chemical Safety', 'Waste Disposal', 'Attention to Detail']
  },
  {
    id: 'clean-2',
    category: 'Cleaning, Housekeeping & Facility Services',
    title: 'Hotel Housekeeper / Room Attendant',
    summary: 'Detail-oriented Housekeeper experienced in luxury hotel room turnover, bed making, bathroom sanitization, linen replenishment, and guest amenity stocking.',
    digitalSkills: ['Hotel PMS Housekeeping Apps (Opera)', 'Digital Room Status Tracking'],
    skillsList: ['Room Turnover & Bed Making', 'Bathroom Deep Cleaning', 'Linen & Amenities Replenishment', 'Guest Privacy Respect', 'Speed & Efficiency']
  },
  {
    id: 'clean-3',
    category: 'Cleaning, Housekeeping & Facility Services',
    title: 'Laundry Technician / Dry Cleaning Specialist',
    summary: 'Skilled Laundry Technician operating commercial washers, dry cleaning machines, industrial pressers, stain removal treatments, and fabric sorting.',
    digitalSkills: ['Commercial Washer Programmers', 'POS Garment Tagging Systems'],
    skillsList: ['Commercial Washing & Dry Cleaning', 'Fabric Stain Removal', 'Garment Pressing & Ironing', 'Linen Folding & Sorting', 'Chemical Dosing Control']
  },

  // 6. SKILLED TRADES, CONSTRUCTION & ENGINEERING
  {
    id: 'trade-1',
    category: 'Skilled Trades & Construction',
    title: 'Licensed Electrician / Maintenance Wireman',
    summary: 'Certified Electrician proficient in electrical wiring, circuit breakers, conduit installation, fault diagnosis, and safety testing according to wiring regulations.',
    digitalSkills: ['Electrical CAD Drawings', 'Multimeter & Digital Testers', 'Electrical Load Calculators'],
    skillsList: ['Electrical Wiring & Conduit Installation', 'Circuit Breakers & Panel Boards', 'Fault Finding & Testing', 'Blueprint Reading', 'Safety Compliance (18th Edition)']
  },
  {
    id: 'trade-2',
    category: 'Skilled Trades & Construction',
    title: 'Plumber & Pipefitter Specialist',
    summary: 'Licensed Plumber skilled in installing, inspecting, and repairing residential and commercial water supply lines, drainage systems, boilers, and sanitary fixtures.',
    digitalSkills: ['CAD Plumbing Schematics', 'Digital Pressure Testing Software', 'Job Estimation Tools'],
    skillsList: ['Pipe Welding & Soldering', 'Drainage & Sewage Diagnostics', 'Boiler Installation & Repair', 'Hydronic Heating Systems', 'Building Code Compliance']
  },
  {
    id: 'trade-3',
    category: 'Skilled Trades & Construction',
    title: 'Finish Carpenter / Woodworker',
    summary: 'Precision Carpenter adept in cabinetry installation, framing, door fitting, trim woodwork, timber joinery, and power tool operation on construction sites.',
    digitalSkills: ['Digital Angle & Laser Measurers', 'CAD Woodworking Blueprints'],
    skillsList: ['Cabinetry & Trim Carpentry', 'Door & Frame Installation', 'Power Tool Operation', 'Blueprint & Measurement Accuracy', 'Timber Joinery']
  },
  {
    id: 'trade-4',
    category: 'Skilled Trades & Construction',
    title: 'Block Mason / Bricklayer',
    summary: 'Hardworking Mason skilled in laying bricks, concrete blocks, stone paving, mortar mixing, leveling structural walls, and plaster finishing.',
    digitalSkills: ['Laser Leveling Systems', 'Construction Quantity Apps'],
    skillsList: ['Brick & Block Laying', 'Mortar Mixing & Leveling', 'Stone Paving & Plastering', 'Structural Integrity', 'Site Safety']
  },
  {
    id: 'trade-5',
    category: 'Skilled Trades & Construction',
    title: 'Steel Fixer / Rebar Specialist',
    summary: 'Experienced Steel Fixer skilled in reading structural rebar drawings, tying reinforcing steel bars, mesh positioning, and preparing concrete pour frameworks.',
    digitalSkills: ['Rebar Bending Calculators', 'Digital Structural Schematics'],
    skillsList: ['Rebar Tying & Cutting', 'Structural Steel Frameworks', 'Reading Structural Blueprints', 'Concrete Pour Preparation', 'Heavy Lifting Safety']
  },
  {
    id: 'trade-6',
    category: 'Skilled Trades & Construction',
    title: 'Certified Welder (TIG / MIG / SMAW)',
    summary: 'Certified Welder proficient in TIG, MIG, and Arc welding techniques, structural steel fabrication, pipe welding, blueprint reading, and weld quality inspection.',
    digitalSkills: ['Digital Weld Monitors', 'CAD Fabrication Blueprints'],
    skillsList: ['TIG / MIG / Arc Welding', 'Structural Steel Fabrication', 'Pipe & Sheet Metal Welding', 'Weld Inspection & Grinding', 'Metal Cutting & Prep']
  },
  {
    id: 'trade-7',
    category: 'Skilled Trades & Construction',
    title: 'Industrial Pipefitter',
    summary: 'Industrial Pipefitter specialized in assembling, fabricating, maintaining, and testing high-pressure piping systems for industrial and power plants.',
    digitalSkills: ['P&ID Schematics Viewers', 'Digital Flange Torque Tools'],
    skillsList: ['High-Pressure Pipe Assembly', 'Threaded & Flanged Connections', 'Hydrostatic Pressure Testing', 'Isometrics Reading', 'Plant Maintenance']
  },
  {
    id: 'trade-8',
    category: 'Skilled Trades & Construction',
    title: 'Certified Scaffolder',
    summary: 'Safety-conscious Scaffolder qualified in erecting, modifying, and dismantling modular tube-and-clamp scaffolding structures for high-rise building projects.',
    digitalSkills: ['Digital Load Calculators', 'Scaffold Inspection Apps'],
    skillsList: ['Scaffolding Erection & Dismantling', 'Working at Heights Safety', 'Tube & Clamp Structures', 'Rigging & Load Securing', 'Site Safety Inspections']
  },
  {
    id: 'trade-9',
    category: 'Skilled Trades & Construction',
    title: 'HVAC Technician / AC Mechanic',
    summary: 'Skilled HVAC Technician experienced in installing, diagnosing, and servicing commercial chillers, split AC units, ductwork, and heat pumps.',
    digitalSkills: ['Digital Refrigerant Manifold Gauges', 'HVAC Diagnostic Apps', 'Building Management Systems (BMS)'],
    skillsList: ['AC Unit Installation & Repair', 'Refrigerant Recovery & Charging', 'Ductwork & Airflow Balance', 'Electrical Control Troubleshooting', 'Preventive Maintenance']
  },
  {
    id: 'trade-10',
    category: 'Skilled Trades & Construction',
    title: 'General Laborer / Site Hand',
    summary: 'Versatile General Construction Laborer handling site cleanup, material movement, operating hand & power tools, and supporting specialized trade workers.',
    digitalSkills: ['Basic Time Tracking Apps'],
    skillsList: ['Site Clearance & Preparation', 'Material Handling & Loading', 'Power Tool Operation Support', 'Safety Protocol Adherence', 'Physical Stamina']
  },
  {
    id: 'eng-1',
    category: 'Skilled Trades & Construction',
    title: 'Civil Engineer / Site Engineer',
    summary: 'Professional Civil Engineer with 7+ years managing structural site execution, concrete pours, surveying, contractor coordination, and quality assurance.',
    digitalSkills: ['AutoCAD', 'Revit Structure', 'MS Project', 'Total Station Survey Software', 'Civil 3D'],
    skillsList: ['Site Supervision & Execution', 'Structural Design Verification', 'Quality Control & Testing', 'Contractor Management', 'Project Scheduling']
  },
  {
    id: 'eng-2',
    category: 'Skilled Trades & Construction',
    title: 'Construction Project Manager',
    summary: 'Result-driven Project Manager overseeing commercial construction projects from ground-break to handover, controlling budgets, timelines, and safety.',
    digitalSkills: ['Primavera P6', 'MS Project', 'Procore', 'AutoCAD', 'Excel Financial Models'],
    skillsList: ['Project Budgeting & Control', 'Contractor & Sub-contractor Management', 'Schedule Optimization', 'HSE Safety Leadership', 'Stakeholder Communication']
  },
  {
    id: 'eng-3',
    category: 'Skilled Trades & Construction',
    title: 'Site Supervisor / General Foreman',
    summary: 'Proactive Construction Site Supervisor directing daily trade crews, enforcing safety protocols, tracking material deliveries, and ensuring blueprint accuracy.',
    digitalSkills: ['Procore Field Apps', 'Digital Daily Loggers', 'MS Excel'],
    skillsList: ['Trade Crew Supervision', 'Daily Site Logistics', 'Toolbox Talk Safety Meetings', 'Blueprint Inspection', 'Quality Assurance']
  },
  {
    id: 'eng-4',
    category: 'Skilled Trades & Construction',
    title: 'Quantity Surveyor (QS)',
    summary: 'Detail-focused Quantity Surveyor managing construction cost estimation, bill of quantities (BOQ), subcontractor payments, and financial variations.',
    digitalSkills: ['CostX', 'PlanSwift', 'AutoCAD', 'MS Excel Advanced', 'WinQS'],
    skillsList: ['Cost Estimation & Measurement', 'Bill of Quantities (BOQ)', 'Valuation & Variation Analysis', 'Contract Administration', 'Vendor Cost Auditing']
  },

  // 7. OFFICE, ADMINISTRATION & FINANCE
  {
    id: 'admin-1',
    category: 'Office, Administration & Finance',
    title: 'Accountant / Financial Bookkeeper',
    summary: 'Accurate Accountant skilled in financial reporting, general ledger entries, accounts payable/receivable, VAT filings, and bank reconciliations.',
    digitalSkills: ['QuickBooks Online', 'SAP Financials', 'Xero', 'MS Excel (VLOOKUP/Pivot)', 'Tally ERP'],
    skillsList: ['Financial Reporting & GL', 'AP/AR Management', 'VAT & Tax Reconciliations', 'Bank Reconciliation', 'Audit Trail Verification']
  },
  {
    id: 'admin-2',
    category: 'Office, Administration & Finance',
    title: 'Office Administrator / Executive Assistant',
    summary: 'Efficient Office Administrator overseeing executive travel booking, calendar management, document archiving, office supplies, and internal communications.',
    digitalSkills: ['Microsoft 365', 'Google Workspace', 'Zoom / Teams Admin', 'Trello / Asana', 'Expense Management Apps'],
    skillsList: ['Executive Calendar & Travel Planning', 'Office Supply Management', 'Document Archiving & Filing', 'Event Coordination', 'Internal Communication']
  },
  {
    id: 'admin-3',
    category: 'Office, Administration & Finance',
    title: 'Data Entry Clerk / Records Assistant',
    summary: 'Fast and accurate Data Entry Clerk typing 70+ WPM, verifying database records, updating CRM entries, and organizing digital documents.',
    digitalSkills: ['MS Excel / Google Sheets', 'CRM Databases (Salesforce/HubSpot)', 'OCR Scanning Tools', 'Data Validation Tools'],
    skillsList: ['Fast & Accurate Data Entry (70+ WPM)', 'Database Cleaning & Verification', 'Document Digitization', 'Confidentiality', 'File Organization']
  },
  {
    id: 'admin-4',
    category: 'Office, Administration & Finance',
    title: 'Human Resources Assistant / Recruiter',
    summary: 'People-oriented HR Assistant managing employee onboarding, recruitment screening, attendance logs, personnel file compliance, and HR database updates.',
    digitalSkills: ['Workday HRIS', 'BambooHR', 'LinkedIn Recruiter', 'ATS Software (Greenhouse/Lever)', 'MS Office'],
    skillsList: ['Candidate Resume Screening', 'Employee Onboarding & Orientation', 'Personnel Record Maintenance', 'HR Compliance', 'Interview Coordination']
  },
  {
    id: 'admin-5',
    category: 'Office, Administration & Finance',
    title: 'Front Desk Receptionist',
    summary: 'Welcoming Receptionist managing visitor check-ins, multi-line switchboard calls, mail distribution, and maintaining a polished front office lobby.',
    digitalSkills: ['Digital Visitor Badge Apps', 'PBX Phone Systems', 'MS Outlook / Calendar', 'Google Workspace'],
    skillsList: ['Front Desk Greeting & Security Check-in', 'Switchboard Call Routing', 'Mail & Parcel Receipt', 'Administrative Support', 'Professional Etiquette']
  },

  // 8. SALES, CUSTOMER SERVICE & MARKETING
  {
    id: 'sales-1',
    category: 'Sales, Customer Service & Marketing',
    title: 'Customer Service Agent / Support Specialist',
    summary: 'Empathic Customer Service Representative resolving customer inquiries via phone, live chat, and email with high first-contact resolution rates.',
    digitalSkills: ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud', 'LiveChat / Intercom', 'MS Office'],
    skillsList: ['Customer Problem Resolution', 'Call Center Operations', 'Ticket Management', 'Active Listening & Empathy', 'Product Knowledge']
  },
  {
    id: 'sales-2',
    category: 'Sales, Customer Service & Marketing',
    title: 'Retail Sales Associate / Cashier',
    summary: 'Proactive Retail Sales Associate skilled in product demonstrations, POS cash register operations, stock replenishment, and visual merchandising.',
    digitalSkills: ['POS Register Systems (Square/Lightspeed)', 'Barcode Inventory Scanners'],
    skillsList: ['Retail Sales & Customer Assistance', 'Cash Handling & POS Audits', 'Visual Merchandising', 'Inventory Stocking', 'Upselling & Cross-selling']
  },
  {
    id: 'sales-3',
    category: 'Sales, Customer Service & Marketing',
    title: 'Real Estate Agent / Property Consultant',
    summary: 'Results-driven Real Estate Consultant specializing in property valuations, client negotiations, lease agreements, and property marketing.',
    digitalSkills: ['MLS Real Estate Databases', 'CRM Systems', 'Canva Marketing', 'Virtual Tour Software'],
    skillsList: ['Property Listing & Valuations', 'Client Relationship Management', 'Contract & Lease Negotiation', 'Market Trend Analysis', 'Property Showings']
  },
  {
    id: 'sales-4',
    category: 'Sales, Customer Service & Marketing',
    title: 'Digital Marketing Specialist',
    summary: 'Data-informed Digital Marketer skilled in Google Ads, Meta Ads, SEO optimization, email campaign automation, and web analytics.',
    digitalSkills: ['Google Analytics 4', 'Google Ads', 'Meta Ads Manager', 'Mailchimp / Klaviyo', 'SEO Tools (SEMrush/Ahrefs)'],
    skillsList: ['Pay-Per-Click Advertising (PPC)', 'Search Engine Optimization (SEO)', 'Social Media Strategy', 'Email Marketing Automation', 'Campaign ROI Analysis']
  },
  {
    id: 'sales-5',
    category: 'Sales, Customer Service & Marketing',
    title: 'Graphic Designer / Visual Specialist',
    summary: 'Creative Graphic Designer producing brand identity assets, digital marketing banners, print layouts, and UI visual collateral.',
    digitalSkills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Canva Pro'],
    skillsList: ['Brand Identity & Logo Design', 'Print & Digital Layouts', 'Typography & Color Theory', 'UI/UX Visual Assets', 'Client Feedback Integration']
  },

  // 9. IT, SOFTWARE & HEALTHCARE
  {
    id: 'tech-1',
    category: 'IT, Software & Healthcare',
    title: 'IT Support Technician / Helpdesk Specialist',
    summary: 'Responsive IT Support Technician providing Tier 1/2 hardware troubleshooting, OS installations, active directory user management, and network diagnostics.',
    digitalSkills: ['Active Directory', 'Windows 11 / macOS Admin', 'Jira Service Desk', 'AnyDesk / TeamViewer', 'Network Ping/Traceroute Tools'],
    skillsList: ['Hardware & Software Troubleshooting', 'User Account Provisioning', 'Network Connectivity Fixes', 'Remote Desktop Support', 'Helpdesk Ticketing']
  },
  {
    id: 'tech-2',
    category: 'IT, Software & Healthcare',
    title: 'Software Developer (Full Stack / Web)',
    summary: 'Innovative Software Developer building responsive web applications, RESTful APIs, relational databases, and clean modular codebases.',
    digitalSkills: ['JavaScript / TypeScript', 'React / Vue.js', 'Node.js / Express', 'Python / Django', 'PostgreSQL / MongoDB', 'Git / GitHub'],
    skillsList: ['Frontend & Backend Development', 'RESTful API Integration', 'Database Schema Design', 'Code Optimization', 'Agile Teamwork']
  },
  {
    id: 'health-1',
    category: 'IT, Software & Healthcare',
    title: 'Registered Nurse (RN) / Clinical Care',
    summary: 'Compassionate Registered Nurse with 8+ years providing patient triage, medication administration, vital signs monitoring, and care plan execution in hospital wards.',
    digitalSkills: ['Electronic Health Records (Epic / Cerner)', 'Digital Vital Monitors', 'Medication Barcode Scanners'],
    skillsList: ['Patient Assessment & Triage', 'Medication Administration', 'IV Drip Setup & Wound Care', 'Emergency Response (BLS/ACLS)', 'Patient Advocacy']
  },
  {
    id: 'health-2',
    category: 'IT, Software & Healthcare',
    title: 'Pharmacist / Dispensary Specialist',
    summary: 'Licensed Pharmacist experienced in prescription dispensing, drug interaction auditing, patient counseling, and pharmaceutical inventory control.',
    digitalSkills: ['Pharmacy Management Software (PioneerRx/WinRx)', 'Drug Interaction Databases'],
    skillsList: ['Prescription Accuracy & Dispensing', 'Patient Medication Counseling', 'Drug Interaction Auditing', 'Controlled Substance Logs', 'Inventory Management']
  },

  // 10. PERSONAL CARE & SERVICES
  {
    id: 'care-1',
    category: 'Personal Care & Personal Services',
    title: 'Gents Barber / Hairstylist Specialist',
    summary: 'Skilled Gents Barber adept in modern fades, beard trimming, hot towel shaves, scissors cuts, and scalp grooming treatments.',
    digitalSkills: ['Barber Appointment Scheduling Apps (Shedul/Fresha)', 'POS Systems'],
    skillsList: ['Precision Scissor & Clipper Cuts', 'Beard Shaping & Styling', 'Hot Towel Razor Shaves', 'Customer Relations', 'Sanitization of Tools']
  },
  {
    id: 'care-2',
    category: 'Personal Care & Personal Services',
    title: 'Garment Tailor / Alterations Specialist',
    summary: 'Meticulous Garment Tailor skilled in suit alterations, dress fitting, fabric cutting, zipper repairs, and custom garment sewing.',
    digitalSkills: ['Digital Measurement Software', 'Commercial Sewing Machine Controls'],
    skillsList: ['Garment Measurement & Fitting', 'Pattern Cutting & Alterations', 'Industrial Sewing Machine Operation', 'Fabric Selection', 'Attention to Finishing Detail']
  }
];
