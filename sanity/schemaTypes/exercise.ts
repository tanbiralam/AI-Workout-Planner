import {defineField, defineType} from 'sanity'
import {Dumbbell} from 'lucide-react'

export default defineType({
  name: 'exercise',
  title: 'Exercise',
  type: 'document',
  icon: Dumbbell,
  description:
    'A fitness exercise with details like difficulty, video instructions, and more',
  fields: [
    defineField({
      name: 'externalId',
      title: 'External Exercise ID',
      type: 'string',
      description:
        'Stable ID from the Exercise DB API. Used to keep this record in sync with external data.',
    }),
    defineField({
      name: 'name',
      title: 'Exercise Name',
      type: 'string',
      description: 'The name of the exercise (e.g., "Push-ups", "Squats")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description:
        'A detailed description of how to perform the exercise correctly. Optional when sourced from Exercise DB.',
    }),
    defineField({
      name: 'muscleGroup',
      title: 'Primary Muscle Group',
      type: 'string',
      description:
        'Primary muscle group targeted. Useful for manual curation alongside Exercise DB metadata.',
      options: {
        list: [
          {title: 'Chest', value: 'chest'},
          {title: 'Back', value: 'back'},
          {title: 'Shoulders', value: 'shoulders'},
          {title: 'Arms', value: 'arms'},
          {title: 'Legs', value: 'legs'},
          {title: 'Core', value: 'core'},
          {title: 'Full Body', value: 'full body'},
        ],
      },
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      description:
        'The difficulty level of the exercise for proper categorization',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
      },
      initialValue: 'beginner',
    }),
    defineField({
      name: 'image',
      title: 'Exercise Image',
      type: 'image',
      description:
        'An image demonstrating the exercise form or movement. Optional for auto-synced exercises without curated media.',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description:
            'Description of the image for accessibility and SEO purposes',
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description:
        'URL to a video demonstration of the exercise. Optional for auto-synced exercises.',
    }),
    defineField({
      name: 'gifUrl',
      title: 'Exercise GIF URL',
      type: 'url',
      description:
        'Animated GIF sourced from Exercise DB demonstrating the exercise form.',
    }),
    defineField({
      name: 'sourceImageUrl',
      title: 'Source Image URL',
      type: 'url',
      description:
        'Static image URL provided by Exercise DB. Useful if you plan to import the asset into Sanity later.',
    }),
    defineField({
      name: 'bodyParts',
      title: 'Body Parts',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Primary body parts targeted by the exercise.',
    }),
    defineField({
      name: 'targetMuscles',
      title: 'Target Muscles',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Main muscles targeted by the exercise.',
    }),
    defineField({
      name: 'equipments',
      title: 'Equipment',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Equipment required to perform the exercise.',
    }),
    defineField({
      name: 'secondaryMuscles',
      title: 'Secondary Muscles',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Secondary muscles engaged during the exercise.',
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'array',
      of: [{type: 'text'}],
      description: 'Numbered instructions imported from Exercise DB.',
    }),
    defineField({
      name: 'isActive',
      title: 'Active Status',
      type: 'boolean',
      description:
        'Whether this exercise is currently active and should be shown in the app',
      initialValue: true,
    }),
    defineField({
      name: 'autoSynced',
      title: 'Auto Synced',
      type: 'boolean',
      description:
        'Indicates whether this exercise was imported from the Exercise DB API.',
      initialValue: false,
    }),
    defineField({
      name: 'manualOverride',
      title: 'Manual Override',
      type: 'boolean',
      description:
        'When enabled, prevents the sync script from updating this document with data from Exercise DB.',
      initialValue: false,
    }),
    defineField({
      name: 'lastSyncedAt',
      title: 'Last Synced At',
      type: 'datetime',
      description: 'Timestamp of the most recent sync with Exercise DB.',
      readOnly: true,
    }),
  ],
})
