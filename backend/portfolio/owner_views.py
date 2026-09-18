from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .auth_views import get_user_from_request
from .models import (
    Profile, AboutMe, Skill, Project, ProjectMedia,
    Education, Certification, Achievement, Contact, Resume
)
from .serializers import (
    ProfileSerializer, AboutMeSerializer, SkillSerializer, ProjectSerializer,
    EducationSerializer, CertificationSerializer, AchievementSerializer,
    ContactSerializer, ResumeSerializer
)


def require_owner(request):
    user = get_user_from_request(request)
    if not user:
        return None, Response({'detail': 'Authentication credentials were not provided or invalid.'}, status=status.HTTP_401_UNAUTHORIZED)
    # Check if role is Owner or Developer
    if user.role not in ['Owner', 'Developer']:
        return None, Response({'detail': 'Permission denied. Only Owner or Developer can perform this action.'}, status=status.HTTP_403_FORBIDDEN)
    profile = Profile.objects.filter(user=user).first() or Profile.objects.first()
    return profile, None


# --- PROFILE ---
class OwnerProfileView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
        profile, err = require_owner(request)
        if err: return err

        data = request.data
        if 'firstname' in data: profile.firstname = data['firstname']
        if 'lastname' in data: profile.lastname = data['lastname']
        if 'middlename' in data: profile.middlename = data['middlename']
        if 'bio' in data: profile.bio = data['bio']
        profile.save()

        return Response(ProfileSerializer(profile).data)


