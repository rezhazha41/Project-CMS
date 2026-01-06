import type { HttpContext } from '@adonisjs/core/http'
import Menu from '#models/menu'

import Post from '#models/post'

export default class MenusController {
    /**
     * Display a list of resource
     */
    async index({ view }: HttpContext) {
        // Fetch all menus ordered by parent_id (null first) and then order
        const menus = await Menu.query().orderBy('order', 'asc')

        // Fetch pages for "Add to Menu" selection
        const pages = await Post.query().where('type', 'page').orderBy('title', 'asc')

        // Build tree structure in memory for the view
        const menuTree = this.buildTree(menus.map(m => m.toJSON()))

        return view.render('pages/admin/menus/index', { menus: menuTree, flatMenus: menus, pages })
    }

    /**
     * Store a newly created resource in storage.
     */
    async store({ request, session, response }: HttpContext) {
        const data = request.only(['label', 'url', 'parent_id', 'target', 'order'])

        await Menu.create({
            label: data.label,
            url: data.url,
            parentId: data.parent_id ? Number(data.parent_id) : null,
            target: data.target || '_self',
            order: data.order ? Number(data.order) : 0,
            isActive: true
        })

        session.flash('success', 'Menu item created successfully')
        return response.redirect().back()
    }

    /**
   * Add selected existing pages to menu
   */
    async addPages({ request, session, response }: HttpContext) {
        const pageIds = request.input('page_ids') // Array of IDs
        const parentId = request.input('parent_id')

        if (!pageIds || !Array.isArray(pageIds)) {
            session.flash('error', 'No pages selected')
            return response.redirect().back()
        }

        const pages = await Post.findMany(pageIds)

        for (const page of pages) {
            await Menu.create({
                label: page.title,
                url: `/pages/${page.slug}`,
                parentId: parentId ? Number(parentId) : null,
                target: '_self',
                order: 99, // Append to end
                isActive: true
            })
        }

        session.flash('success', `${pages.length} pages added to menu`)
        return response.redirect().back()
    }

    /**
     * Quick create page and add to menu
     */
    async quickCreateWithPage({ request, session, response, auth }: HttpContext) {
        const title = request.input('title')
        const parentId = request.input('parent_id')

        if (!title) {
            session.flash('error', 'Page title is required')
            return response.redirect().back()
        }

        // 1. Create Page
        const string = (await import('@adonisjs/core/helpers/string')).default
        const slug = string.slug(title)

        const page = await Post.create({
            title: title,
            slug: slug,
            content: '<h1>' + title + '</h1><p>Content coming soon...</p>',
            type: 'page',
            isPublished: true,
            authorId: auth.user!.id
        })

        // 2. Create Menu Item
        await Menu.create({
            label: page.title,
            url: `/pages/${page.slug}`,
            parentId: parentId ? Number(parentId) : null,
            target: '_self',
            order: 99,
            isActive: true
        })

        session.flash('success', 'Page created and added to menu!')
        return response.redirect().back()
    }

    /**
     * Update resource in storage.
     */
    async update({ params, request, session, response }: HttpContext) {
        const menu = await Menu.findOrFail(params.id)
        const data = request.only(['label', 'url', 'parent_id', 'target', 'order'])

        menu.merge({
            label: data.label,
            url: data.url,
            parentId: data.parent_id ? Number(data.parent_id) : null, // Allow moving to root/child
            target: data.target,
            order: data.order ? Number(data.order) : menu.order
        })

        await menu.save()

        session.flash('success', 'Menu item updated successfully')
        return response.redirect().back()
    }

    /**
     * Delete resource from storage.
     */
    async destroy({ params, session, response }: HttpContext) {
        const menu = await Menu.findOrFail(params.id)
        await menu.delete()

        session.flash('success', 'Menu item deleted successfully')
        return response.redirect().back()
    }

    /**
     * Reorder menus (and update lineage)
     */
    async reorder({ request, response }: HttpContext) {
        const items = request.input('items') // Array of { id, parent_id, order }

        // Use transaction if possible, or just loop updates
        // Simple loop for now
        if (Array.isArray(items)) {
            for (const item of items) {
                const menuItem = await Menu.find(item.id)
                if (menuItem) {
                    menuItem.parentId = item.parent_id ? Number(item.parent_id) : null
                    menuItem.order = Number(item.order)
                    await menuItem.save()
                }
            }
        }

        return response.json({ status: 'success' })
    }

    // Helper to build tree
    private buildTree(items: any[], parentId: number | null = null): any[] {
        return items
            .filter(item => {
                const itemParentId = item.parentId !== undefined ? item.parentId : item.parent_id
                return itemParentId === parentId
            })
            .map(item => ({
                ...item,
                children: this.buildTree(items, item.id)
            }))
    }
}
