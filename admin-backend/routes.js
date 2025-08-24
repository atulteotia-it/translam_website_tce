const express = require('express');
const { Page, Image, HomePage, AdmissionPage, CoursesPage, EventsPage, ContactPage, SmtpSettings, DirectorDesk, Philosophy, HomeSlider, AboutGroup, OutstandingPlacements, Testimonial, WhyChooseUs, OurRecruiters, OurInstitutions, OurSuccess, Placement, Gallery, GallerySection, GalleryImage } = require('./models');
const upload = require('./upload.js');
const router = express.Router();

// Get all pages
router.get('/pages', async (req, res) => {
  const pages = await Page.findAll({ include: Image });
  res.json(pages);
});

// Get single page
router.get('/pages/:id', async (req, res) => {
  const page = await Page.findByPk(req.params.id, { include: Image });
  if (!page) return res.status(404).json({ error: 'Not found' });
  res.json(page);
});

// Create page
router.post('/pages', async (req, res) => {
  const page = await Page.create(req.body);
  res.json({ ...page.toJSON(), alert: { type: 'success', message: 'Page created successfully!' } });
});

// Update page
router.put('/pages/:id', async (req, res) => {
  const page = await Page.findByPk(req.params.id);
  if (!page) return res.status(404).json({ error: 'Not found' });
  await page.update(req.body);
  res.json({ ...page.toJSON(), alert: { type: 'success', message: 'Page updated successfully!' } });
});

// Delete page
router.delete('/pages/:id', async (req, res) => {
  const page = await Page.findByPk(req.params.id);
  if (!page) return res.status(404).json({ error: 'Not found' });
  await page.destroy();
  res.json({ success: true });
});

// Add image to page
router.post('/pages/:id/images', async (req, res) => {
  const page = await Page.findByPk(req.params.id);
  if (!page) return res.status(404).json({ error: 'Not found' });
  console.log('Image upload request body:', req.body); // Log request body
  if (!req.body.url) return res.status(400).json({ error: 'Image URL missing' });
  const image = await Image.create({ ...req.body, pageId: page.id });
  console.log('Image created:', image.toJSON()); // Log image creation
  // Return updated page with images
  const updatedPage = await Page.findByPk(page.id, { include: Image });
  res.json(updatedPage);
});

// HomePage CRUD endpoints
// Get all HomePage entries
router.get('/homepage', async (req, res) => {
  const homepages = await HomePage.findAll();
  // Parse JSON fields before sending
  const parsed = homepages.map(hp => ({
    ...hp.toJSON(),
    heroSections: hp.heroSections ? JSON.parse(hp.heroSections) : [],
    institutions: hp.institutions ? JSON.parse(hp.institutions) : [],
    recruiters: hp.recruiters ? JSON.parse(hp.recruiters) : [],
    placements: hp.placements ? JSON.parse(hp.placements) : [],
    exploreCourses: hp.exploreCourses ? JSON.parse(hp.exploreCourses) : [],
    events: hp.events ? JSON.parse(hp.events) : [],
    testimonials: hp.testimonials ? JSON.parse(hp.testimonials) : [],
  }));
  res.json(parsed);
});

// Get single HomePage entry
router.get('/homepage/:id', async (req, res) => {
  const hp = await HomePage.findByPk(req.params.id);
  if (!hp) return res.status(404).json({ error: 'Not found' });
  const parsed = {
    ...hp.toJSON(),
    heroSections: hp.heroSections ? JSON.parse(hp.heroSections) : [],
    institutions: hp.institutions ? JSON.parse(hp.institutions) : [],
    recruiters: hp.recruiters ? JSON.parse(hp.recruiters) : [],
    placements: hp.placements ? JSON.parse(hp.placements) : [],
    exploreCourses: hp.exploreCourses ? JSON.parse(hp.exploreCourses) : [],
    events: hp.events ? JSON.parse(hp.events) : [],
    testimonials: hp.testimonials ? JSON.parse(hp.testimonials) : [],
  };
  res.json(parsed);
});

