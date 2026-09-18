import apiClient from './apiClient';
import type { Profile, AboutMe, Skill, Project, Education, Certification, Achievement, Contact, Resume } from '../types/portfolio';

export const fetchProfile = async (): Promise<Profile> => {
  const { data } = await apiClient.get<Profile>('/profile/');
  return data;
};

export const fetchAboutMe = async (): Promise<AboutMe[]> => {
  const { data } = await apiClient.get<AboutMe[]>('/aboutme/');
  return data;
};

export const fetchSkills = async (): Promise<Skill[]> => {
  const { data } = await apiClient.get<Skill[]>('/skills/');
  return data;
};

export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get<Project[]>('/projects/');
  return data;
};

export const fetchEducation = async (): Promise<Education[]> => {
  const { data } = await apiClient.get<Education[]>('/education/');
  return data;
};

export const fetchCertifications = async (): Promise<Certification[]> => {
  const { data } = await apiClient.get<Certification[]>('/certifications/');
  return data;
};

export const fetchAchievements = async (): Promise<Achievement[]> => {
  const { data } = await apiClient.get<Achievement[]>('/achievements/');
  return data;
};

export const fetchContact = async (): Promise<Contact[]> => {
  const { data } = await apiClient.get<Contact[]>('/contact/');
  return data;
};

export const fetchResume = async (): Promise<Resume[]> => {
  const { data } = await apiClient.get<Resume[]>('/resume/');
  return data;
};

export const trackVisit = async (): Promise<void> => {
  await apiClient.post('/analytics/track/');
};
