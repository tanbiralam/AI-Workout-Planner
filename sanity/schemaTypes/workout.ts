import {defineArrayMember, defineField, defineType} from 'sanity'
import {Dumbbell} from 'lucide-react'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  icon: Dumbbell,
  description: 'A record of a completed workout session with exercises, sets, and duration',
  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({date, duration, exercises = []}) {
      // Convert duration from seconds to minutes for display
      const minutes = Math.floor(duration / 60)
      return {
        title: new Date(date).toLocaleDateString(),
        subtitle: `${minutes} mins • ${exercises.length} exercises`,
      }
    },
  },
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'The Clerk authentication ID of the user who performed this workout',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Workout Date',
      type: 'datetime',
      description: 'The date and time when this workout was performed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Total duration of the workout in seconds',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      description: 'The exercises performed during this workout session with their sets and reps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'exerciseSet',
          title: 'Exercise Set',
          preview: {
            select: {
              exerciseTitle: 'exercise.name',
              sets: 'sets',
            },
            prepare({exerciseTitle, sets = []}) {
              return {
                title: exerciseTitle || 'Unnamed Exercise',
                subtitle: `${sets.length} sets`,
              }
            },
          },
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              type: 'array',
              description: 'List of sets performed for this exercise',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'set',
                  title: 'Set',
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      unit: 'weightUnit',
                    },
                    prepare({reps, weight, unit}) {
                      return {
                        title: `${reps} reps • ${weight}${unit}`,
                      }
                    },
                  },
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Repetitions',
                      type: 'number',
                      description: 'Number of repetitions performed',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      description: 'Amount of weight used',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      description: 'The unit of measurement for the weight',
                      options: {
                        list: [
                          {title: 'Pounds (lbs)', value: 'lbs'},
                          {title: 'Kilograms (kg)', value: 'kg'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
