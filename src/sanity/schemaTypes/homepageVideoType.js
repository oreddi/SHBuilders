export const homepageVideoType = {
  name: 'homepageVideo',
  title: 'Homepage Video',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this video',
    },
    {
      name: 'video',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*'
      }
    },
  ],
};
