import random
import datetime
from django.utils import timezone
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
import jwt
from .models import PortfolioUser, Profile, PasswordResetToken

SECRET_KEY = getattr(settings, 'SECRET_KEY', 'django-insecure-cjo-portfolio-secret-key-change-in-production-2024')


def generate_jwt(user):
    payload = {
        'user_id': user.user_id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except Exception:
        return None


def get_user_from_request(request):
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        data = decode_jwt(token)
        if data and 'user_id' in data:
            return PortfolioUser.objects.filter(user_id=data['user_id']).first()
    return None


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = PortfolioUser.objects.filter(email__iexact=email).first()
        if not user:
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Verify password
        is_valid = False
        if user.password.startswith('pbkdf2_') or user.password.startswith('bcrypt'):
            is_valid = check_password(password, user.password)
        else:
            is_valid = (user.password == password)

        if not is_valid:
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        token = generate_jwt(user)
        profile = Profile.objects.filter(user=user).first() or Profile.objects.first()

        return Response({
            'token': token,
            'user': {
                'user_id': user.user_id,
                'email': user.email,
                'role': user.role or 'Owner',
                'name': f"{profile.firstname} {profile.lastname}" if profile else "Christian Joseph Ostaga",
            }
        })


class MeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_user_from_request(request)
        if not user:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        profile = Profile.objects.filter(user=user).first() or Profile.objects.first()
        return Response({
            'user_id': user.user_id,
            'email': user.email,
            'role': user.role or 'Owner',
            'name': f"{profile.firstname} {profile.lastname}" if profile else "Christian Joseph Ostaga",
        })


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = PortfolioUser.objects.filter(email__iexact=email).first()
        if not user:
            return Response({'detail': 'Account with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Generate 6-digit code
        code = f"{random.randint(100000, 999999)}"
        expires_at = timezone.now() + datetime.timedelta(minutes=10)

        # Invalidate old unused tokens
        PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)

        token_obj = PasswordResetToken.objects.create(
            user=user,
            code=code,
            expires_at=expires_at,
            is_used=False
        )

        # Attempt to send email
        subject = "Your Verification Code — Christian Joseph Ostaga Portfolio"
        message = (
            f"Hello Christian,\n\n"
            f"Your 6-digit verification code to reset your Owner password is:\n\n"
            f"   {code}\n\n"
            f"This code will expire in 10 minutes.\n\n"
            f"If you did not request this, please ignore this email."
        )

        email_sent = False
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False
            )
            email_sent = True
        except Exception as e:
            print(f"[AUTH] Email delivery exception: {e}")
            print(f"[AUTH] Verification code for {user.email}: {code}")

        return Response({
            'success': True,
            'email_sent': email_sent,
            'message': f"Verification code has been sent to {user.email}.",
            # Note: debug fallback in development if SMTP is not configured yet
            'dev_code': code if not email_sent else None
        })


class VerifyResetCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()

        if not email or not code:
            return Response({'detail': 'Email and code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = PortfolioUser.objects.filter(email__iexact=email).first()
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        token = PasswordResetToken.objects.filter(
            user=user,
            code=code,
            is_used=False,
            expires_at__gte=timezone.now()
        ).first()

        if not token:
            return Response({'detail': 'Invalid or expired verification code.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'valid': True, 'message': 'Code verified successfully.'})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()
        new_password = request.data.get('new_password', '')

        if not email or not code or not new_password:
            return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({'detail': 'Password must be at least 6 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        user = PortfolioUser.objects.filter(email__iexact=email).first()
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        token = PasswordResetToken.objects.filter(
            user=user,
            code=code,
            is_used=False,
            expires_at__gte=timezone.now()
        ).first()

        if not token:
            return Response({'detail': 'Invalid or expired code. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        token.is_used = True
        token.save()

        user.password = make_password(new_password)
        user.save()

        return Response({'success': True, 'message': 'Password has been updated successfully! You can now log in.'})
