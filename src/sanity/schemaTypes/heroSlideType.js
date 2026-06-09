import { defineField, defineType } from 'sanity';

export const heroSlideType = defineType({
  name: 'heroSlide',
  title: 'Hero Slides',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title',
      type: 'string',
      description: 'A label for this slide (e.g. "Custom Build", "Luxury Interior")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the slideshow',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this slide on the homepage',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      order: 'order',
      active: 'active',
    },
    prepare({ title, media, order, active }) {
      return {
        title: `${active ? '🟢' : '🔴'} ${title}`,
        subtitle: `Order: ${order || 'unset'}`,
        media,
      };
    },
  },
});