# --- ABOUT ME ---
class OwnerAboutMeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile, err = require_owner(request)
        if err: return err

        title = request.data.get('title', '')
        content = request.data.get('content', '')
        order = request.data.get('display_order', 0)

        entry = AboutMe.objects.create(
            profile=profile,
            title=title,
            content=content,
            display_order=order,
            is_public=True
        )
        return Response(AboutMeSerializer(entry).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        entry = get_object_or_404(AboutMe, pk=pk, profile=profile)
        if 'title' in request.data: entry.title = request.data['title']
        if 'content' in request.data: entry.content = request.data['content']
        if 'display_order' in request.data: entry.display_order = request.data['display_order']
        entry.save()
        return Response(AboutMeSerializer(entry).data)

    def delete(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        entry = get_object_or_404(AboutMe, pk=pk, profile=profile)
        entry.delete()
        return Response({'deleted': True}, status=status.HTTP_200_OK)


# --- SKILLS ---
class OwnerSkillView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile, err = require_owner(request)
        if err: return err

        skill = Skill.objects.create(
            profile=profile,
            name=request.data.get('name', ''),
            category=request.data.get('category', 'Frontend'),
            year_acquired=request.data.get('year_acquired'),
            certification=request.data.get('certification', '')
        )
        return Response(SkillSerializer(skill).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        skill = get_object_or_404(Skill, pk=pk, profile=profile)
        if 'name' in request.data: skill.name = request.data['name']
        if 'category' in request.data: skill.category = request.data['category']
        if 'year_acquired' in request.data: skill.year_acquired = request.data['year_acquired']
        if 'certification' in request.data: skill.certification = request.data['certification']
        skill.save()
        return Response(SkillSerializer(skill).data)

    def delete(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        skill = get_object_or_404(Skill, pk=pk, profile=profile)
        skill.delete()
        return Response({'deleted': True}, status=status.HTTP_200_OK)


# --- PROJECTS ---
class OwnerProjectView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile, err = require_owner(request)
        if err: return err

        project = Project.objects.create(
            profile=profile,
            title=request.data.get('title', 'New Project'),
            description=request.data.get('description', ''),
            demo_url=request.data.get('demo_url', ''),
            github_url=request.data.get('github_url', ''),
            is_featured=request.data.get('is_featured', False),
            display_order=request.data.get('display_order', 0)
        )

        media_url = request.data.get('media_url', '').strip()
        if media_url:
            ProjectMedia.objects.create(
                project=project,
                media_url=media_url,
                display_order=0
            )

        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        project = get_object_or_404(Project, pk=pk, profile=profile)
        if 'title' in request.data: project.title = request.data['title']
        if 'description' in request.data: project.description = request.data['description']
        if 'demo_url' in request.data: project.demo_url = request.data['demo_url']
        if 'github_url' in request.data: project.github_url = request.data['github_url']
        if 'is_featured' in request.data: project.is_featured = bool(request.data['is_featured'])
        if 'display_order' in request.data: project.display_order = request.data['display_order']
        project.save()

        # Update or create media if provided
        media_url = request.data.get('media_url', None)
        if media_url is not None:
            media = project.media.first()
            if media:
                media.media_url = media_url
                media.save()
            elif media_url.strip():
                ProjectMedia.objects.create(project=project, media_url=media_url, display_order=0)

        return Response(ProjectSerializer(project).data)

    def delete(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        project = get_object_or_404(Project, pk=pk, profile=profile)
        project.delete()
        return Response({'deleted': True}, status=status.HTTP_200_OK)


# --- EDUCATION ---
class OwnerEducationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile, err = require_owner(request)
        if err: return err

        edu = Education.objects.create(
            profile=profile,
            institution_name=request.data.get('institution_name', ''),
            degree=request.data.get('degree', ''),
            field_of_study=request.data.get('field_of_study', ''),
            start_date=request.data.get('start_date') or None,
            end_date=request.data.get('end_date') or None,
            grade_gpa=request.data.get('grade_gpa', '')
        )
        return Response(EducationSerializer(edu).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        edu = get_object_or_404(Education, pk=pk, profile=profile)
        for field in ['institution_name', 'degree', 'field_of_study', 'start_date', 'end_date', 'grade_gpa']:
            if field in request.data:
                val = request.data[field]
                if field in ['start_date', 'end_date'] and not val:
                    val = None
                setattr(edu, field, val)
        edu.save()
        return Response(EducationSerializer(edu).data)

    def delete(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        edu = get_object_or_404(Education, pk=pk, profile=profile)
        edu.delete()
        return Response({'deleted': True}, status=status.HTTP_200_OK)


# --- CERTIFICATIONS ---
class OwnerCertificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile, err = require_owner(request)
        if err: return err

        cert = Certification.objects.create(
            profile=profile,
            name=request.data.get('name', ''),
            issuing_organization=request.data.get('issuing_organization', ''),
            issue_date=request.data.get('issue_date') or None,
            expiration_date=request.data.get('expiration_date') or None,
            credential_id=request.data.get('credential_id', ''),
            credential_url=request.data.get('credential_url', '')
        )
        return Response(CertificationSerializer(cert).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        cert = get_object_or_404(Certification, pk=pk, profile=profile)
        for field in ['name', 'issuing_organization', 'issue_date', 'expiration_date', 'credential_id', 'credential_url']:
            if field in request.data:
                val = request.data[field]
                if field in ['issue_date', 'expiration_date'] and not val:
                    val = None
                setattr(cert, field, val)
        cert.save()
        return Response(CertificationSerializer(cert).data)

    def delete(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        cert = get_object_or_404(Certification, pk=pk, profile=profile)
        cert.delete()
        return Response({'deleted': True}, status=status.HTTP_200_OK)


# --- ACHIEVEMENTS ---
class OwnerAchievementView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile, err = require_owner(request)
        if err: return err

        ach = Achievement.objects.create(
            profile=profile,
            title=request.data.get('title', ''),
            description=request.data.get('description', ''),
            date_achieved=request.data.get('date_achieved') or None,
            category=request.data.get('category', 'Recognition'),
            link_url=request.data.get('link_url', ''),
            is_featured=request.data.get('is_featured', False)
        )
        return Response(AchievementSerializer(ach).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        ach = get_object_or_404(Achievement, pk=pk, profile=profile)
        for field in ['title', 'description', 'date_achieved', 'category', 'link_url', 'is_featured']:
            if field in request.data:
                val = request.data[field]
                if field == 'date_achieved' and not val:
                    val = None
                setattr(ach, field, val)
        ach.save()
        return Response(AchievementSerializer(ach).data)

    def delete(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        ach = get_object_or_404(Achievement, pk=pk, profile=profile)
        ach.delete()
        return Response({'deleted': True}, status=status.HTTP_200_OK)


# --- CONTACT ---
class OwnerContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile, err = require_owner(request)
        if err: return err

        contact = Contact.objects.create(
            profile=profile,
            contact_type=request.data.get('contact_type', 'Link'),
            contact_value=request.data.get('contact_value', ''),
            icon_name=request.data.get('icon_name', 'Mail'),
            display_order=request.data.get('display_order', 0),
            is_public=True
        )
        return Response(ContactSerializer(contact).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        contact = get_object_or_404(Contact, pk=pk, profile=profile)
        for field in ['contact_type', 'contact_value', 'icon_name', 'display_order', 'is_public']:
            if field in request.data:
                setattr(contact, field, request.data[field])
        contact.save()
        return Response(ContactSerializer(contact).data)

    def delete(self, request, pk=None):
        profile, err = require_owner(request)
        if err: return err

        contact = get_object_or_404(Contact, pk=pk, profile=profile)
        contact.delete()
        return Response({'deleted': True}, status=status.HTTP_200_OK)


# --- RESUME ---
class OwnerResumeView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
        profile, err = require_owner(request)
        if err: return err

        resume = Resume.objects.filter(profile=profile).first()
        if not resume:
            resume = Resume.objects.create(profile=profile, is_primary=True)

        if 'file_url' in request.data: resume.file_url = request.data['file_url']
        if 'version_number' in request.data: resume.version_number = request.data['version_number']
        if 'description' in request.data: resume.description = request.data['description']
        resume.save()
        return Response(ResumeSerializer(resume).data)
