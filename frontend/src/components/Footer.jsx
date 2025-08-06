import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* Left Side */}
        <div>
            <img className='mb-5 w-40' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum autem illo, amet sint harum aliquid quibusdam, magnam modi hic aut at odio possimus repellendus fugit placeat quas expedita recusandae, ab labore reiciendis! Eos consequuntur rerum id, accusamus, animi officiis nisi.</p>
        </div>
        {/* Center Side */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        {/* Right Side */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+1-212-456-7898</li>
                <li>greatstackdev@gmail.com</li>
            </ul>
        </div>
      </div>
      <div>
        {/* COPYRIGHT TEXT */}
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025© PRESCRIPTO. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
