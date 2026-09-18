export interface Profile {
  profile_id: number;
  firstname: string;
  lastname: string;
  middlename?: string;
  bio?: string;
  full_name: string;
}

export interface AboutMe {
  about_me_id: number;
  title: string;
  content: string;
  last_updated: string;
  display_order: number;
}

export interface Skill {
  skill_id: number;
  name?: string;
  category?: string;
  year_acquired?: number;
  certification?: string;
}

export interface ProjectMedia {
  project_media_id: number;
  media_url: string;
  display_order: number;
}

export interface Project {
  project_id: number;
  title: string;
  description?: string;
  demo_url?: string;
  github_url?: string;
  is_featured: boolean;
  display_order: number;
  media: ProjectMedia[];
}

export interface Education {
  education_id: number;
  institution_name: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade_gpa?: string;
}

export interface Certification {
  certification_id: number;
  name: string;
  issuing_organization?: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
}

export interface Achievement {
  achievement_id: number;
  title: string;
  description?: string;
  date_achieved?: string;
  category?: string;
  link_url?: string;
  is_featured: boolean;
}

export interface Contact {
  contact_id: number;
  contact_type?: string;
  contact_value?: string;
  icon_name?: string;
  display_order: number;
}

export interface Resume {
  resume_id: number;
  file_url?: string;
  version_number?: string;
  is_primary: boolean;
  description?: string;
  last_updated: string;
}
