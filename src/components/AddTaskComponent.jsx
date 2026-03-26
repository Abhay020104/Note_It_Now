import toast from 'react-hot-toast';
import { addTaskToFirestore } from '../services/taskService';
import { useState } from 'react';

const AddTaskComponent = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !taskDescription.trim()) {
            toast.error("Task title and description cannot be empty!");
            return;
        }

        setLoading(true);

        try {
            const newTask = {
                title: taskTitle,
                description: taskDescription,
                createdAt: new Date().toISOString(),
            };

            await addTaskToFirestore(newTask);

            setTaskTitle('');
            setTaskDescription('');
            toast.success("Task added successfully!");
        } catch (error) {
            toast.error("Failed to add task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
        <div className='flex flex-1/4 flex-col gap-2 bg-purple-100 rounded-md p-4'>
            <h1 className='text-purple-900 font-semibold text-lg'>Add Your Task</h1>
            <form onSubmit={handleAddTask} className='flex flex-col gap-3'>
                <input
                    type="text"
                    id='taskTitle'
                    placeholder='Task Title...'
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className='p-3 w-full text-white rounded-md border-gray-100 bg-purple-800 shadow-xs text-sm placeholder:text-gray-300'
                />

                <textarea
                    id='taskDescription'
                    cols='30'
                    rows='12'
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className='p-3 rounded-md text-sm w-full text-white border-gray-100 bg-purple-800 placeholder:text-gray-300 resize-none'
                    placeholder='Write your task here...'
                ></textarea>

                <button
                    type='submit'
                    disabled={loading}
                    className='btn w-full px-4 py-2 text-sm text-white rounded-md bg-purple-600 hover:bg-purple-800 transition ease-in-out'
                >{loading ? "Saving..." : "Save"}</button>    
            </form>
        </div>
    </>
  )
}

export default AddTaskComponent
