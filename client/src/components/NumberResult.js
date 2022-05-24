import React, { useEffect, useState } from 'react'
import { key } from '../key'
import { useParams } from 'react-router-dom'

const NumberResult = () => {

  let params = useParams()

  const [numberInfo, setNumberInfo] = useState({})

  const phoneNumberDetail = async () => {
    
    const data = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${key}&phone=1${params.number}`);
    const details = await data.json();
    setNumberInfo(details);

  }

  useEffect(() => {
    
    phoneNumberDetail()
  
  }, [params.number])
  

  return (
    <>
      {
        numberInfo.format === undefined
        ?
        ''
        :
        <p>
          {numberInfo.format.local}
        </p>
      }
      <p>{numberInfo.carrier}</p>
      <p>{numberInfo.location}</p>
      <p>{numberInfo.type}</p>
    </>
  )
}

export default NumberResult