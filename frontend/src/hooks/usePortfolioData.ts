import { useQuery } from '@tanstack/react-query';
import {
  fetchProfile, fetchAboutMe, fetchSkills, fetchProjects,
  fetchEducation, fetchCertifications, fetchAchievements,
  fetchContact, fetchResume
} from '../api/portfolio';

export const useProfile = () => useQuery({ queryKey: ['profile'], queryFn: fetchProfile, staleTime: 5 * 60 * 1000 });
export const useAboutMe = () => useQuery({ queryKey: ['aboutme'], queryFn: fetchAboutMe, staleTime: 5 * 60 * 1000 });
export const useSkills = () => useQuery({ queryKey: ['skills'], queryFn: fetchSkills, staleTime: 5 * 60 * 1000 });
export const useProjects = () => useQuery({ queryKey: ['projects'], queryFn: fetchProjects, staleTime: 5 * 60 * 1000 });
export const useEducation = () => useQuery({ queryKey: ['education'], queryFn: fetchEducation, staleTime: 5 * 60 * 1000 });
export const useCertifications = () => useQuery({ queryKey: ['certifications'], queryFn: fetchCertifications, staleTime: 5 * 60 * 1000 });
export const useAchievements = () => useQuery({ queryKey: ['achievements'], queryFn: fetchAchievements, staleTime: 5 * 60 * 1000 });
export const useContact = () => useQuery({ queryKey: ['contact'], queryFn: fetchContact, staleTime: 5 * 60 * 1000 });
export const useResume = () => useQuery({ queryKey: ['resume'], queryFn: fetchResume, staleTime: 5 * 60 * 1000 });
