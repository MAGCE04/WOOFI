// src/services/firebaseDogsService.ts
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { Dog } from "../types/dog";

const dogsCollection = collection(db, "dogs");

export const fetchDogs = async (): Promise<Dog[]> => {
  const snapshot = await getDocs(dogsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Dog, "id">)
  }));
};

export const addDog = async (dog: Omit<Dog, "id">): Promise<void> => {
  await addDoc(dogsCollection, dog);
};

export const updateDog = async (id: string, dog: Omit<Dog, "id">): Promise<void> => {
  const ref = doc(db, "dogs", id);
  await updateDoc(ref, dog);
};

export const deleteDog = async (id: string): Promise<void> => {
  const ref = doc(db, "dogs", id);
  await deleteDoc(ref);
};
