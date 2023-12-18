import React from 'react'
import { useLocation } from 'react-router-dom'

export default function CreatePost() {
const {state} = useLocation()
const id = state.Create.id

    return(
        <div className='Create'>
            Post Page
            Post Page
            {id}
        </div>
    )
}