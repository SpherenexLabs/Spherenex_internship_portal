import { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  doc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error parsing currentUser from localStorage:', error);
      localStorage.removeItem('currentUser');
      return null;
    }
  });
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || null;
  });
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [performancePoints, setPerformancePoints] = useState({});
  const [interviewReferrals, setInterviewReferrals] = useState([]);
  const [queries, setQueries] = useState([]);
  const [firestoreError, setFirestoreError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data from Firestore based on user type
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // Admin loads all students
        if (userType === 'admin') {
          const studentsRef = collection(db, 'students');
          const snapshot = await getDocs(studentsRef);
          const studentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setStudents(studentsData);

          // Load all tests for admin
          const testsRef = collection(db, 'tests');
          const testsSnapshot = await getDocs(testsRef);
          const testsData = testsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTests(testsData);

          // Load all performance points for admin
          const pointsRef = collection(db, 'performancePoints');
          const pointsSnapshot = await getDocs(pointsRef);
          const pointsData = {};
          pointsSnapshot.docs.forEach(doc => {
            pointsData[doc.id] = doc.data().points || [];
          });
          setPerformancePoints(pointsData);

          // Load all interview referrals for admin
          const referralsRef = collection(db, 'interviewReferrals');
          const referralsSnapshot = await getDocs(referralsRef);
          const referralsData = referralsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setInterviewReferrals(referralsData);

          // Load all queries for admin
          const queriesRef = collection(db, 'queries');
          const queriesSnapshot = await getDocs(queriesRef);
          const queriesData = queriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setQueries(queriesData);
        } 
        // Student loads only their own data
        else if (userType === 'student') {
          // Load tests (students can see all available tests)
          const testsRef = collection(db, 'tests');
          const testsSnapshot = await getDocs(testsRef);
          const testsData = testsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTests(testsData);

          // Load only this student's performance points
          const pointsRef = collection(db, 'performancePoints');
          const studentPointsDoc = doc(pointsRef, currentUser.id);
          const pointsSnapshot = await getDocs(pointsRef);
          const pointsData = {};
          pointsSnapshot.docs.forEach(doc => {
            if (doc.id === currentUser.id) {
              pointsData[doc.id] = doc.data().points || [];
            }
          });
          setPerformancePoints(pointsData);

          // Load only this student's interview referrals
          const referralsRef = collection(db, 'interviewReferrals');
          const q = query(referralsRef, where('studentId', '==', currentUser.id));
          const referralsSnapshot = await getDocs(q);
          const referralsData = referralsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setInterviewReferrals(referralsData);

          // Load only this student's queries
          const queriesRef = collection(db, 'queries');
          const queriesQuery = query(queriesRef, where('studentId', '==', currentUser.id));
          const queriesSnapshot = await getDocs(queriesQuery);
          const queriesData = queriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setQueries(queriesData);
        }

        setFirestoreError(null);
      } catch (error) {
        console.error('Error loading data:', error);
        setFirestoreError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, userType]);

  const loginAdmin = (email, password) => {
    // Hardcoded admin credentials
    if (email === 'admin@spherenex.com' && password === 'admin123') {
      const user = { email, name: 'Admin' };
      setCurrentUser(user);
      setUserType('admin');
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userType', 'admin');
      return true;
    }
    return false;
  };

  const loginStudent = async (email, password) => {
    try {
      // Query Firestore for student with matching email and password
      const studentsRef = collection(db, 'students');
      const q = query(studentsRef, where('email', '==', email), where('password', '==', password));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const studentDoc = snapshot.docs[0];
        const student = { id: studentDoc.id, ...studentDoc.data() };
        setCurrentUser(student);
        setUserType('student');
        localStorage.setItem('currentUser', JSON.stringify(student));
        localStorage.setItem('userType', 'student');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in student:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  const addStudent = async (student) => {
    try {
      // Add student to Firestore
      const studentsRef = collection(db, 'students');
      const docRef = await addDoc(studentsRef, {
        ...student,
        createdAt: new Date().toISOString()
      });
      
      const newStudent = { id: docRef.id, ...student };
      setStudents([...students, newStudent]);
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const addBulkStudents = async (studentList) => {
    try {
      const newStudents = [];
      const studentsRef = collection(db, 'students');
      
      // Add each student to Firestore
      for (const student of studentList) {
        const docRef = await addDoc(studentsRef, {
          ...student,
          createdAt: new Date().toISOString()
        });
        newStudents.push({ id: docRef.id, ...student });
      }
      
      setStudents([...students, ...newStudents]);
      return newStudents;
    } catch (error) {
      console.error('Error adding bulk students:', error);
      throw error;
    }
  };

  const addTest = async (test) => {
    try {
      const testsRef = collection(db, 'tests');
      const docRef = await addDoc(testsRef, {
        ...test,
        createdAt: new Date().toISOString()
      });
      const newTest = { id: docRef.id, ...test };
      setTests([...tests, newTest]);
      return newTest;
    } catch (error) {
      console.error('Error adding test:', error);
      throw error;
    }
  };

  const allocatePoints = async (studentId, points, reason) => {
    try {
      // Ensure studentId is a string (Firestore doc IDs are strings)
      const studentIdStr = String(studentId);
      const currentPoints = performancePoints[studentIdStr] || [];
      const newPointEntry = { points: parseInt(points), reason, date: new Date().toISOString() };
      const updatedPoints = [...currentPoints, newPointEntry];
      
      // Save to Firestore using studentId as document ID
      const pointsRef = collection(db, 'performancePoints');
      const studentDocRef = doc(pointsRef, studentIdStr);
      await setDoc(studentDocRef, { points: updatedPoints });
      
      setPerformancePoints({
        ...performancePoints,
        [studentIdStr]: updatedPoints
      });
    } catch (error) {
      console.error('Error allocating points:', error);
      throw error;
    }
  };

  const addInterviewReferral = async (referral) => {
    try {
      const referralsRef = collection(db, 'interviewReferrals');
      const docRef = await addDoc(referralsRef, {
        ...referral,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      const newReferral = { id: docRef.id, ...referral, status: 'Pending' };
      setInterviewReferrals([...interviewReferrals, newReferral]);
      return newReferral;
    } catch (error) {
      console.error('Error adding interview referral:', error);
      throw error;
    }
  };

  const addQuery = async (query) => {
    try {
      const queriesRef = collection(db, 'queries');
      const docRef = await addDoc(queriesRef, {
        ...query,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      const newQuery = { 
        id: docRef.id, 
        ...query, 
        status: 'Pending',
        createdAt: new Date().toISOString() 
      };
      setQueries([...queries, newQuery]);
      return newQuery;
    } catch (error) {
      console.error('Error adding query:', error);
      throw error;
    }
  };

  const updateStudentProfile = async (studentId, profileData) => {
    try {
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      const updatedStudent = { ...currentUser, ...profileData };
      setCurrentUser(updatedStudent);
      localStorage.setItem('currentUser', JSON.stringify(updatedStudent));

      // Update students list
      setStudents(students.map(s => 
        s.id === studentId ? updatedStudent : s
      ));

      return updatedStudent;
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userType,
    students,
    tests,
    performancePoints,
    interviewReferrals,
    queries,
    firestoreError,
    loading,
    loginAdmin,
    loginStudent,
    logout,
    addStudent,
    addBulkStudents,
    addTest,
    allocatePoints,
    addInterviewReferral,
    addQuery,
    updateStudentProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
