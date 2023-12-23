import React from 'react'

function Loading() {
    return (
        <div className='flex justify-center items-center gap-2 w-full mx-auto" '>
            <div className='w-4 h-4 rounded-full bg-green-600 transition animate-bounce' style={{ animationDelay: '0.1s' }}></div>
            <div className='w-4 h-4 rounded-full bg-red-600 transition animate-bounce' style={{ animationDelay: '0.2s' }}></div>
            <div className='w-4 h-4 rounded-full bg-indigo-600 transition animate-bounce' style={{ animationDelay: '0.3s' }}></div>
            <div className='w-4 h-4 rounded-full bg-yellow-600 transition animate-bounce' style={{ animationDelay: '0.4s' }}></div>
        </div>
    )
}

export default Loading