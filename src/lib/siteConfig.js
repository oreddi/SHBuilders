// Single source of truth for SH Builders contact details.
// Update here once and the footer, contact section and Google structured data all change.
//
// Only confirmed facts belong here. The service area comes from SH Builders' own
// property videos and addresses (Mobile, Grand Bay, Theodore, Daphne — Alabama).
// The owner still needs to confirm the office address and phone number.
export const CONTACT = {
  email: 'shbuilderstn@gmail.com',
  // Add the real number when known, e.g. '+1 (251) 000-0000'. Leave empty to hide it everywhere.
  phone: '',
  // Office address: leave empty until the owner confirms it (hidden everywhere while empty)
  streetAddress: '',
  postalCode: '',
  city: 'Mobile',
  region: 'AL',
  serviceArea: 'Mobile & Baldwin County, Alabama',
};

// tel: link value, e.g. '+12510000000'
export const phoneHref = (phone = CONTACT.phone) => `+${phone.replace(/\D/g, '')}`;
