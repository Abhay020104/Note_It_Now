import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export const addTaskToFirestore = async (task) => {
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("User must be logged in to add a task");
        }

        const taskWithUser = {
            ...task,
            userId: currentUser.uid
        };
        const docRef = await addDoc(collection(db, "tasks"), taskWithUser);
        return { id: docRef.id, ...taskWithUser };
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
}

export const getAllTasks = async () => {
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) return []; 

        const tasksRef = collection(db, "tasks");
        const userTasksQuery = query(tasksRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(userTasksQuery);
        const tasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
}

export const updateTaskInFirestore = async (taskId, updatedTask) => {
    try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}

export const deleteTaskFromFirestore = async (taskId) => {
    try {
        const taskRef = doc(db, "tasks", taskId);
        await deleteDoc(taskRef);
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}