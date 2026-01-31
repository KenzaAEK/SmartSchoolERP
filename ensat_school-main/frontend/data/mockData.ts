
import { UserRole, Student, Grade } from '../types';

export const MAJORS = [
  { id: 'GINF', name: 'Génie Informatique' },
  { id: 'GSTR', name: 'Systèmes Télécoms & Réseaux' },
  { id: 'GIND', name: 'Génie Industriel' },
  { id: 'GSEA', name: 'Systèmes Électroniques & Automatique' },
  { id: 'CP1', name: 'Cycle Préparatoire 1' },
  { id: 'CP2', name: 'Cycle Préparatoire 2' }
];

export const MODULES = [
  { id: 'M1', name: 'POO Java & Framework Spring', major: 'GINF', semester: 3 },
  { id: 'M2', name: 'Analyse & Algèbre 3', major: 'CP2', semester: 1 },
  { id: 'M3', name: 'Théorie des Graphes', major: 'GINF', semester: 3 },
  { id: 'M4', name: 'Recherche Opérationnelle', major: 'GIND', semester: 4 },
  { id: 'M5', name: 'Réseaux Mobiles 5G', major: 'GSTR', semester: 5 }
];

export const WEEKLY_SCHEDULE = [
  { day: 'Lundi', slots: [
    { time: '08:30 - 10:20', subject: 'Architecture JEE', room: 'Amphi A', type: 'Cours', color: 'bg-blue-100 text-blue-700' },
    { time: '10:30 - 12:20', subject: 'Architecture JEE', room: 'Labo 4', type: 'TP', color: 'bg-purple-100 text-purple-700' }
  ]},
  { day: 'Mardi', slots: [
    { time: '08:30 - 12:20', subject: 'Théorie des Graphes', room: 'Salle 12', type: 'Cours/TD', color: 'bg-green-100 text-green-700' },
    { time: '14:30 - 18:20', subject: 'Intelligence Artificielle', room: 'Salle 15', type: 'Cours', color: 'bg-orange-100 text-orange-700' }
  ]},
  { day: 'Mercredi', slots: [
    { time: '08:30 - 12:20', subject: 'Management de Projet', room: 'Salle 5', type: 'Cours', color: 'bg-pink-100 text-pink-700' }
  ]},
  { day: 'Jeudi', slots: [
    { time: '08:30 - 10:20', subject: 'Anglais Technique', room: 'Salle B1', type: 'TD', color: 'bg-indigo-100 text-indigo-700' },
    { time: '10:30 - 12:20', subject: 'Recherche Opérationnelle', room: 'Salle 10', type: 'Cours', color: 'bg-yellow-100 text-yellow-700' }
  ]},
  { day: 'Vendredi', slots: [
    { time: '14:30 - 18:20', subject: 'Réseaux Avancés', room: 'Labo 2', type: 'TP', color: 'bg-cyan-100 text-cyan-700' }
  ]}
];

export const MOCK_STUDENTS: any[] = [
  { id: 'S202401', name: 'Yassine El Amrani', email: 'y.elamrani@uae.ac.ma', major: 'GINF', class: '3rd Year', attendanceRate: 94, avatar: 'https://i.pravatar.cc/150?u=yassine' },
  { id: 'S202402', name: 'Fatima-Zahra Mansouri', email: 'f.mansouri@uae.ac.ma', major: 'GINF', class: '3rd Year', attendanceRate: 88, avatar: 'https://i.pravatar.cc/150?u=fatima' },
  { id: 'S202403', name: 'Omar Berrada', email: 'o.berrada@uae.ac.ma', major: 'GSTR', class: '4th Year', attendanceRate: 72, avatar: 'https://i.pravatar.cc/150?u=omar' },
  { id: 'S202404', name: 'Salma Tazi', email: 's.tazi@uae.ac.ma', major: 'GIND', class: '3rd Year', attendanceRate: 98, avatar: 'https://i.pravatar.cc/150?u=salma' },
  { id: 'S202405', name: 'Anas Bennani', email: 'a.bennani@uae.ac.ma', major: 'CP2', class: 'Prep 2', attendanceRate: 85, avatar: 'https://i.pravatar.cc/150?u=anas' },
  { id: 'S202406', name: 'Mehdi Alami', email: 'm.alami@uae.ac.ma', major: 'GINF', class: '3rd Year', attendanceRate: 92, avatar: 'https://i.pravatar.cc/150?u=mehdi' },
  { id: 'S202407', name: 'Sofia Filali', email: 's.filali@uae.ac.ma', major: 'GINF', class: '3rd Year', attendanceRate: 95, avatar: 'https://i.pravatar.cc/150?u=sofia' },
];

export const MOCK_GRADES_GINF: any[] = [
  { studentId: 'S202401', studentName: 'Yassine El Amrani', grade: 14.5, attendance: 'Present' },
  { studentId: 'S202402', studentName: 'Fatima-Zahra Mansouri', grade: 16.0, attendance: 'Present' },
  { studentId: 'S202406', studentName: 'Mehdi Alami', grade: 8.5, attendance: 'Absent' },
  { studentId: 'S202407', studentName: 'Sofia Filali', grade: 12.0, attendance: 'Present' },
];

export const MOCK_STUDENT_REPORT: Grade[] = [
  { id: 'G1', subject: 'Architecture JEE (Spring Boot)', value: 15.75, weight: 4, date: '2023-12-10', teacherName: 'Pr. M. Alami' },
  { id: 'G2', subject: 'Théorie des Graphes', value: 13.50, weight: 3, date: '2023-12-15', teacherName: 'Pr. A. Bennani' },
  { id: 'G3', subject: 'Intelligence Artificielle', value: 14.00, weight: 4, date: '2024-01-05', teacherName: 'Pr. K. Tazi' },
  { id: 'G4', subject: 'Management de Projet', value: 11.25, weight: 2, date: '2023-11-20', teacherName: 'Mme. S. Filali' },
  { id: 'G5', subject: 'Langues & Communication', value: 16.00, weight: 2, date: '2024-01-12', teacherName: 'Mme. H. Mansouri' },
  { id: 'G6', subject: 'Recherche Opérationnelle', value: 12.50, weight: 3, date: '2023-12-20', teacherName: 'Pr. R. Jabri' },
];
