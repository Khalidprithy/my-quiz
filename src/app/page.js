import Link from 'next/link';
export default function Page() {

  return (
    <div className="flex justify-center items-center h-screen p-2 bg-gray-800">
      <div className='flex items-center gap-5 '>
        <Link href='/daily-quiz/one' className='p-2 bg-green-500 hover:bg-blue-500 text-white rounded-lg cursor-pointer'>Quiz One</Link>
        <Link href='/daily-quiz/two' className='p-2 bg-green-500 hover:bg-blue-500 text-white rounded-lg cursor-pointer'>Quiz Two</Link>
      </div>
    </div>
  )
}
