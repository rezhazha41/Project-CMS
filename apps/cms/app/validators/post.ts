import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).maxLength(255),
        slug: vine.string().trim().regex(/^[a-z0-9-]+$/),
        content: vine.string().optional(),
        excerpt: vine.string().optional(),
        isPublished: vine.boolean().optional(),
        featuredImage: vine.string().optional(),
        type: vine.enum(['post', 'page', 'agenda', 'teacher']).optional(),
        categoryId: vine.number().optional(),
    })
)

export const updatePostValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).maxLength(255),
        slug: vine.string().trim().regex(/^[a-z0-9-]+$/),
        content: vine.string().optional(),
        excerpt: vine.string().optional(),
        isPublished: vine.boolean().optional(),
        featuredImage: vine.string().optional(),
        type: vine.enum(['post', 'page', 'agenda', 'teacher']).optional(),
        categoryId: vine.number().optional(),
    })
)