// Create HomePage entry
router.post('/homepage', async (req, res) => {
  // Stringify JSON fields before saving
  const body = { ...req.body };
  ['heroSections','institutions','recruiters','placements','exploreCourses','events','testimonials'].forEach(f => {
    if (body[f]) body[f] = JSON.stringify(body[f]);
  });
  const hp = await HomePage.create(body);
  res.json({ ...hp.toJSON(), alert: { type: 'success', message: 'HomePage created successfully!' } });
});

// Update HomePage entry
router.put('/homepage/:id', async (req, res) => {
  const hp = await HomePage.findByPk(req.params.id);
  if (!hp) return res.status(404).json({ error: 'Not found' });
  const body = { ...req.body };
  ['heroSections','institutions','recruiters','placements','exploreCourses','events','testimonials'].forEach(f => {
    if (body[f]) body[f] = JSON.stringify(body[f]);
  });
  await hp.update(body);
  res.json({ ...hp.toJSON(), alert: { type: 'success', message: 'HomePage updated successfully!' } });
});

// Delete HomePage entry
router.delete('/homepage/:id', async (req, res) => {
  const hp = await HomePage.findByPk(req.params.id);
  if (!hp) return res.status(404).json({ error: 'Not found' });
  await hp.destroy();
  res.json({ success: true });
});

