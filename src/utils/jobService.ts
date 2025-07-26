import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const addJobToFirebase = async (jobData: any) => {
  await addDoc(collection(db, "jobs"), jobData);
};

export const fetchJobsFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, "jobs"));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      deadline: data.deadline?.toDate ? data.deadline.toDate() : data.deadline,
    };
  });
};

export const updateJobInFirebase = async (id: string, jobData: any) => {
  const jobRef = doc(db, "jobs", id);
  await updateDoc(jobRef, jobData);
};

export const deleteJobFromFirebase = async (id: string) => {
  const jobRef = doc(db, "jobs", id);
  await deleteDoc(jobRef);
};