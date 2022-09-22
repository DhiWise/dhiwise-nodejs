/* eslint-disable no-template-curly-in-string */
import { DATABASE_TYPE } from '../../../../../constant/Project/applicationStep';

export const LibraryModelData = {
  [DATABASE_TYPE.MONGODB]: [
    {
      _id: '611e1e50b9fee44a6a19400b',
      name: 'Blog',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        title: {
          type: 'String',
          description: 'Title of blog post',
        },
        alternativeHeadline: {
          type: 'String',
          description: 'Alternative  headline of blog post',
        },
        image: {
          type: 'String',
          description: 'Image of blog',
        },
        publishDate: {
          type: 'String',
          description: 'Publish date of blog',
        },
        author: {
          name: {
            type: 'String',
            description: 'Name of author',
          },
          image: {
            type: 'String',
            description: 'Picture of author',
          },
          email: {
            type: 'String',
            description: 'Email of author',
          },
        },
        publisher: {
          name: {
            type: 'String',
            description: 'Name of publisher',
          },
          url: {
            type: 'String',
          },
          logo: {
            type: 'String',
          },
        },
        articleSection: {
          type: 'String',
        },
        articleBody: {
          type: 'String',
          description: 'Blog artical that you want to display',
        },
        description: {
          type: 'String',
        },
        slug: {
          type: 'String',
          description: 'Uniq slug',
        },
        url: {
          type: 'String',
        },
        isDraft: {
          type: 'Boolean',
        },
        isDeleted: {
          type: 'Boolean',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
      hooks: [
        {
          code: "// 'this' refers to the current document about to be saved\nconst record = this;\n// create slug using title\nlet slug = record.title.toLowerCase();\nslug = slug.replace(/\\s+/g,\"-\")\n// Replace and then store it\nrecord.slug = slug;",
          operation: 'save',
          type: 'pre',
        },
      ],
      modelIndexes: [
        {
          name: 'index_title_publishdate',
          indexFields: {
            title: 1,
            publishDate: -1,
          },
          options: {
            unique: true,
          },
        },
        {
          name: 'index_title',
          indexFields: {
            title: 1,
          },
        },
        {
          name: 'index_publishdate',
          indexFields: {
            publishDate: -1,
          },
        },
      ],
    },
    {
      _id: '611e1e50b9fee44a6a19400c',
      name: 'Master',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'string',
        },
        slug: {
          type: 'string',
        },
        code: {
          type: 'string',
        },
        group: {
          type: 'string',
          description: 'Group name in which group you want to consider master',
        },
        description: {
          type: 'string',
        },
        sequence: {
          type: 'Number',
        },
        image: {
          type: 'string',
        },
        parentId: {
          type: 'ObjectId',
          ref: 'Master',
        },
        parentCode: {
          type: 'Boolean',
        },
        isDefault: {
          type: 'Boolean',
          default: false,
        },
        isDeleted: {
          type: 'Boolean',
          default: false,
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
      hooks: [
        {
          code: " // 'this' refers to the current document about to be saved\n  const record = this;\n  // create slug using code\n  const slug = record.code.toLowerCase();\n  // Replace and then store it\n  record.slug = slug;",
          operation: 'save',
          type: 'pre',
        },
      ],
    },
    {
      _id: '611e1e50b9fee44a6a19400d',
      name: 'Event',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'string',
          description: 'Name of event',
        },
        description: {
          type: 'string',
        },
        address: {
          line1: {
            type: 'string',
          },
          line2: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          pincode: {
            type: 'string',
          },
          lat: {
            type: 'Number',
            description: 'latitude of location',
          },
          lng: {
            type: 'Number',
            description: 'longitude  of location',
          },
        },
        startDateTime: {
          type: 'Date',
          description: 'Start date event',
        },
        endDateTime: {
          type: 'Date',
          description: 'End date event',
        },
        speakers: [
          {
            name: {
              type: 'string',
            },
            image: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
          },
        ],
        organizer: {
          name: {
            type: 'string',
          },
          image: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
        },
        image: {
          type: 'string',
        },
        attachments: {
          type: 'Array',
          decription: 'Event attachemnt',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
      modelIndexes: [
        {
          name: 'index_name',
          indexFields: {
            name: 1,
          },
          options: {
            unique: true,
          },
        },
      ],
    },
    {
      _id: '611e1e50b9fee44a6a19400e',
      name: 'Appointment_slot',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        startTime: {
          type: 'Date',
          required: true,
          description: 'slot start time',
        },
        endTime: {
          type: 'Date',
          required: true,
          description: 'slot end time',
        },
        offset: {
          type: 'Number',
          description: 'add offset to mange timezone',
        },
        appliedFrom: {
          type: 'Date',
          description: 'from when this slot it available',
        },
        appliedTo: {
          type: 'Date',
          description: 'to  which date this slot it available',
        },
        userId: {
          type: 'ObjectId',
          ref: 'user',
          description: 'for  user wise slot ',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
      modelIndexes: [
        {
          name: 'index_startTime',
          indexFields: {
            startTime: -1,
          },
        },
      ],
    },
    {
      _id: '611e1e50b9fee44a6a19400f',
      name: 'Appointment_schedule',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        slot: {
          type: 'ObjectId',
          ref: 'Appointment_slot',
          description: 'reference of slot module',
        },
        startTime: {
          type: 'Date',
          required: true,
          description: 'start time of schedule',
        },
        endTime: {
          type: 'Date',
          required: true,
          description: 'end time of schedule',
        },
        date: {
          type: 'Date',
          required: true,
          description: 'Date of schedule',
        },
        offset: {
          type: 'Number',
          description: 'add offset to mange timezone',
        },
        participant: {
          type: 'Array',
          description: 'number of user who paricipant in booked appoinment',
        },
        host: {
          type: 'ObjectId',
          ref: 'user',
          description: 'host of appoinment who manage the requested schedule',
        },
        isCancelled: {
          type: 'Boolean',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
    },
    {
      _id: '611e1e50b9fee44a6a194010',
      name: 'ToDo',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'String',
        },
        description: {
          type: 'String',
        },
        date: {
          type: 'Date',
        },
        dueDate: {
          type: 'Date',
        },
        isCompleted: {
          type: 'Boolean',
        },
        settings: {
          type: 'JSON',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
      modelIndexes: [
        {
          name: 'index_date',
          indexFields: {
            date: -1,
          },
        },
        {
          name: 'index_dueDate',
          indexFields: {
            dueDate: -1,
          },
        },
      ],
    },
    {
      _id: '611e1e50b9fee44a6a194011',
      name: 'Chat_group',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'String',
          required: true,
        },
        code: {
          type: 'String',
          required: true,
        },
        admin: {
          type: 'String',
          required: true,
        },
        member: {
          type: 'Array',
          description: 'Array of memberid',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
    },
    {
      _id: '611e1e50b9fee44a6a194012',
      name: 'Chat_message',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        message: {
          type: 'String',
          required: true,
        },
        sender: {
          type: 'String',
          required: true,
          description: 'Sender id of message',
        },
        recipient: {
          type: 'String',
          required: true,
          description: 'Recipient id of message',
        },
        groupId: {
          type: 'ObjectId',
          ref: 'Chat_group',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
    },
    {
      _id: '611e1e50b9fee44a6a194013',
      name: 'Comment',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        comment: {
          type: 'String',
        },
        upvoteCount: {
          type: 'Number',
        },
        downVoteCount: {
          type: 'Number',
        },
        commentTime: {
          type: 'Date',
        },
        parentItem: {
          type: 'ObjectId',
          ref: 'Comment',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
    },
    {
      _id: '611e1e50b9fee44a6a194014',
      name: 'Plan',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'String',
        },
        decription: {
          type: 'String',
        },
        code: {
          type: 'String',
        },
        validityInDays: {
          type: 'String',
        },
        minimumUser: {
          type: 'Number',
        },
        maximumUser: {
          type: 'Number',
        },
        perUserAmount: {
          type: 'Number',
        },
        markup: {
          type: 'Number',
        },
        discount: {
          type: 'Number',
        },
        validFrom: {
          type: 'Date',
        },
        validTo: {
          type: 'Date',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
    },
    {
      _id: '611e1e50b9fee44a6a194015',
      name: 'Task',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        title: {
          type: 'String',
        },
        description: {
          type: 'String',
        },
        attachments: {
          type: 'Array',
        },
        status: {
          type: 'Number',
        },
        date: {
          type: 'Date',
        },
        dueDate: {
          type: 'Date',
        },
        completedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        completedAt: {
          type: 'Date',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
    },
    {
      _id: '611e1e50b9fee44a6a194016',
      name: 'Customer',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        firstName: {
          type: 'String',
        },
        lastName: {
          type: 'String',
        },
        name: {
          type: 'String',
        },
        profile: {
          type: 'String',
        },
        contactNumber: {
          type: 'String',
        },
        email: {
          type: 'String',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date ',
        },
        updatedAt: {
          type: 'Date',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
      modelIndexes: [
        {
          name: 'index_firstName_lastName',
          indexFields: {
            firstName: 1,
            lastName: 1,
          },
        },
        {
          name: 'index_firstName',
          indexFields: {
            firstName: 1,
          },
        },
        {
          name: 'index_lastName',
          indexFields: {
            firstName: 1,
          },
        },
      ],
      hooks: [
        {
          // eslint-disable-next-line no-template-curly-in-string
          code: " // 'this' refers to the current document about to be saved\n  const user = this;\n\n  user.name = `${user.firstName}, ${user.lastName}`;\n  ",
          operation: 'save',
          type: 'pre',
        },
        {
          // eslint-disable-next-line no-template-curly-in-string
          code: " // 'this' refers to the current document about to be saved\n  const user = this;\n\n  user.name = `${user.firstName}, ${user.lastName}`;\n  ",
          operation: 'save',
          type: 'post',
        },
      ],
    },
    {
      _id: '6124c4837e7d38eaf76492a1',
      name: 'user',
      ormType: 1,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        firstName: {
          type: 'String',
        },
        lastName: {
          type: 'String',
        },
        name: {
          type: 'String',
        },
        username: {
          type: 'String',
        },
        password: {
          type: 'String',
        },
        email: {
          type: 'String',
        },
        isActive: {
          type: 'Boolean',
        },
        createdAt: {
          type: 'Date',
        },
        updatedAt: {
          type: 'Date',
        },
        updatedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
        addedBy: {
          type: 'ObjectId',
          ref: 'user',
        },
      },
    },
  ],
  SQL_TYPES: [
    {
      _id: '611e4001b9fee44a6a194032',
      name: 'Blog',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        title: {
          type: 'STRING',
          description: 'Title of blog post',
        },
        alternativeHeadline: {
          type: 'STRING',
          description: 'Alternative  headline of blog post',
        },
        image: {
          type: 'STRING',
          description: 'Image of blog',
        },
        publishDate: {
          type: 'STRING',
          description: 'Publish date of blog',
        },
        authorName: {
          type: 'STRING',
          description: 'Name of author',
        },
        authorImage: {
          type: 'STRING',
          description: 'Picture of author',
        },
        authorEmail: {
          type: 'STRING',
          description: 'Email of author',
        },
        publisherName: {
          type: 'STRING',
        },
        publisherUrl: {
          type: 'STRING',
        },
        publisherLogo: {
          type: 'STRING',
        },
        keywords: {
          type: 'STRING',
          description: 'Keywords for blog',
        },
        articleSection: {
          type: 'STRING',
        },
        articleBody: {
          type: 'STRING',
          description: 'Blog artical that you want to display',
        },
        description: {
          type: 'STRING',
        },
        slug: {
          type: 'STRING',
          description: 'Uniq slug',
        },
        url: {
          type: 'STRING',
        },
        isDraft: {
          type: 'BOOLEAN',
        },
        isDeleted: {
          type: 'BOOLEAN',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
      modelIndexes: [
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '613714331eae3ead86dbad12',
          name: 'index_title_publishdate',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'title',
              order: 'ASC',
              length: 10,
              operator: '',
              value: '',
            },
            {
              attribute: 'publishDate',
              order: 'DESC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '61371479a83136aa782f201b',
          name: 'index_title',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'title',
              order: 'ASC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '613714b10f40ef68ba3c6b32',
          name: 'index_publishdate',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'publishDate',
              order: 'DESC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
      ],
    },
    {
      _id: '611e4001b9fee44a6a194033',
      name: 'Master',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'STRING',
        },
        slug: {
          type: 'STRING',
        },
        code: {
          type: 'STRING',
        },
        group: {
          type: 'STRING',
          description: 'Group name in which group you want to consider master',
        },
        description: {
          type: 'STRING',
        },
        sequence: {
          type: 'INTEGER',
        },
        image: {
          type: 'STRING',
        },
        parentId: {
          type: 'INTEGER',
          ref: 'Master',
          refAttribute: 'id',
        },
        parentCode: {
          type: 'BOOLEAN',
        },
        isDefault: {
          type: 'BOOLEAN',
          default: false,
        },
        isDeleted: {
          type: 'BOOLEAN',
          default: false,
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
    {
      _id: '611e4001b9fee44a6a194034',
      name: 'Event',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'STRING',
          description: 'name of event',
        },
        description: {
          type: 'STRING',
        },
        address_line1: {
          type: 'STRING',
        },
        address_line2: {
          type: 'STRING',
        },
        address_city: {
          type: 'STRING',
        },
        address_country: {
          type: 'STRING',
        },
        address_state: {
          type: 'STRING',
        },
        address_pincode: {
          type: 'STRING',
        },
        address_lat: {
          type: 'INTEGER',
          description: 'latitude of location',
        },
        address_lng: {
          type: 'INTEGER',
          description: 'longitude  of location',
        },
        startDateTime: {
          type: 'DATE',
          description: 'start Date event',
        },
        endDateTime: {
          type: 'DATE',
          description: 'end Date event',
        },
        speakers_name: {
          type: 'STRING',
        },
        speakers_image: {
          type: 'STRING',
        },
        speakers_email: {
          type: 'STRING',
        },
        organizer_name: {
          type: 'STRING',
        },
        organizer_image: {
          type: 'STRING',
        },
        organizer_email: {
          type: 'STRING',
        },
        organizer_url: {
          type: 'STRING',
        },
        image: {
          type: 'STRING',
        },
        attachments: {
          type: 'STRING',
          decription: 'Event attachemnt',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
      modelIndexes: [
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '61370f828b76c71cf8040dc8',
          name: 'index_name',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'name',
              order: 'ASC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
      ],
    },
    {
      _id: '611e4001b9fee44a6a194035',
      name: 'Appointment_slot',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        startTime: {
          type: 'DATE',
          description: 'slot start time',
        },
        endTime: {
          type: 'DATE',
          description: 'slot end time',
        },
        offset: {
          type: 'INTEGER',
          description: 'add offset to mange timezone',
        },
        appliedFrom: {
          type: 'DATE',
          description: 'from when this slot it available',
        },
        appliedTo: {
          type: 'DATE',
          description: 'to which date this slot it available',
        },
        userId: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
          description: 'for user wise slot',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
      modelIndexes: [
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '61370990623bff3277a0c7fc',
          name: 'index_startTime',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'startTime',
              order: 'DESC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
      ],
    },
    {
      _id: '611e4001b9fee44a6a194036',
      name: 'Appointment_schedule',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        slot: {
          type: 'INTEGER',
          ref: 'Appointment_slot',
          refAttribute: 'id',
          description: 'reference of slot module',
        },
        startTime: {
          type: 'DATE',
          description: 'start time of schedule',
        },
        endTime: {
          type: 'DATE',
          description: 'end time of schedule',
        },
        date: {
          type: 'DATE',
          description: 'date of schedule',
        },
        offset: {
          type: 'INTEGER',
          description: 'add offset to mange timezone',
        },
        participant: {
          type: 'STRING',
          description: 'paricipant in booked appoinment',
        },
        host: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
          description: 'host of appoinment who manage the requested schedule',
        },
        isCancelled: {
          type: 'BOOLEAN',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
    {
      _id: '611e4001b9fee44a6a194037',
      name: 'ToDo',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'STRING',
        },
        description: {
          type: 'STRING',
        },
        date: {
          type: 'DATE',
        },
        dueDate: {
          type: 'DATE',
        },
        isCompleted: {
          type: 'BOOLEAN',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
      modelIndexes: [
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '613708fa5bf5759565bb892d',
          name: 'index_date',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'date',
              order: 'DESC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '61370900debe284f456278e8',
          name: 'index_dueDate',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'dueDate',
              order: 'DESC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
      ],
    },
    {
      _id: '611e4001b9fee44a6a194038',
      name: 'Chat_group',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'STRING',
          required: true,
        },
        code: {
          type: 'STRING',
          required: true,
        },
        member: {
          type: 'STRING',
        },
        admin: {
          type: 'STRING',
          required: true,
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
    {
      _id: '611e4001b9fee44a6a194039',
      name: 'Chat_message',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        message: {
          type: 'STRING',
          required: true,
        },
        sender: {
          type: 'STRING',
          required: true,
        },
        recipient: {
          type: 'STRING',
          required: true,
        },
        groupId: {
          type: 'INTEGER',
          ref: 'Chat_group',
          refAttribute: 'id',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
    {
      _id: '611e4001b9fee44a6a19403a',
      name: 'Comment',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        comment: {
          type: 'STRING',
        },
        upvoteCount: {
          type: 'INTEGER',
        },
        downVoteCount: {
          type: 'INTEGER',
        },
        commentTime: {
          type: 'DATE',
        },
        parentItem: {
          type: 'INTEGER',
          ref: 'Comment',
          refAttribute: 'id',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
    {
      _id: '611e4001b9fee44a6a19403b',
      name: 'Plan',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        name: {
          type: 'STRING',
        },
        decription: {
          type: 'STRING',
        },
        code: {
          type: 'STRING',
        },
        validityInDays: {
          type: 'STRING',
        },
        minimumUser: {
          type: 'INTEGER',
        },
        maximumUser: {
          type: 'INTEGER',
        },
        perUserAmount: {
          type: 'INTEGER',
        },
        markup: {
          type: 'INTEGER',
        },
        discount: {
          type: 'INTEGER',
        },
        validFrom: {
          type: 'DATE',
        },
        validTo: {
          type: 'DATE',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
    {
      _id: '611e4001b9fee44a6a19403c',
      name: 'Task',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        title: {
          type: 'STRING',
        },
        description: {
          type: 'STRING',
        },
        attachments: {
          type: 'STRING',
        },
        status: {
          type: 'INTEGER',
        },
        date: {
          type: 'DATE',
        },
        dueDate: {
          type: 'DATE',
        },
        completedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        completedAt: {
          type: 'DATE',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
    {
      _id: '611e4001b9fee44a6a19403d',
      name: 'Customer',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        firstName: {
          type: 'STRING',
        },
        lastName: {
          type: 'STRING',
        },
        profile: {
          type: 'STRING',
        },
        contactNumber: {
          type: 'STRING',
        },
        email: {
          type: 'STRING',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
      hooks: [
        {
          code: 'user.name = `${user.firstName}, ${user.lastName}`;',
          operation: 'save',
          type: 'pre',
        },
      ],
      modelIndexes: [
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '6137045c0cceab001bced43f',
          name: 'index_firstName_lastName',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'firstName',
              order: 'ASC',
              length: 10,
              operator: '',
              value: '',
            },
            {
              attribute: 'lastName',
              order: 'ASC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '6137076a1766ad45ac715c17',
          name: 'index_firstName',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'firstName',
              order: 'ASC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
        {
          isParserRequired: false,
          isDefault: false,
          fields: [],
          _id: '613707765d0031d4a45ae3f1',
          name: 'index_lastName',
          indexType: 'BTREE',
          indexFields: [
            {
              attribute: 'lastName',
              order: 'ASC',
              length: 10,
              operator: '',
              value: '',
            },
          ],
        },
      ],
    },
    {
      _id: '6124c4837e7d38eaf76492a2',
      name: 'user',
      ormType: 2,
      isActive: true,
      isDeleted: false,
      schemaJson: {
        firstName: {
          type: 'STRING',
        },
        lastName: {
          type: 'STRING',
        },
        name: {
          type: 'STRING',
        },
        username: {
          type: 'STRING',
        },
        password: {
          type: 'STRING',
        },
        email: {
          type: 'STRING',
        },
        isActive: {
          type: 'BOOLEAN',
        },
        createdAt: {
          type: 'DATE',
        },
        updatedAt: {
          type: 'DATE',
        },
        updatedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
        addedBy: {
          type: 'INTEGER',
          ref: 'user',
          refAttribute: 'id',
        },
      },
    },
  ],
};
