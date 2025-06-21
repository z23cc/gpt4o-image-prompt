"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ScrollIndicator() {
  const [showIndicator, setShowIndicator] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight
      
      setScrollProgress(scrollPercent)
      
      // Show indicator when there's more content below and user hasn't scrolled much
      const shouldShow = scrollPercent < 0.9 && docHeight > window.innerHeight * 0.5
      setShowIndicator(shouldShow)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200/50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          style={{ scaleX: scrollProgress }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.1 }}
          transformOrigin="left"
        />
      </div>

      {/* Scroll Down Indicator */}
      <AnimatePresence>
        {showIndicator && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToBottom}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="h-5 w-5 text-slate-600" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

// Hook to detect if content is scrollable
export function useScrollable() {
  const [isScrollable, setIsScrollable] = useState(false)

  useEffect(() => {
    const checkScrollable = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight
      setIsScrollable(isScrollable)
    }

    checkScrollable()
    window.addEventListener('resize', checkScrollable)
    
    // Also check when content changes
    const observer = new MutationObserver(checkScrollable)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('resize', checkScrollable)
      observer.disconnect()
    }
  }, [])

  return isScrollable
}
