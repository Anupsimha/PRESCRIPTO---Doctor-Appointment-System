import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({specialty , docId}) => {

    const {doctors} = useContext(AppContext);

    const [relDoc , setRelDoc] = useState([]);

    useEffect(() => {
        if(doctors.length > 0 && specialty){
            const dectorsData = doctors.filter((doc) => doc.specialty === specialty)
        }
    } , [doctors , specialty , docId])


  return (
    <div>
      
    </div>
  )
}

export default RelatedDoctors
