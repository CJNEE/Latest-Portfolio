from django.db import models
from django.utils import timezone
import secrets


class PortfolioUser(models.Model):
    user_id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user'
        managed = False

    def __str__(self):
        return self.email or f"User #{self.user_id}"


class Profile(models.Model):
    profile_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        PortfolioUser,
        on_delete=models.CASCADE,
        db_column='user_id',
        related_name='profiles'
    )
    lastname = models.CharField(max_length=100, blank=True, null=True)
    firstname = models.CharField(max_length=100, blank=True, null=True)
    middlename = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        db_table = 'profile'

    def __str__(self):
        parts = filter(None, [self.firstname, self.middlename, self.lastname])
        return ' '.join(parts) or f"Profile #{self.profile_id}"


class AboutMe(models.Model):
    about_me_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='about_entries'
    )
    content = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'aboutme'
        ordering = ['display_order']

    def __str__(self):
        return self.title or f"About #{self.about_me_id}"


class Skill(models.Model):
    skill_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='skills'
    )
    name = models.CharField(max_length=200, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    year_acquired = models.IntegerField(blank=True, null=True)
    certification = models.CharField(max_length=300, blank=True, null=True)

    class Meta:
        db_table = 'skills'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})" if self.name else f"Skill #{self.skill_id}"


class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='projects'
    )
    title = models.CharField(max_length=300, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    demo_url = models.CharField(max_length=500, blank=True, null=True)
    github_url = models.CharField(max_length=500, blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'project'
        ordering = ['display_order', '-is_featured']

    def __str__(self):
        return self.title or f"Project #{self.project_id}"


class ProjectMedia(models.Model):
    project_media_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        db_column='project_id',
        related_name='media'
    )
    media_url = models.CharField(max_length=500, blank=True, null=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'project_media'
        ordering = ['display_order']

    def __str__(self):
        return f"Media #{self.project_media_id} for {self.project}"


class Education(models.Model):
    education_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='education'
    )
    institution_name = models.CharField(max_length=300, blank=True, null=True)
    degree = models.CharField(max_length=200, blank=True, null=True)
    field_of_study = models.CharField(max_length=200, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    grade_gpa = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'education'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.degree} at {self.institution_name}"


class Certification(models.Model):
    certification_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='certifications'
    )
    name = models.CharField(max_length=300, blank=True, null=True)
    issuing_organization = models.CharField(max_length=300, blank=True, null=True)
    issue_date = models.DateField(blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    credential_id = models.CharField(max_length=200, blank=True, null=True)
    credential_url = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'certifications'
        ordering = ['-issue_date']

    def __str__(self):
        return self.name or f"Certification #{self.certification_id}"


class Achievement(models.Model):
    achievement_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='achievements'
    )
    title = models.CharField(max_length=300, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    date_achieved = models.DateField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    link_url = models.CharField(max_length=500, blank=True, null=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        db_table = 'achievements'
        ordering = ['-date_achieved']

    def __str__(self):
        return self.title or f"Achievement #{self.achievement_id}"


class Contact(models.Model):
    contact_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='contacts'
    )
    contact_type = models.CharField(max_length=100, blank=True, null=True)
    contact_value = models.CharField(max_length=300, blank=True, null=True)
    is_public = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    icon_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'contact'
        ordering = ['display_order']

    def __str__(self):
        return f"{self.contact_type}: {self.contact_value}"


class Resume(models.Model):
    resume_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='resumes'
    )
    file_url = models.CharField(max_length=500, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    version_number = models.CharField(max_length=50, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'resume'
        ordering = ['-is_primary', '-last_updated']

    def __str__(self):
        return f"Resume v{self.version_number or '1.0'}"


class Analytics(models.Model):
    analytics_id = models.AutoField(primary_key=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        db_column='profile_id',
        related_name='analytics'
    )
    viewers_count = models.IntegerField(default=0)
    visited_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analytics'

    def __str__(self):
        return f"Analytics #{self.analytics_id} for profile {self.profile_id}"


class PasswordResetToken(models.Model):
    token_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        PortfolioUser,
        on_delete=models.CASCADE,
        db_column='user_id',
        related_name='reset_tokens'
    )
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'password_reset_tokens'
        ordering = ['-created_at']

    def is_valid(self):
        return not self.is_used and timezone.now() <= self.expires_at
