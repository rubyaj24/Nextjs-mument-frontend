'use client'
import axios from "axios"
const Updates = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/daily-report`, { title, content });
      console.log("Update submitted:", response.data);
    } catch (error) {
      console.error("Error submitting update:", error);
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
        <h1>Daily Updates</h1>
        <form className='mt-4' onSubmit={handleSubmit}>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
                Update Title:
                <input 
                    type='text' 
                    name='title'
                    className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Enter update title'
                />
            </label>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
                Update Content:
                <textarea 
                    className='mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500'
                    rows={4}
                    placeholder='Enter update content'
                ></textarea>
            </label>
            <button 
                type='submit' 
                className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
            >
                Submit Update
            </button>
        </form>
    </div>
  )
}

export default Updates