import { defineField, defineType } from 'sanity';

export const propertyType = defineType({
  name: 'property',
  title: 'Properties',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Property Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Contemporary', value: 'contemporary' },
          { title: 'Traditional', value: 'traditional' },
          { title: 'Mountain', value: 'mountain' },
          { title: 'Coastal', value: 'coastal' },
          { title: 'Transitional', value: 'transitional' },
          { title: 'Farmhouse', value: 'farmhouse' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'specs',
      title: 'Property Specs',
      type: 'object',
      fields: [
        { name: 'sqft', title: 'Square Feet', type: 'number' },
        { name: 'beds', title: 'Bedrooms', type: 'number' },
        { name: 'baths', title: 'Bathrooms', type: 'number' },
        { name: 'year', title: 'Year Built', type: 'number' },
        { name: 'location', title: 'Location', type: 'string' },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
          { title: 'In-Planning', value: 'planning' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
    }),
  ],
});
