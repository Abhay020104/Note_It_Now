import NavbarComponent from '../components/Navbar'
import AddTaskComponent from '../components/AddTaskComponent'
import MyTaskComponent from '../components/MyTaskComponent'

const HomePage = () => {
  return (
    <div className="h-full">
      <NavbarComponent />
      <div className='flex flex-col w-full h-full md:flex-row gap-8 py-6 px-6'>
        <AddTaskComponent />
        <div className='flex flex-col gap-3 flex-3/4 md:w-1/2 bg-purple-100 rounded-md p-4'>
          <h1 className='text-purple-900 font-semibold text-lg'>My Tasks</h1>
          <MyTaskComponent />
        </div>
      </div>
    </div> 
  )
}

export default HomePage
