import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { useState, useEffect } from 'react';
import { updateTaskInFirestore, deleteTaskFromFirestore} from '../services/taskService';
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const MyTaskComponent = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        const tasksRef = collection(db, 'tasks'); 
        const q = query(tasksRef, where("userId", "==", currentUser.uid)); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(tasksData);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to load tasks.");
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleEdit = (task) => {
        setSelectedTask(task);
        setUpdatedTitle(task.title);
        setUpdatedDescription(task.description);
        document.getElementById("update-modal").showModal();
    };

    const handleUpdateTask = async () => {
        if (!selectedTask) return;
        try {
            await updateTaskInFirestore(selectedTask.id, {
                title: updatedTitle,
                description: updatedDescription,
            });
            toast.success("Task updated successfully!");
            document.getElementById("update-modal").close();
        } catch (error) {
            toast.error("Failed to update task.");
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTaskFromFirestore(taskId);
            toast.success("Task deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete task.");
        }
    };

  return (
    <div>
        {loading && <p className='text-gray-600'>Loading tasks...</p>}
        {!loading && tasks.length === 0 && (<p className='text-gray-600'>No tasks available.</p>)}
        {!loading && tasks.map((task) => (
            <div
                key={task.id}
                className='flex flex-col gap-2 mt-2 p-3 text-white bg-purple-700 rounded-md shadow-md'
            >
                <h1 className='text-xl font-semibold mb-2'>{task.title}</h1>
                <p className='text-sm text-gray-100'>{task.description}</p>
                <div className='flex w-full justify-end items-center gap-4 mt-4'>
                    <button 
                        className='btn btn-primary text-white flex gap-1 px-3'
                        onClick={() => handleEdit(task)}
                    >
                        <FaRegEdit className="text-base" />
                        Edit
                    </button>

                    <button 
                        className='btn btn-error bg-red-600 text-white flex gap-1 px-3'
                        onClick={() => handleDelete(task.id)}
                    >
                        <MdDeleteOutline className="text-lg" />
                        Delete
                    </button>
                </div>
            </div>
        ))}

        <dialog id="update-modal" className="modal ">
            <div className="modal-box bg-purple-300">
                <h3 className="font-bold text-lg">Update Task</h3>
                <div className='py-4'>
                    <label className='block text-gray-700 font-medium'>Title</label>
                    <input
                        type="text"
                        className='input input-bordered w-full'
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />

                    <label className='block text-gray-700 font-medium mt-3'>Description</label>
                    <textarea
                        className='textarea textarea-bordered w-full'
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="modal-action">
                    <button 
                        className="btn btn-primary text-white"
                        onClick={handleUpdateTask}
                    >
                        Save Changes
                    </button>
                    <button 
                        className="btn"
                        onClick={() => document.getElementById("update-modal").close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    </div>
  )
}

export default MyTaskComponent
