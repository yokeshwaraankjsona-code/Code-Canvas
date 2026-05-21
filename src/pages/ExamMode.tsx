import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { ExamModeContainer } from '../components/ExamMode/ExamModeContainer'

export default function ExamMode() {
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 pb-24" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />
        <ExamModeContainer />
      </div>
    </MainLayout>
  )
}
