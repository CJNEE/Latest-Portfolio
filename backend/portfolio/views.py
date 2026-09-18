from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils import timezone
from .models import (
    Profile, AboutMe, Skill, Project,
    Education, Certification, Achievement, Contact, Resume, Analytics
)
from .serializers import (
    ProfileSerializer, AboutMeSerializer, SkillSerializer, ProjectSerializer,
    EducationSerializer, CertificationSerializer, AchievementSerializer,
    ContactSerializer, ResumeSerializer
)


def get_public_profile():
    """Get the first public profile (Christian Joseph Ostaga's profile)."""
    return Profile.objects.filter(is_public=True).first()


class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class AboutMeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        entries = AboutMe.objects.filter(profile=profile, is_public=True).order_by('display_order')
        serializer = AboutMeSerializer(entries, many=True)
        return Response(serializer.data)


class SkillsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        skills = Skill.objects.filter(profile=profile).order_by('category', 'name')
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)


class ProjectsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        projects = Project.objects.filter(profile=profile).prefetch_related('media').order_by('display_order')
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class EducationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        education = Education.objects.filter(profile=profile).order_by('-start_date')
        serializer = EducationSerializer(education, many=True)
        return Response(serializer.data)


class CertificationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        certs = Certification.objects.filter(profile=profile).order_by('-issue_date')
        serializer = CertificationSerializer(certs, many=True)
        return Response(serializer.data)


class AchievementsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        achievements = Achievement.objects.filter(profile=profile).order_by('-date_achieved')
        serializer = AchievementSerializer(achievements, many=True)
        return Response(serializer.data)


class ContactView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        contacts = Contact.objects.filter(profile=profile, is_public=True).order_by('display_order')
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)


class ResumeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_public_profile()
        if not profile:
            return Response([])
        resumes = Resume.objects.filter(profile=profile).order_by('-is_primary', '-last_updated')
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data)


class AnalyticsTrackView(APIView):
    """POST endpoint to track a portfolio visit anonymously."""
    permission_classes = [AllowAny]

    def post(self, request):
        profile = get_public_profile()
        if not profile:
            return Response({'tracked': False})
        Analytics.objects.create(profile=profile, viewers_count=1, visited_time=timezone.now())
        return Response({'tracked': True}, status=status.HTTP_201_CREATED)
