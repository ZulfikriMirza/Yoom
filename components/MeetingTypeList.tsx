'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from "./HomeCard"
import { useRouter } from 'next/navigation';

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard 
              img="/icons/add-meeting.svg"
              title="New Meeting"
              description="start an instant meeting"
              handleClick={() => setMeetingState('isJoiningMeeting')}
              className="bg-orange-1"

            />

            

            <HomeCard 
                          img="/icons/schedule.svg"
                          title="Schedule Meeting"
                          description="Plan your meeting"
                          handleClick={() => setMeetingState('isScheduleMeeting')}
                     className="bg-blue-1"
            />
            <HomeCard 
              img="/icons/recordings.svg"
              title="View Recordings"
              description="Check out your recording"
              className = "bg-purple-1"
              handleClick={() => router.push('/recordings')}
          
 />
            <HomeCard 
               img="/icons/add-meeting.svg"
               title="New Meeting"
               description="start an instant meeting"
               className="bg-yellow-1"
               handleClick={() => router.push('/recordings')}
                     
            
            />
        </section>
  )
}

export default MeetingTypeList