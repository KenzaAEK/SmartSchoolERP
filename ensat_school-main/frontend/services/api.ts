
import { Student, Grade, User, UserRole, PredictionData } from "../types";
import { MOCK_STUDENTS, MOCK_GRADES_GINF, MOCK_STUDENT_REPORT } from "../data/mockData";

export const api = {
  login: async (email: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    
    let role = UserRole.STUDENT;
    let name = "Étudiant ENSA";
    
    if (email.includes('admin')) {
      role = UserRole.ADMIN;
      name = "Administrateur Système";
    } else if (email.includes('teacher')) {
      role = UserRole.TEACHER;
      name = "Pr. Mohammed Alami";
    } else if (email.includes('student')) {
      name = MOCK_STUDENTS[0].name;
    }
    
    return {
      id: role === UserRole.ADMIN ? 'ADM-01' : role === UserRole.TEACHER ? 'PRF-42' : 'USR-01',
      name,
      email,
      role
    };
  },

  getGrades: async (studentId: string): Promise<Grade[]> => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_STUDENT_REPORT;
  },

  getPredictionData: async (): Promise<PredictionData[]> => {
    return [
      { month: 'Sep', successRate: 82, predictedRate: 85 },
      { month: 'Oct', successRate: 78, predictedRate: 80 },
      { month: 'Nov', successRate: 85, predictedRate: 88 },
      { month: 'Dec', successRate: 83, predictedRate: 90 },
      { month: 'Jan', successRate: 88, predictedRate: 92 },
    ];
  },

  getAllStudents: async (): Promise<any[]> => {
    await new Promise(r => setTimeout(r, 600));
    return [...MOCK_STUDENTS];
  },

  getDeliberationData: async (major: string): Promise<any[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return MOCK_STUDENTS.map(s => {
      const avg = 10 + Math.random() * 8;
      const hasEliminatory = Math.random() > 0.9;
      let status = "Admis";
      if (avg < 12) status = "Rattrapage";
      if (hasEliminatory) status = "Eliminé (Note < 5)";
      if (avg < 7) status = "Redoublant";
      
      return {
        ...s,
        average: avg.toFixed(2),
        status,
        modulesValidated: Math.floor(Math.random() * 6) + 6
      };
    });
  },

  bulkImport: async (type: 'students' | 'grades', file: File): Promise<{success: number, errors: any[]}> => {
    await new Promise(r => setTimeout(r, 2000));
    return { success: 150, errors: [] };
  },

  // Simule la génération d'un PDF côté serveur
  generatePDF: async (type: string, data: any): Promise<string> => {
    await new Promise(r => setTimeout(r, 1500));
    return "blob:https://sgai.edu/report-" + Math.random().toString(36).substring(7);
  },

  saveStudent: async (student: any): Promise<void> => {
    await new Promise(r => setTimeout(r, 800));
  },

  deleteStudent: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
  },

  getAllTeachers: async (): Promise<any[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [
      { id: 'PRF-42', name: 'Pr. Mohammed Alami', email: 'm.alami@uae.ac.ma', specialty: 'Architecture JEE', status: 'Active', load: 18 },
      { id: 'PRF-43', name: 'Pr. Karima Tazi', email: 'k.tazi@uae.ac.ma', specialty: 'Intelligence Artificielle', status: 'Active', load: 12 },
    ];
  },

  saveTeacher: async (teacher: any): Promise<void> => {
    await new Promise(r => setTimeout(r, 800));
  },

  deleteTeacher: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
  },

  getTeacherStats: async (teacherId: string) => {
    await new Promise(r => setTimeout(r, 400));
    return {
      totalStudents: 145,
      avgClassGrade: 13.4,
      pendingGrades: 12,
      classPerformance: [
        { name: 'JEE', avg: 14.5, count: 42 },
        { name: 'POO', avg: 12.2, count: 56 },
        { name: 'Web', avg: 13.5, count: 47 }
      ]
    };
  }
};