// HomePage Images CRUD
// Upload image for HomePage
router.post('/homepage/:id/images/upload', upload.single('image'), async (req, res) => {
  const hp = await HomePage.findByPk(req.params.id);
  if (!hp) return res.status(404).json({ error: 'HomePage not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Save image record
  const image = await Image.create({
    url: `/uploads/${req.file.filename}`,
    alt: req.body.alt || '',
    pageId: null // Not linked to Page, but can add homePageId if you want
  });
  res.json(image);
});

// List all images (optionally for HomePage)
router.get('/homepage/:id/images', async (req, res) => {
  const images = await Image.findAll(); // You can filter by homePageId if you add that field
  res.json(images);
});

// Edit image alt text
router.put('/images/:id', async (req, res) => {
  const image = await Image.findByPk(req.params.id);
  if (!image) return res.status(404).json({ error: 'Image not found' });
  await image.update({ alt: req.body.alt });
  res.json(image);
});

// Delete image
router.delete('/images/:id', async (req, res) => {
  const image = await Image.findByPk(req.params.id);
  if (!image) return res.status(404).json({ error: 'Image not found' });
  await image.destroy();
  res.json({ success: true });
});

// Admission Page CRUD endpoints
// Get admission page
router.get('/admission', async (req, res) => {
  try {
    let admission = await AdmissionPage.findOne();
    if (!admission) {
      // Create default admission page if it doesn't exist
      admission = await AdmissionPage.create({
        slug: 'admission',
        title: 'Admission',
        content: '',
        bannerImage: ''
      });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admission page
router.put('/admission', async (req, res) => {
  try {
    let admission = await AdmissionPage.findOne();
    if (!admission) {
      admission = await AdmissionPage.create({
        slug: 'admission',
        ...req.body
      });
    } else {
      await admission.update(req.body);
    }
    const admissionData = admission.toJSON();
    const responseData = {
      ...admissionData,
      alert: { type: 'success', message: 'Admission page updated successfully!' }
    };
    console.log('Sending response with alert:', responseData);
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload banner image for admission page
router.post('/admission/banner', upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    let admission = await AdmissionPage.findOne();
    if (!admission) {
      admission = await AdmissionPage.create({
        slug: 'admission',
        title: 'Admission',
        content: '',
        bannerImage: `/uploads/${req.file.filename}`
      });
    } else {
      await admission.update({ bannerImage: `/uploads/${req.file.filename}` });
    }
    
    res.json({ bannerImage: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact Page CRUD endpoints
// Get contact page
router.get('/contact', async (req, res) => {
  try {
    let contact = await ContactPage.findOne();
    if (!contact) {
      // Create default contact page if it doesn't exist
      contact = await ContactPage.create({
        slug: 'contact',
        title: 'Contact Us',
        content: '',
        heroLabel: 'GET STARTED',
        heroHeading: 'Get in touch with us.\nWe\'re here to assist you.',
        contactInfoTitle: 'Contact Info',
        contactInfoHeading: 'We are always\nhappy to assist you',
        emailLabel: 'Email Address',
        emailAddress: 'help@info.com',
        emailHours: 'Assistance hours:\nMonday - Friday 6 am to 8 pm EST',
        phoneLabel: 'Number',
        phoneNumber: '(808) 998-34256',
        phoneHours: 'Assistance hours:\nMonday - Friday 6 am to 8 pm EST',
        facebookUrl: '#',
        instagramUrl: '#',
        twitterUrl: '#',
        bannerImage: '/images/commonBanner.png'
      });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact page
router.put('/contact', async (req, res) => {
  try {
    let contact = await ContactPage.findOne();
    if (!contact) {
      contact = await ContactPage.create({
        slug: 'contact',
        ...req.body
      });
    } else {
      await contact.update(req.body);
    }
    res.json({ ...contact.toJSON(), alert: { type: 'success', message: 'Contact information updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload banner image for contact page
router.post('/contact/banner', upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    let contact = await ContactPage.findOne();
    if (!contact) {
      contact = await ContactPage.create({
        slug: 'contact',
        title: 'Contact Us',
        content: '',
        bannerImage: `/uploads/${req.file.filename}`
      });
    } else {
      await contact.update({ bannerImage: `/uploads/${req.file.filename}` });
    }
    
    res.json({ bannerImage: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events page
router.get('/events', async (req, res) => {
  try {
    let events = await EventsPage.findOne();
    if (!events) {
      events = await EventsPage.create({
        slug: 'events',
        title: 'Events',
        content: '',
        bannerImage: '/images/commonBanner.png',
        gallery: '[]',
        sections: '[]'
      });
    }
    
    // Transform old gallery data to new sections format if needed
    const eventsData = events.toJSON();
    let sections = [];
    
    if (events.sections) {
      try {
        sections = JSON.parse(events.sections);
      } catch (e) {
        sections = [];
      }
    } else {
      // Handle case where sections column doesn't exist yet
      try {
        await events.update({ sections: '[]' });
      } catch (error) {
        console.log('Sections column not available yet, using empty array');
      }
    }
    
    // If no sections but has gallery, migrate gallery to sections
    if (sections.length === 0 && events.gallery) {
      try {
        const gallery = JSON.parse(events.gallery);
        if (gallery.length > 0) {
          sections = [{
            id: Date.now().toString(),
            sectionName: 'Gallery',
            sectionTitle: 'Event Gallery',
            images: gallery.map((url, index) => ({
              id: (Date.now() + index).toString(),
              url: url,
              title: `Image ${index + 1}`,
              description: ''
            }))
          }];
          // Save the migrated data
          await events.update({ sections: JSON.stringify(sections) });
        }
      } catch (e) {
        console.error('Error migrating gallery to sections:', e);
      }
    }
    
    res.json({
      ...eventsData,
      sections: sections,
      gallery: events.gallery ? JSON.parse(events.gallery) : [] // Keep for backward compatibility
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update events page
router.put('/events', async (req, res) => {
  try {
    let events = await EventsPage.findOne();
    const body = { ...req.body };
    
    // Handle sections data
    if (body.sections) {
      body.sections = JSON.stringify(body.sections);
    }
    
    // Handle gallery data for backward compatibility
    if (body.gallery) {
      body.gallery = JSON.stringify(body.gallery);
    }
    
    if (!events) {
      events = await EventsPage.create({
        slug: 'events',
        ...body,
        gallery: body.gallery || '[]',
        sections: body.sections || '[]'
      });
    } else {
      await events.update(body);
    }
    
    res.json({
      ...events.toJSON(),
      sections: events.sections ? JSON.parse(events.sections) : [],
      gallery: events.gallery ? JSON.parse(events.gallery) : [],
      alert: { type: 'success', message: 'Events page updated successfully!' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload banner image for events page
router.post('/events/banner', upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    let events = await EventsPage.findOne();
    if (!events) {
      events = await EventsPage.create({
        slug: 'events',
        title: 'Events',
        content: '',
        bannerImage: `/uploads/${req.file.filename}`,
        gallery: '[]'
      });
    } else {
      await events.update({ bannerImage: `/uploads/${req.file.filename}` });
    }
    
    res.json({ bannerImage: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload gallery images for events page
router.post('/events/gallery', upload.array('images', 20), async (req, res) => {
  try {
    console.log('Gallery upload request received');
    console.log('Files received:', req.files ? req.files.length : 0);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    let events = await EventsPage.findOne();
    if (!events) {
      events = await EventsPage.create({
        slug: 'events',
        title: 'Events',
        content: '',
        bannerImage: '/images/commonBanner.png',
        gallery: '[]'
      });
    }
    
    const currentGallery = events.gallery ? JSON.parse(events.gallery) : [];
    const newImages = req.files.map(file => `/uploads/${file.filename}`);
    const updatedGallery = [...currentGallery, ...newImages];
    
    console.log('Current gallery:', currentGallery);
    console.log('New images:', newImages);
    console.log('Updated gallery:', updatedGallery);
    
    await events.update({ gallery: JSON.stringify(updatedGallery) });
    
    res.json({ gallery: updatedGallery });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete gallery image for events page
router.delete('/events/gallery/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    let events = await EventsPage.findOne();
    
    if (!events) {
      return res.status(404).json({ error: 'Events page not found' });
    }
    
    const gallery = events.gallery ? JSON.parse(events.gallery) : [];
    
    if (index < 0 || index >= gallery.length) {
      return res.status(400).json({ error: 'Invalid image index' });
    }
    
    gallery.splice(index, 1);
    await events.update({ gallery: JSON.stringify(gallery) });
    
    res.json({ gallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== EVENTS SECTIONS MANAGEMENT ROUTES =====================

// Add new section to events
router.post('/events/sections', async (req, res) => {
  try {
    let events = await EventsPage.findOne();
    if (!events) {
      events = await EventsPage.create({
        slug: 'events',
        title: 'Events',
        content: '',
        bannerImage: '/images/commonBanner.png',
        gallery: '[]',
        sections: '[]'
      });
    }

    const sections = events.sections ? JSON.parse(events.sections) : [];
    const newSection = {
      id: Date.now().toString(),
      sectionName: req.body.sectionName,
      sectionTitle: req.body.sectionTitle || undefined,
      images: []
    };

    sections.push(newSection);
    await events.update({ sections: JSON.stringify(sections) });

    res.json(newSection);
  } catch (error) {
    console.error('Error creating events section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update events section
router.put('/events/sections/:sectionId', async (req, res) => {
  try {
    let events = await EventsPage.findOne();
    if (!events) {
      return res.status(404).json({ error: 'Events page not found' });
    }

    const sections = events.sections ? JSON.parse(events.sections) : [];
    const sectionIndex = sections.findIndex(s => s.id === req.params.sectionId);
    
    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Section not found' });
    }

    sections[sectionIndex] = {
      ...sections[sectionIndex],
      sectionName: req.body.sectionName,
      sectionTitle: req.body.sectionTitle || undefined
    };

    await events.update({ sections: JSON.stringify(sections) });

    res.json(sections[sectionIndex]);
  } catch (error) {
    console.error('Error updating events section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete events section
router.delete('/events/sections/:sectionId', async (req, res) => {
  try {
    let events = await EventsPage.findOne();
    if (!events) {
      return res.status(404).json({ error: 'Events page not found' });
    }

    const sections = events.sections ? JSON.parse(events.sections) : [];
    const filteredSections = sections.filter(s => s.id !== req.params.sectionId);

    await events.update({ sections: JSON.stringify(filteredSections) });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting events section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload images to events section
router.post('/events/images', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const sectionId = req.body.sectionId;
    const title = req.body.title || '';
    const description = req.body.description || '';

    let events = await EventsPage.findOne();
    if (!events) {
      return res.status(404).json({ error: 'Events page not found' });
    }

    const sections = events.sections ? JSON.parse(events.sections) : [];
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Section not found' });
    }

    const newImages = req.files.map(file => ({
      id: (Date.now() + Math.random()).toString(),
      url: `/uploads/${file.filename}`,
      title: title,
      description: description
    }));

    sections[sectionIndex].images = sections[sectionIndex].images || [];
    sections[sectionIndex].images.push(...newImages);

    await events.update({ sections: JSON.stringify(sections) });

    res.json({ images: newImages });
  } catch (error) {
    console.error('Error uploading images to events section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete image from events section
router.delete('/events/images/:imageId', async (req, res) => {
  try {
    let events = await EventsPage.findOne();
    if (!events) {
      return res.status(404).json({ error: 'Events page not found' });
    }

    const sections = events.sections ? JSON.parse(events.sections) : [];
    let imageFound = false;

    for (let section of sections) {
      if (section.images) {
        const originalLength = section.images.length;
        section.images = section.images.filter(img => img.id !== req.params.imageId);
        if (section.images.length < originalLength) {
          imageFound = true;
          break;
        }
      }
    }

    if (!imageFound) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await events.update({ sections: JSON.stringify(sections) });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image from events section:', error);
    res.status(500).json({ error: error.message });
  }
});

// SMTP Settings CRUD endpoints
// Get SMTP settings
router.get('/smtp', async (req, res) => {
  try {
    let smtp = await SmtpSettings.findOne();
    if (!smtp) {
      smtp = await SmtpSettings.create({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        username: '',
        password: '',
        fromEmail: '',
        fromName: 'Translam Institute',
        isActive: false
      });
    }
    res.json(smtp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update SMTP settings
router.put('/smtp', async (req, res) => {
  try {
    let smtp = await SmtpSettings.findOne();
    if (!smtp) {
      smtp = await SmtpSettings.create(req.body);
    } else {
      await smtp.update(req.body);
    }
    res.json({ ...smtp.toJSON(), alert: { type: 'success', message: 'SMTP settings updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test SMTP connection
router.post('/smtp/test', async (req, res) => {
  try {
    const nodemailer = require('nodemailer');
    const { host, port, secure, username, password, fromEmail, fromName } = req.body;
    
    const transporter = nodemailer.createTransporter({
      host,
      port,
      secure,
      auth: {
        user: username,
        pass: password
      }
    });

    await transporter.verify();
    res.json({ success: true, message: 'SMTP connection test successful!' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Director Desk CRUD endpoints
router.get('/director-desk', async (req, res) => {
  try {
    let directorDesk = await DirectorDesk.findOne();
    if (!directorDesk) {
      directorDesk = await DirectorDesk.create({});
    }
    const result = {
      ...directorDesk.toJSON(),
      staffMembers: directorDesk.staffMembers ? JSON.parse(directorDesk.staffMembers) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/director-desk', async (req, res) => {
  try {
    console.log('\n🔄 Director Desk PUT request received');
    console.log('📊 Request body keys:', Object.keys(req.body));
    console.log('📊 Request body sizes:', {
      heroTitle: req.body.heroTitle ? req.body.heroTitle.length : 0,
      heroBannerImage: req.body.heroBannerImage ? req.body.heroBannerImage.length : 0,
      content: req.body.content ? req.body.content.length : 0,
      staffMembers: Array.isArray(req.body.staffMembers) ? req.body.staffMembers.length : 0
    });
    
    let directorDesk = await DirectorDesk.findOne();
    console.log('📋 Existing record found:', !!directorDesk);
    
    const body = { ...req.body };
    if (body.staffMembers) {
      body.staffMembers = JSON.stringify(body.staffMembers);
      console.log('📊 Stringified staffMembers length:', body.staffMembers.length);
    }
    
    console.log('💾 Saving to database...');
    if (!directorDesk) {
      directorDesk = await DirectorDesk.create(body);
      console.log('✅ New record created with ID:', directorDesk.id);
    } else {
      await directorDesk.update(body);
      console.log('✅ Existing record updated, ID:', directorDesk.id);
    }
    
    const result = {
      ...directorDesk.toJSON(),
      staffMembers: directorDesk.staffMembers ? JSON.parse(directorDesk.staffMembers) : []
    };
    
    console.log('📤 Sending response with ID:', result.id);
    res.json({ ...result, alert: { type: 'success', message: 'Director Desk updated successfully!' } });
  } catch (error) {
    console.error('❌ Director Desk PUT error:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({ error: error.message, details: error.toString() });
  }
});

// Philosophy CRUD endpoints
router.get('/philosophy', async (req, res) => {
  try {
    let philosophy = await Philosophy.findOne();
    if (!philosophy) {
      philosophy = await Philosophy.create({});
    }
    res.json(philosophy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/philosophy', async (req, res) => {
  try {
    let philosophy = await Philosophy.findOne();
    if (!philosophy) {
      philosophy = await Philosophy.create(req.body);
    } else {
      await philosophy.update(req.body);
    }
    res.json({ ...philosophy.toJSON(), alert: { type: 'success', message: 'Philosophy updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Home Slider CRUD endpoints
router.get('/home-sliders', async (req, res) => {
  try {
    const sliders = await HomeSlider.findAll({
      order: [['order', 'ASC']]
    });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/home-sliders', async (req, res) => {
  try {
    const slider = await HomeSlider.create(req.body);
    res.json({ ...slider.toJSON(), alert: { type: 'success', message: 'Home slider created successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/home-sliders/:id', async (req, res) => {
  try {
    const slider = await HomeSlider.findByPk(req.params.id);
    if (!slider) return res.status(404).json({ error: 'Slider not found' });
    await slider.update(req.body);
    res.json({ ...slider.toJSON(), alert: { type: 'success', message: 'Home slider updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/home-sliders/:id', async (req, res) => {
  try {
    const slider = await HomeSlider.findByPk(req.params.id);
    if (!slider) return res.status(404).json({ error: 'Slider not found' });
    await slider.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image for home slider
router.post('/home-sliders/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// About Group CRUD endpoints
router.get('/about-group', async (req, res) => {
  try {
    let aboutGroup = await AboutGroup.findOne();
    if (!aboutGroup) {
      aboutGroup = await AboutGroup.create({});
    }
    const result = {
      ...aboutGroup.toJSON(),
      aimsObjectives: aboutGroup.aimsObjectives ? JSON.parse(aboutGroup.aimsObjectives) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/about-group', async (req, res) => {
  try {
    let aboutGroup = await AboutGroup.findOne();
    const body = { ...req.body };
    if (body.aimsObjectives) {
      body.aimsObjectives = JSON.stringify(body.aimsObjectives);
    }
    if (!aboutGroup) {
      aboutGroup = await AboutGroup.create(body);
    } else {
      await aboutGroup.update(body);
    }
    const result = {
      ...aboutGroup.toJSON(),
      aimsObjectives: aboutGroup.aimsObjectives ? JSON.parse(aboutGroup.aimsObjectives) : []
    };
    res.json({ ...result, alert: { type: 'success', message: 'About Group updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Outstanding Placements CRUD endpoints
router.get('/outstanding-placements', async (req, res) => {
  try {
    let placements = await OutstandingPlacements.findOne();
    if (!placements) {
      placements = await OutstandingPlacements.create({});
    }
    const result = {
      ...placements.toJSON(),
      placements: placements.placements ? JSON.parse(placements.placements) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image for outstanding placements
router.post('/outstanding-placements/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/outstanding-placements', async (req, res) => {
  try {
    let placements = await OutstandingPlacements.findOne();
    const body = { ...req.body };
    if (body.placements) {
      body.placements = JSON.stringify(body.placements);
    }
    if (!placements) {
      placements = await OutstandingPlacements.create(body);
    } else {
      await placements.update(body);
    }
    const result = {
      ...placements.toJSON(),
      placements: placements.placements ? JSON.parse(placements.placements) : []
    };
    res.json({ ...result, alert: { type: 'success', message: 'Outstanding Placements updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Testimonials CRUD endpoints
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.json({ ...testimonial.toJSON(), alert: { type: 'success', message: 'Testimonial created successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    await testimonial.update(req.body);
    res.json({ ...testimonial.toJSON(), alert: { type: 'success', message: 'Testimonial updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    await testimonial.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image for testimonials
router.post('/testimonials/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Why Choose Us CRUD endpoints
router.get('/why-choose-us', async (req, res) => {
  try {
    let whyChooseUs = await WhyChooseUs.findOne();
    if (!whyChooseUs) {
      whyChooseUs = await WhyChooseUs.create({});
    }
    const result = {
      ...whyChooseUs.toJSON(),
      points: whyChooseUs.points ? JSON.parse(whyChooseUs.points) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/why-choose-us', async (req, res) => {
  try {
    let whyChooseUs = await WhyChooseUs.findOne();
    const body = { ...req.body };
    if (body.points) {
      body.points = JSON.stringify(body.points);
    }
    if (!whyChooseUs) {
      whyChooseUs = await WhyChooseUs.create(body);
    } else {
      await whyChooseUs.update(body);
    }
    const result = {
      ...whyChooseUs.toJSON(),
      points: whyChooseUs.points ? JSON.parse(whyChooseUs.points) : []
    };
    res.json({ ...result, alert: { type: 'success', message: 'Why Choose Us updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Our Recruiters CRUD endpoints
router.get('/our-recruiters', async (req, res) => {
  try {
    let recruiters = await OurRecruiters.findOne();
    if (!recruiters) {
      recruiters = await OurRecruiters.create({});
    }
    const result = {
      ...recruiters.toJSON(),
      recruiters: recruiters.recruiters ? JSON.parse(recruiters.recruiters) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/our-recruiters', async (req, res) => {
  try {
    let recruiters = await OurRecruiters.findOne();
    const body = { ...req.body };
    if (body.recruiters) {
      body.recruiters = JSON.stringify(body.recruiters);
    }
    if (!recruiters) {
      recruiters = await OurRecruiters.create(body);
    } else {
      await recruiters.update(body);
    }
    const result = {
      ...recruiters.toJSON(),
      recruiters: recruiters.recruiters ? JSON.parse(recruiters.recruiters) : []
    };
    res.json({ ...result, alert: { type: 'success', message: 'Our Recruiters updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Our Institutions CRUD endpoints
router.get('/our-institutions', async (req, res) => {
  try {
    let institutions = await OurInstitutions.findOne();
    if (!institutions) {
      institutions = await OurInstitutions.create({});
    }
    const result = {
      ...institutions.toJSON(),
      institutions: institutions.institutions ? JSON.parse(institutions.institutions) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/our-institutions', async (req, res) => {
  try {
    let institutions = await OurInstitutions.findOne();
    const body = { ...req.body };
    if (body.institutions) {
      body.institutions = JSON.stringify(body.institutions);
    }
    if (!institutions) {
      institutions = await OurInstitutions.create(body);
    } else {
      await institutions.update(body);
    }
    const result = {
      ...institutions.toJSON(),
      institutions: institutions.institutions ? JSON.parse(institutions.institutions) : []
    };
    res.json({ ...result, alert: { type: 'success', message: 'Our Institutions updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Our Success CRUD endpoints
router.get('/our-success', async (req, res) => {
  try {
    let success = await OurSuccess.findOne();
    if (!success) {
      success = await OurSuccess.create({});
    }
    const result = {
      ...success.toJSON(),
      successStories: success.successStories ? JSON.parse(success.successStories) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/our-success', async (req, res) => {
  try {
    let success = await OurSuccess.findOne();
    const body = { ...req.body };
    if (body.successStories) {
      body.successStories = JSON.stringify(body.successStories);
    }
    if (!success) {
      success = await OurSuccess.create(body);
    } else {
      await success.update(body);
    }
    const result = {
      ...success.toJSON(),
      successStories: success.successStories ? JSON.parse(success.successStories) : []
    };
    res.json({ ...result, alert: { type: 'success', message: 'Our Success updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Placement API endpoints
// Get placement data
router.get('/placement', async (req, res) => {
  try {
    let placement = await Placement.findOne();
    if (!placement) {
      // Create default placement data if it doesn't exist
      placement = await Placement.create({});
    }
    const result = {
      ...placement.toJSON(),
      trainingFeatures: placement.trainingFeatures ? JSON.parse(placement.trainingFeatures) : [],
      students: placement.students ? JSON.parse(placement.students) : []
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update placement data
router.put('/placement', async (req, res) => {
  try {
    let placement = await Placement.findOne();
    const body = { ...req.body };
    
    // Stringify JSON fields before saving
    if (body.trainingFeatures) {
      body.trainingFeatures = JSON.stringify(body.trainingFeatures);
    }
    if (body.students) {
      body.students = JSON.stringify(body.students);
    }
    
    if (!placement) {
      placement = await Placement.create(body);
    } else {
      await placement.update(body);
    }
    
    // Return parsed data
    const result = {
      ...placement.toJSON(),
      trainingFeatures: placement.trainingFeatures ? JSON.parse(placement.trainingFeatures) : [],
      students: placement.students ? JSON.parse(placement.students) : []
    };
    res.json({ ...result, alert: { type: 'success', message: 'Placement data updated successfully!' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image for placement
router.post('/placement/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schema update endpoint for fixing image column sizes
router.post('/update-schema', async (req, res) => {
  try {
    console.log('🔧 Schema update requested...');
    const { updateImageColumns } = require('./update-image-columns');
    const result = await updateImageColumns(false); // Don't close connection
    res.json({ 
      success: true, 
      message: 'Database schema updated successfully. Image columns are now TEXT type.',
      details: result
    });
  } catch (error) {
    console.error('Schema update error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ===================== GALLERY MANAGEMENT ROUTES =====================

// Get gallery data with sections and images
router.get('/gallery', async (req, res) => {
  try {
    let gallery = await Gallery.findOne({
      include: [{
        model: GallerySection,
        as: 'sections',
        include: [{
          model: GalleryImage,
          as: 'images'
        }]
      }]
    });

    if (!gallery) {
      // Create default gallery if none exists
      gallery = await Gallery.create({
        heroImage: '',
        heroTitle: 'Gallery'
      });
    }

    res.json({
      heroImage: gallery.heroImage,
      heroTitle: gallery.heroTitle,
      sections: gallery.sections || []
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload hero image
router.post('/gallery/hero', upload.single('heroImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let gallery = await Gallery.findOne();
    if (!gallery) {
      gallery = await Gallery.create({
        heroImage: '',
        heroTitle: 'Gallery'
      });
    }

    const heroImage = `/uploads/${req.file.filename}`;
    await gallery.update({ heroImage });

    res.json({ heroImage });
  } catch (error) {
    console.error('Error uploading hero image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update hero title
router.put('/gallery/hero-title', async (req, res) => {
  try {
    let gallery = await Gallery.findOne();
    if (!gallery) {
      gallery = await Gallery.create({
        heroImage: '',
        heroTitle: req.body.heroTitle
      });
    } else {
      await gallery.update({ heroTitle: req.body.heroTitle });
    }

    res.json({ heroTitle: gallery.heroTitle });
  } catch (error) {
    console.error('Error updating hero title:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new section
router.post('/gallery/sections', async (req, res) => {
  try {
    let gallery = await Gallery.findOne();
    if (!gallery) {
      gallery = await Gallery.create({
        heroImage: '',
        heroTitle: 'Gallery'
      });
    }

    const section = await GallerySection.create({
      sectionName: req.body.sectionName,
      sectionTitle: req.body.sectionTitle,
      galleryId: gallery.id
    });

    res.json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update section
router.put('/gallery/sections/:sectionId', async (req, res) => {
  try {
    const section = await GallerySection.findByPk(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    await section.update({
      sectionName: req.body.sectionName,
      sectionTitle: req.body.sectionTitle
    });

    res.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete section
router.delete('/gallery/sections/:sectionId', async (req, res) => {
  try {
    const section = await GallerySection.findByPk(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Delete all images in this section first
    await GalleryImage.destroy({ where: { sectionId: req.params.sectionId } });
    
    // Delete the section
    await section.destroy();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload images to section
router.post('/gallery/images', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const sectionId = req.body.sectionId;
    const title = req.body.title;
    const description = req.body.description;

    const images = [];
    for (const file of req.files) {
      const image = await GalleryImage.create({
        url: `/uploads/${file.filename}`,
        title: title,
        description: description,
        sectionId: sectionId
      });
      images.push(image);
    }

    res.json({ images });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete image
router.delete('/gallery/images/:imageId', async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await image.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
