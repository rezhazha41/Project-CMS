import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')

const PublicsController = () => import('#controllers/publics_controller')

// Public Routes
router.get('/', [PublicsController, 'home'])
router.get('/blog', [PublicsController, 'blog'])
router.get('/agenda', [PublicsController, 'agenda'])
router.get('/teachers', [PublicsController, 'teachers'])
router.get('/blog/:slug', [PublicsController, 'show'])
router.get('/pages/:slug', [PublicsController, 'page']) // Public pages
router.get('/ppdb', [PublicsController, 'ppdb']) // PPDB page

// Comments
const CommentsController = () => import('#controllers/comments_controller')
router.post('/comments', [CommentsController, 'store'])

// Auth Routes
router.get('/login', [AuthController, 'showLogin']).use(middleware.guest())
router.post('/login', [AuthController, 'store']).as('auth_login_store').use(middleware.guest())
router.get('/logout', [AuthController, 'logout']).use(middleware.auth())

// Admin Routes (Protected)
router.group(() => {
    const DashboardController = () => import('#controllers/admin/dashboard_controller')
    router.get('/', [DashboardController, 'index']).as('admin_dashboard_index')
    router.post('/quick-draft', [DashboardController, 'quickDraft']).as('admin_dashboard_quick_draft')

    // Global Search
    const SearchController = () => import('#controllers/admin/search_controller')
    router.get('/search', [SearchController, 'index']).as('admin_search_index')

    // Posts
    const PostsController = () => import('#controllers/admin/posts_controller')
    router.get('/posts', [PostsController, 'index']).as('admin_posts_index')
    router.get('/posts/create', [PostsController, 'create']).as('admin_posts_create')
    router.post('/posts', [PostsController, 'store']).as('admin_posts_store')
    router.get('/posts/:id/edit', [PostsController, 'edit']).as('admin_posts_edit')
    router.put('/posts/:id', [PostsController, 'update']).as('admin_posts_update')
    router.delete('/posts/:id', [PostsController, 'destroy']).as('admin_posts_destroy')

    // Pages
    const PagesController = () => import('#controllers/admin/pages_controller')
    router.get('/pages', [PagesController, 'index']).as('admin_pages_index')
    router.get('/pages/create', [PagesController, 'create']).as('admin_pages_create')
    router.post('/pages', [PagesController, 'store']).as('admin_pages_store')
    router.get('/pages/:id/edit', [PagesController, 'edit']).as('admin_pages_edit')
    router.put('/pages/:id', [PagesController, 'update']).as('admin_pages_update')
    router.delete('/pages/:id', [PagesController, 'destroy']).as('admin_pages_destroy')

    // Media
    const MediaController = () => import('#controllers/admin/media_controller')
    router.get('/media', [MediaController, 'index']).as('admin_media_index')
    router.post('/media/upload', [MediaController, 'upload']).as('admin_media_upload')
    router.delete('/media/:id', [MediaController, 'destroy']).as('admin_media_destroy')

    // Users
    const UsersController = () => import('#controllers/admin/users_controller')
    router.group(() => {
        router.get('/users', [UsersController, 'index']).as('admin_users_index')
        router.get('/users/create', [UsersController, 'create']).as('admin_users_create')
        router.post('/users', [UsersController, 'store']).as('admin_users_store')
        router.get('/users/:id/edit', [UsersController, 'edit']).as('admin_users_edit')
        router.put('/users/:id', [UsersController, 'update']).as('admin_users_update')
        router.delete('/users/:id', [UsersController, 'destroy']).as('admin_users_destroy')
    }).use(middleware.adminOnly())

    // Hero Settings (Separate page to avoid duplication issues)
    // Hero Settings (Separate page to avoid duplication issues)
    const HeroSettingsController = () => import('#controllers/admin/hero_settings_controller')
    router.group(() => {
        router.get('/hero-settings', [HeroSettingsController, 'index']).as('admin_hero_settings_index')
        router.post('/hero-settings', [HeroSettingsController, 'update']).as('admin_hero_settings_update')
    }).use(middleware.adminOnly())

    // Settings
    // Settings
    const SettingsController = () => import('#controllers/admin/settings_controller')
    router.group(() => {
        router.get('/settings', [SettingsController, 'index']).as('admin_settings_index')
        router.post('/settings', [SettingsController, 'update']).as('admin_settings_update')
    }).use(middleware.adminOnly())

    // Teachers
    const TeachersController = () => import('#controllers/admin/teachers_controller')
    router.group(() => {
        router.get('/teachers', [TeachersController, 'index']).as('admin_teachers_index')
        router.get('/teachers/create', [TeachersController, 'create']).as('admin_teachers_create')
        router.post('/teachers', [TeachersController, 'store']).as('admin_teachers_store')
        router.get('/teachers/:id/edit', [TeachersController, 'edit']).as('admin_teachers_edit')
        router.put('/teachers/:id', [TeachersController, 'update']).as('admin_teachers_update')
        router.delete('/teachers/:id', [TeachersController, 'destroy']).as('admin_teachers_destroy')
    }).use(middleware.adminOnly())

    // Departments (Jurusan)
    const DepartmentsController = () => import('#controllers/admin/departments_controller')
    router.group(() => {
        router.get('/departments', [DepartmentsController, 'index']).as('admin_departments_index')
        router.get('/departments/create', [DepartmentsController, 'create']).as('admin_departments_create')
        router.post('/departments', [DepartmentsController, 'store']).as('admin_departments_store')
        router.get('/departments/:id/edit', [DepartmentsController, 'edit']).as('admin_departments_edit')
        router.put('/departments/:id', [DepartmentsController, 'update']).as('admin_departments_update')
        router.delete('/departments/:id', [DepartmentsController, 'destroy']).as('admin_departments_destroy')
    }).use(middleware.adminOnly())

    // Announcements
    const AnnouncementsController = () => import('#controllers/admin/announcements_controller')
    router.group(() => {
        router.get('/announcements', [AnnouncementsController, 'index']).as('admin_announcements_index')
        router.get('/announcements/create', [AnnouncementsController, 'create']).as('admin_announcements_create')
        router.post('/announcements', [AnnouncementsController, 'store']).as('admin_announcements_store')
        router.get('/announcements/:id/edit', [AnnouncementsController, 'edit']).as('admin_announcements_edit')
        router.put('/announcements/:id', [AnnouncementsController, 'update']).as('admin_announcements_update')
        router.delete('/announcements/:id', [AnnouncementsController, 'destroy']).as('admin_announcements_destroy')
        router.post('/announcements/:id/toggle', [AnnouncementsController, 'toggleActive']).as('admin_announcements_toggle')
    }).use(middleware.adminOnly())

    // Activities
    const ActivitiesController = () => import('#controllers/admin/activities_controller')
    router.group(() => {
        router.get('/activities', [ActivitiesController, 'index']).as('admin_activities_index')
        router.get('/activities/create', [ActivitiesController, 'create']).as('admin_activities_create')
        router.post('/activities', [ActivitiesController, 'store']).as('admin_activities_store')
        router.get('/activities/:id/edit', [ActivitiesController, 'edit']).as('admin_activities_edit')
        router.put('/activities/:id', [ActivitiesController, 'update']).as('admin_activities_update')
        router.delete('/activities/:id', [ActivitiesController, 'destroy']).as('admin_activities_destroy')
    }).use(middleware.adminOnly())

    // Agendas (New Feature)
    const AgendasController = () => import('#controllers/admin/agendas_controller')
    router.group(() => {
        router.get('/agendas', [AgendasController, 'index']).as('admin_agendas_index')
        router.get('/agendas/create', [AgendasController, 'create']).as('admin_agendas_create')
        router.post('/agendas', [AgendasController, 'store']).as('admin_agendas_store')
        router.get('/agendas/:id/edit', [AgendasController, 'edit']).as('admin_agendas_edit')
        router.put('/agendas/:id', [AgendasController, 'update']).as('admin_agendas_update')
        router.delete('/agendas/:id', [AgendasController, 'destroy']).as('admin_agendas_destroy')
    }).use(middleware.adminOnly())

    // Comments Management
    const AdminCommentsController = () => import('#controllers/admin/comments_controller')
    router.get('/comments', [AdminCommentsController, 'index']).as('admin_comments_index')
    router.post('/comments/:id/approve', [AdminCommentsController, 'toggleApproval']).as('admin_comments_approve')
    router.delete('/comments/:id', [AdminCommentsController, 'destroy']).as('admin_comments_destroy')

    // Menus
    const MenusController = () => import('#controllers/admin/menus_controller')
    router.get('/menus', [MenusController, 'index']).as('admin_menus_index')
    router.post('/menus', [MenusController, 'store']).as('admin_menus_store')
    router.post('/menus/add-pages', [MenusController, 'addPages']).as('admin_menus_add_pages')
    router.post('/menus/quick-create', [MenusController, 'quickCreateWithPage']).as('admin_menus_quick_create')
    router.post('/menus/reorder', [MenusController, 'reorder']).as('admin_menus_reorder')
    router.put('/menus/:id', [MenusController, 'update']).as('admin_menus_update')
    router.delete('/menus/:id', [MenusController, 'destroy']).as('admin_menus_destroy')

}).prefix('/admin').use([middleware.auth(), middleware.loadNotifications()])

// Catch-all for custom slugs (must be last)
router.get('/:slug', [PublicsController, 'customPage'])
