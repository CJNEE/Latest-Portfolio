from django.urls import path
from . import views
from . import auth_views
from . import owner_views

urlpatterns = [
    # Public Read API
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('aboutme/', views.AboutMeView.as_view(), name='aboutme'),
    path('skills/', views.SkillsView.as_view(), name='skills'),
    path('projects/', views.ProjectsView.as_view(), name='projects'),
    path('education/', views.EducationView.as_view(), name='education'),
    path('certifications/', views.CertificationsView.as_view(), name='certifications'),
    path('achievements/', views.AchievementsView.as_view(), name='achievements'),
    path('contact/', views.ContactView.as_view(), name='contact'),
    path('resume/', views.ResumeView.as_view(), name='resume'),
    path('analytics/track/', views.AnalyticsTrackView.as_view(), name='analytics-track'),

    # Secret Auth Endpoints
    path('auth/login/', auth_views.LoginView.as_view(), name='auth-login'),
    path('auth/me/', auth_views.MeView.as_view(), name='auth-me'),
    path('auth/forgot-password/', auth_views.ForgotPasswordView.as_view(), name='auth-forgot-password'),
    path('auth/verify-reset-code/', auth_views.VerifyResetCodeView.as_view(), name='auth-verify-reset-code'),
    path('auth/reset-password/', auth_views.ResetPasswordView.as_view(), name='auth-reset-password'),

    # Owner CMS Endpoints
    path('owner/profile/', owner_views.OwnerProfileView.as_view(), name='owner-profile'),
    path('owner/aboutme/', owner_views.OwnerAboutMeView.as_view(), name='owner-aboutme-list'),
    path('owner/aboutme/<int:pk>/', owner_views.OwnerAboutMeView.as_view(), name='owner-aboutme-detail'),
    path('owner/skills/', owner_views.OwnerSkillView.as_view(), name='owner-skills-list'),
    path('owner/skills/<int:pk>/', owner_views.OwnerSkillView.as_view(), name='owner-skills-detail'),
    path('owner/projects/', owner_views.OwnerProjectView.as_view(), name='owner-projects-list'),
    path('owner/projects/<int:pk>/', owner_views.OwnerProjectView.as_view(), name='owner-projects-detail'),
    path('owner/education/', owner_views.OwnerEducationView.as_view(), name='owner-education-list'),
    path('owner/education/<int:pk>/', owner_views.OwnerEducationView.as_view(), name='owner-education-detail'),
    path('owner/certifications/', owner_views.OwnerCertificationView.as_view(), name='owner-certifications-list'),
    path('owner/certifications/<int:pk>/', owner_views.OwnerCertificationView.as_view(), name='owner-certifications-detail'),
    path('owner/achievements/', owner_views.OwnerAchievementView.as_view(), name='owner-achievements-list'),
    path('owner/achievements/<int:pk>/', owner_views.OwnerAchievementView.as_view(), name='owner-achievements-detail'),
    path('owner/contact/', owner_views.OwnerContactView.as_view(), name='owner-contact-list'),
    path('owner/contact/<int:pk>/', owner_views.OwnerContactView.as_view(), name='owner-contact-detail'),
    path('owner/resume/', owner_views.OwnerResumeView.as_view(), name='owner-resume'),
]
