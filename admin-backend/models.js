const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'translam',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

const Page = sequelize.define('Page', {
  slug: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
});

const Image = sequelize.define('Image', {
  url: DataTypes.STRING,
  alt: DataTypes.STRING,
  pageId: DataTypes.INTEGER,
});

const HomePage = sequelize.define('HomePage', {
  slug: { type: DataTypes.STRING, unique: true },
  heroSections: DataTypes.TEXT, // JSON stringified array
  successStudents: DataTypes.STRING,
  successRate: DataTypes.STRING,
  successQuestions: DataTypes.STRING,
  successExperts: DataTypes.STRING,
  successYears: DataTypes.STRING,
  institutions: DataTypes.TEXT, // JSON stringified array
  recruiters: DataTypes.TEXT, // JSON stringified array
  whyTitle: DataTypes.STRING,
  whyDesc: DataTypes.TEXT,
  placements: DataTypes.TEXT, // JSON stringified array
  toolsTitle: DataTypes.STRING,
  toolsDesc: DataTypes.TEXT,
  exploreCourses: DataTypes.TEXT, // JSON stringified array
  events: DataTypes.TEXT, // JSON stringified array
  testimonials: DataTypes.TEXT, // JSON stringified array
  footerText: DataTypes.TEXT
});

const AboutPage = sequelize.define('AboutPage', {
  slug: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
});

const AdmissionPage = sequelize.define('AdmissionPage', {
  slug: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  bannerImage: DataTypes.TEXT, // Changed to TEXT for large image data
});

const CoursesPage = sequelize.define('CoursesPage', {
  slug: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
});

const EventsPage = sequelize.define('EventsPage', {
  slug: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  bannerImage: DataTypes.TEXT, // Changed to TEXT for large image data
  gallery: DataTypes.TEXT, // JSON stringified array of image paths (for backward compatibility)
  sections: DataTypes.TEXT, // JSON stringified array of sections with images
});

const ContactPage = sequelize.define('ContactPage', {
  slug: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  // Hero Section Fields
  heroLabel: { type: DataTypes.STRING, defaultValue: 'GET STARTED' },
  heroHeading: { type: DataTypes.TEXT, defaultValue: 'Get in touch with us.\nWe\'re here to assist you.' },
  // Contact Information Fields
  contactInfoTitle: { type: DataTypes.STRING, defaultValue: 'Contact Info' },
  contactInfoHeading: { type: DataTypes.TEXT, defaultValue: 'We are always\nhappy to assist you' },
  // Email Information
  emailLabel: { type: DataTypes.STRING, defaultValue: 'Email Address' },
  emailAddress: { type: DataTypes.STRING, defaultValue: 'help@info.com' },
  emailHours: { type: DataTypes.TEXT, defaultValue: 'Assistance hours:\nMonday - Friday 6 am to 8 pm EST' },
  // Phone Information
  phoneLabel: { type: DataTypes.STRING, defaultValue: 'Number' },
  phoneNumber: { type: DataTypes.STRING, defaultValue: '(808) 998-34256' },
  phoneHours: { type: DataTypes.TEXT, defaultValue: 'Assistance hours:\nMonday - Friday 6 am to 8 pm EST' },
  // Social Media Links
  facebookUrl: { type: DataTypes.STRING, defaultValue: '#' },
  instagramUrl: { type: DataTypes.STRING, defaultValue: '#' },
  twitterUrl: { type: DataTypes.STRING, defaultValue: '#' },
  // Banner Image
  bannerImage: { type: DataTypes.TEXT, defaultValue: '/images/commonBanner.png' } // Changed to TEXT for large image data
});

