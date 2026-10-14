// Single source of truth for SH Builders contact details.
// Update here once and the footer, contact section and Google structured data all change.
export const CONTACT = {
  email: 'shbuilderstn@gmail.com',
  // Add the real number when known, e.g. '+1 (423) 000-0000'. Leave empty to hide it everywhere.
  phone: '',
  streetAddress: 'P.O. Box 4084',
  city: 'Chattanooga',
  region: 'TN',
  postalCode: '37405',
};

// tel: link value, e.g. '+14230000000'
export const phoneHref = (phone = CONTACT.phone) => `+${phone.replace(/\D/g, '')}`;
