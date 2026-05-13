import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schema } from './src/sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'SH Builders Admin',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/admin',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schema.types,
  },
});