const SmtpSettings = sequelize.define('SmtpSettings', {
  host: { type: DataTypes.STRING, allowNull: false },
  port: { type: DataTypes.INTEGER, defaultValue: 587 },
  secure: { type: DataTypes.BOOLEAN, defaultValue: false },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  fromEmail: { type: DataTypes.STRING, allowNull: false },
  fromName: { type: DataTypes.STRING, defaultValue: 'Translam Institute' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Director Desk Model
const DirectorDesk = sequelize.define('DirectorDesk', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'DIRECTOR DESK' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  mainHeading: { type: DataTypes.STRING, defaultValue: 'Translam Group: Empowering Futures for 37 Glorious Years' },
  content: { type: DataTypes.TEXT, defaultValue: '' },
  staffMembers: { type: DataTypes.TEXT, defaultValue: '[]' } // JSON stringified array
});

// Philosophy Model  
const Philosophy = sequelize.define('Philosophy', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'PHILOSOPHY' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  mainQuote: { type: DataTypes.TEXT, defaultValue: '"Empowerment begins the moment a learner believes they can shape their own future—and education lights that belief."' },
  content: { type: DataTypes.TEXT, defaultValue: '' }
});

// Home Slider Model
const HomeSlider = sequelize.define('HomeSlider', {
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.TEXT, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// About Group Model
const AboutGroup = sequelize.define('AboutGroup', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'ABOUT US' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  buildingImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  aboutUsTitle: { type: DataTypes.STRING, defaultValue: 'About US' },
  aboutUsContent: { type: DataTypes.TEXT, defaultValue: '' },
  visionImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  visionTitle: { type: DataTypes.STRING, defaultValue: 'Vision & Mission' },
  visionContent: { type: DataTypes.TEXT, defaultValue: '' },
  missionContent: { type: DataTypes.TEXT, defaultValue: '' },
  aimsImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  aimsTitle: { type: DataTypes.STRING, defaultValue: 'Aims & Objectives' },
  aimsObjectives: { type: DataTypes.TEXT, defaultValue: '[]' } // JSON stringified array
});

// Outstanding Placements Model
const OutstandingPlacements = sequelize.define('OutstandingPlacements', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'OUTSTANDING PLACEMENTS' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  content: { type: DataTypes.TEXT, defaultValue: '' },
  placements: { type: DataTypes.TEXT('long'), defaultValue: '[]' } // JSON stringified array - using LONGTEXT for large data
});

// Testimonial Model
const Testimonial = sequelize.define('Testimonial', {
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, defaultValue: '' },
  image: { type: DataTypes.STRING, defaultValue: '' },
  content: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 5 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Why Choose Us Model
const WhyChooseUs = sequelize.define('WhyChooseUs', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'WHY CHOOSE US' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  content: { type: DataTypes.TEXT, defaultValue: '' },
  points: { type: DataTypes.TEXT, defaultValue: '[]' } // JSON stringified array
});

// Our Recruiters Model  
const OurRecruiters = sequelize.define('OurRecruiters', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'OUR RECRUITERS' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  content: { type: DataTypes.TEXT, defaultValue: '' },
  recruiters: { type: DataTypes.TEXT, defaultValue: '[]' } // JSON stringified array
});

// Our Institutions Model
const OurInstitutions = sequelize.define('OurInstitutions', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'OUR INSTITUTIONS' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  content: { type: DataTypes.TEXT, defaultValue: '' },
  institutions: { type: DataTypes.TEXT, defaultValue: '[]' } // JSON stringified array
});

// Our Success Model
const OurSuccess = sequelize.define('OurSuccess', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'OUR SUCCESS' },
  heroBannerImage: { type: DataTypes.TEXT, defaultValue: '' }, // Changed to TEXT for large image data
  content: { type: DataTypes.TEXT, defaultValue: '' },
  successStories: { type: DataTypes.TEXT, defaultValue: '[]' } // JSON stringified array
});

// Placement Model
const Placement = sequelize.define('Placement', {
  heroTitle: { type: DataTypes.STRING, defaultValue: 'Placement' },
  heroImage: { type: DataTypes.TEXT }, // Changed to TEXT for large image data
  crcTitle: { type: DataTypes.STRING, defaultValue: 'Corporate Resource Center (CRC)' },
  crcDescription: { type: DataTypes.TEXT },
  crcContent: { type: DataTypes.TEXT },
  trainingTitle: { type: DataTypes.STRING, defaultValue: 'Training and Development' },
  trainingDescription: { type: DataTypes.TEXT },
  trainingFeatures: { type: DataTypes.TEXT('long') }, // JSON stringified array
  students: { type: DataTypes.TEXT('long') } // JSON stringified array
});

// Gallery Model
const Gallery = sequelize.define('Gallery', {
  heroImage: { type: DataTypes.STRING },
  heroTitle: { type: DataTypes.STRING }
});

// Gallery Section Model
const GallerySection = sequelize.define('GallerySection', {
  sectionName: { type: DataTypes.STRING, allowNull: false },
  sectionTitle: { type: DataTypes.STRING },
  galleryId: { type: DataTypes.INTEGER }
});

// Gallery Image Model  
const GalleryImage = sequelize.define('GalleryImage', {
  url: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  sectionId: { type: DataTypes.INTEGER }
});

// Short News Model (for header ticker)
const ShortNews = sequelize.define('ShortNews', {
  title: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Define relationships
Page.hasMany(Image, { foreignKey: 'pageId' });
Image.belongsTo(Page, { foreignKey: 'pageId' });

Gallery.hasMany(GallerySection, { foreignKey: 'galleryId', as: 'sections' });
GallerySection.belongsTo(Gallery, { foreignKey: 'galleryId' });

GallerySection.hasMany(GalleryImage, { foreignKey: 'sectionId', as: 'images' });
GalleryImage.belongsTo(GallerySection, { foreignKey: 'sectionId' });

module.exports = { 
  sequelize, 
  Page, 
  Image, 
  HomePage, 
  AboutPage, 
  AdmissionPage, 
  CoursesPage, 
  EventsPage, 
  ContactPage, 
  SmtpSettings,
  DirectorDesk,
  Philosophy,
  HomeSlider,
  AboutGroup,
  OutstandingPlacements,
  Testimonial,
  WhyChooseUs,
  OurRecruiters,
  OurInstitutions,
  OurSuccess,
  Placement,
  Gallery,
  GallerySection,
  GalleryImage,
  ShortNews
};

// Uncomment for connection test
// sequelize.authenticate()
//   .then(() => console.log('MySQL connection successful'))
//   .catch(err => console.error('MySQL connection error:', err));