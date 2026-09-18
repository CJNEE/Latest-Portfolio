from django.contrib import admin
from .models import (
    PortfolioUser, Profile, AboutMe, Skill, Project, ProjectMedia,
    Education, Certification, Achievement, Contact, Resume, Analytics
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['profile_id', 'firstname', 'lastname', 'is_public']
    list_filter = ['is_public']


@admin.register(AboutMe)
class AboutMeAdmin(admin.ModelAdmin):
    list_display = ['about_me_id', 'title', 'is_public', 'display_order']
    list_filter = ['is_public']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['skill_id', 'name', 'category', 'year_acquired']
    list_filter = ['category']
    search_fields = ['name', 'category']


class ProjectMediaInline(admin.TabularInline):
    model = ProjectMedia
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['project_id', 'title', 'is_featured', 'display_order']
    list_filter = ['is_featured']
    search_fields = ['title', 'description']
    inlines = [ProjectMediaInline]


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['education_id', 'institution_name', 'degree', 'field_of_study', 'start_date', 'end_date']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['certification_id', 'name', 'issuing_organization', 'issue_date']
    search_fields = ['name', 'issuing_organization']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['achievement_id', 'title', 'category', 'is_featured', 'date_achieved']
    list_filter = ['category', 'is_featured']
    search_fields = ['title']


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['contact_id', 'contact_type', 'contact_value', 'is_public', 'display_order']
    list_filter = ['is_public', 'contact_type']


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['resume_id', 'version_number', 'is_primary', 'last_updated']
    list_filter = ['is_primary']


@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ['analytics_id', 'profile', 'viewers_count', 'visited_time']
    readonly_fields = ['visited_time']
