import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from portfolio.models import PortfolioUser, Profile, AboutMe, Skill, Project, Education, Certification, Achievement, Contact, Resume
import datetime

# 1. Create Django Admin Superuser
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@cjostaga.com', 'Admin@CJO2024!')
    print("Created Django Admin superuser: admin / Admin@CJO2024!")
else:
    print("Superuser 'admin' already exists.")

# 2. PortfolioUser
portfolio_user, created = PortfolioUser.objects.get_or_create(
    email='christian.ostaga@gmail.com',
    defaults={
        'password': 'pbkdf2_sha256$placeholder',
        'role': 'Full-Stack Developer'
    }
)
print(f"PortfolioUser: {portfolio_user.email} (id: {portfolio_user.user_id})")

# 3. Profile
profile = Profile.objects.filter(firstname='Christian', lastname='Ostaga').first()
if not profile:
    profile = Profile.objects.create(
        user=portfolio_user,
        firstname='Christian',
        middlename='Joseph',
        lastname='Ostaga',
        bio='Passionate Full-Stack Developer & Software Engineer dedicated to crafting modern, performant web applications and intuitive digital experiences. Proficient in React, TypeScript, Python, Django, and cloud database architecture.',
        is_public=True
    )
    print(f"Created Profile: {profile.firstname} {profile.lastname} (id: {profile.profile_id})")
else:
    profile.middlename = 'Joseph'
    profile.bio = 'Passionate Full-Stack Developer & Software Engineer dedicated to crafting modern, performant web applications and intuitive digital experiences. Proficient in React, TypeScript, Python, Django, and cloud database architecture.'
    profile.is_public = True
    profile.save()
    print(f"Updated Profile: {profile.firstname} {profile.lastname} (id: {profile.profile_id})")

# 4. About Me
if not AboutMe.objects.filter(profile=profile).exists():
    AboutMe.objects.create(
        profile=profile,
        title='Background & Passion',
        content='I am Christian Joseph Ostaga, a full-stack developer with a drive for creating clean, scalable, and impactful solutions. My journey spans building dynamic interactive frontends with modern React and TypeScript to engineering robust, secure RESTful APIs powered by Python and Django.',
        is_public=True,
        display_order=1
    )
    AboutMe.objects.create(
        profile=profile,
        title='Engineering Philosophy',
        content='I believe in software craftsmanship: clean code, semantic structure, accessibility, performance optimization, and delightful user experiences that solve real problems efficiently.',
        is_public=True,
        display_order=2
    )
    print("Created AboutMe entries.")

# 5. Skills
if not Skill.objects.filter(profile=profile).exists():
    skills_data = [
        ('React', 'Frontend', 2022, 'Modern Frontend Development'),
        ('TypeScript', 'Frontend', 2023, 'Type-Safe Web Apps'),
        ('Vite', 'Frontend', 2023, 'Next-Gen Frontend Tooling'),
        ('HTML5 & CSS3', 'Frontend', 2021, 'Semantic Web & Responsive Design'),
        ('Python', 'Backend', 2022, 'Core Python Programming'),
        ('Django & DRF', 'Backend', 2022, 'RESTful API Engineering'),
        ('PostgreSQL', 'Database', 2022, 'Relational Database Design'),
        ('Git & GitHub', 'DevOps & Tools', 2021, 'Version Control & Collaboration'),
        ('REST APIs', 'Architecture', 2022, 'API Design & Integration'),
    ]
    for name, cat, yr, cert in skills_data:
        Skill.objects.create(
            profile=profile,
            name=name,
            category=cat,
            year_acquired=yr,
            certification=cert
        )
    print("Created Skills entries.")

# 6. Projects
if not Project.objects.filter(profile=profile).exists():
    p1 = Project.objects.create(
        profile=profile,
        title='Full-Stack Portfolio Platform',
        description='A modern, reactive portfolio platform engineered with React 18, Vite, TypeScript, Framer Motion, and a robust Django REST Framework backend connected to a managed PostgreSQL database.',
        demo_url='https://christianostaga.dev',
        github_url='https://github.com/christianostaga/portfolio',
        is_featured=True,
        display_order=1
    )
    p2 = Project.objects.create(
        profile=profile,
        title='Enterprise Data Management API',
        description='Scalable backend service built using Django and PostgreSQL featuring token authentication, strict role-based access control, comprehensive pagination, and automated analytics logging.',
        demo_url='https://api.christianostaga.dev',
        github_url='https://github.com/christianostaga/django-backend-api',
        is_featured=True,
        display_order=2
    )
    print("Created Projects.")

# 7. Education
if not Education.objects.filter(profile=profile).exists():
    Education.objects.create(
        profile=profile,
        institution_name='Information Technology Studies',
        degree='Bachelor of Science',
        field_of_study='Information Technology',
        start_date=datetime.date(2021, 8, 1),
        end_date=datetime.date(2025, 6, 30),
        grade_gpa='Consistent Honor Roll'
    )
    print("Created Education.")

# 8. Certifications
if not Certification.objects.filter(profile=profile).exists():
    Certification.objects.create(
        profile=profile,
        name='Full-Stack Web Development Certification',
        issuing_organization='Professional Tech Institute',
        issue_date=datetime.date(2023, 11, 15),
        credential_id='CERT-CJO-2023',
        credential_url='https://example.com/verify/CERT-CJO-2023'
    )
    print("Created Certification.")

# 9. Achievements
if not Achievement.objects.filter(profile=profile).exists():
    Achievement.objects.create(
        profile=profile,
        title='Dean\'s List / Academic Excellence',
        description='Recognized for exceptional academic performance and technical excellence in software engineering courses.',
        date_achieved=datetime.date(2024, 3, 1),
        category='Academic',
        link_url='',
        is_featured=True
    )
    print("Created Achievement.")

# 10. Contact
if not Contact.objects.filter(profile=profile).exists():
    Contact.objects.create(
        profile=profile,
        contact_type='Email',
        contact_value='christian.ostaga@gmail.com',
        is_public=True,
        display_order=1,
        icon_name='Mail'
    )
    Contact.objects.create(
        profile=profile,
        contact_type='GitHub',
        contact_value='https://github.com/christianostaga',
        is_public=True,
        display_order=2,
        icon_name='Github'
    )
    Contact.objects.create(
        profile=profile,
        contact_type='LinkedIn',
        contact_value='https://linkedin.com/in/christian-joseph-ostaga',
        is_public=True,
        display_order=3,
        icon_name='Linkedin'
    )
    print("Created Contacts.")

# 11. Resume
if not Resume.objects.filter(profile=profile).exists():
    Resume.objects.create(
        profile=profile,
        file_url='#',
        version_number='2025.1',
        is_primary=True,
        description='Full-Stack Developer Resume highlighting experience in React, TypeScript, Python, Django, and relational database systems.'
    )
    print("Created Resume.")

print("All seed data created successfully!")
