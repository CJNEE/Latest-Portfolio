import apiClient from './apiClient';
import type { Profile, AboutMe, Skill, Project, Education, Certification, Achievement, Contact, Resume } from '../types/portfolio';

export const fetchProfile = async (): Promise<Profile> => {
  const { data } = await apiClient.get<Profile>('/profile/');
  return data;
};

export const fetchAboutMe = async (): Promise<AboutMe[]> => {
  const { data } = await apiClient.get<unknown>('/aboutme/');
  return Array.isArray(data) ? data : [];
};

export const fetchSkills = async (): Promise<Skill[]> => {
  const { data } = await apiClient.get<unknown>('/skills/');
  return Array.isArray(data) ? data : [];
};

export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get<unknown>('/projects/');
  return Array.isArray(data) ? data : [];
};

export const fetchEducation = async (): Promise<Education[]> => {
  const { data } = await apiClient.get<unknown>('/education/');
  return Array.isArray(data) ? data : [];
};

export const fetchCertifications = async (): Promise<Certification[]> => {
  const { data } = await apiClient.get<unknown>('/certifications/');
  return Array.isArray(data) ? data : [];
};

export const fetchAchievements = async (): Promise<Achievement[]> => {
  const { data } = await apiClient.get<unknown>('/achievements/');
  return Array.isArray(data) ? data : [];
};

export const fetchContact = async (): Promise<Contact[]> => {
  const { data } = await apiClient.get<unknown>('/contact/');
  return Array.isArray(data) ? data : [];
};

export const fetchResume = async (): Promise<Resume[]> => {
  const { data } = await apiClient.get<unknown>('/resume/');
  return Array.isArray(data) ? data : [];
};

// Analytics tracking — fire-and-forget, never crash the app
export const trackVisit = async (): Promise<void> => {
  try {
    await apiClient.post('/analytics/track/');
  } catch {
    // silently ignore — endpoint may not exist
  }
};

