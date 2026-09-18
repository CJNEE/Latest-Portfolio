from rest_framework import serializers
from .models import (
    Profile, AboutMe, Skill, Project, ProjectMedia,
    Education, Certification, Achievement, Contact, Resume, Analytics
)


class ProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['profile_id', 'firstname', 'lastname', 'middlename', 'bio', 'full_name']

    def get_full_name(self, obj):
        parts = filter(None, [obj.firstname, obj.middlename, obj.lastname])
        return ' '.join(parts)


class AboutMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMe
        fields = ['about_me_id', 'title', 'content', 'last_updated', 'display_order']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['skill_id', 'name', 'category', 'year_acquired', 'certification']


class ProjectMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMedia
        fields = ['project_media_id', 'media_url', 'display_order']


class ProjectSerializer(serializers.ModelSerializer):
    media = ProjectMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['project_id', 'title', 'description', 'demo_url', 'github_url', 'is_featured', 'display_order', 'media']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['education_id', 'institution_name', 'degree', 'field_of_study', 'start_date', 'end_date', 'grade_gpa']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['certification_id', 'name', 'issuing_organization', 'issue_date', 'expiration_date', 'credential_id', 'credential_url']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['achievement_id', 'title', 'description', 'date_achieved', 'category', 'link_url', 'is_featured']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['contact_id', 'contact_type', 'contact_value', 'icon_name', 'display_order']


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['resume_id', 'file_url', 'version_number', 'is_primary', 'description', 'last_updated']
