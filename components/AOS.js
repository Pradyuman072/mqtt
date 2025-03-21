"use client"
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSProvider({ children }) {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      offset: 50,
    })
    
    // Optional: refresh AOS on window resize for responsive designs
    window.addEventListener('resize', () => {
      AOS.refresh();
    });
    
    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, [])
  
  return <>{children}</>
}