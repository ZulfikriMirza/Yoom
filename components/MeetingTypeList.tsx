'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from "./HomeCard"
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { toast } from './ui/use-toast';

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const { user } = useUser();

  const client = useStreamVideoClient();

  const [callDetail, setcallDetail] = useState<Call>()

  const [values, setvalues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setcallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting Created',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };


    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard 
              img="/icons/add-meeting.svg"
              title="New Meeting"
              description="start an instant meeting"
              handleClick={() => setmeetingState('isInstantMeeting')}
              className="bg-orange-1"

            />

            

            <HomeCard 
                          img="/icons/schedule.svg"
                          title="Schedule Meeting"
                          description="Plan your meeting"
                    handleClick={() => setmeetingState('isScheduleMeeting')}
                     className="bg-blue-1"
            />
            <HomeCard 
              img="/icons/recordings.svg"
              title="View Recordings"
              description="Check out your recording"
              className = "bg-purple-1"
              handleClick={() => setmeetingState('isJoiningMeeting')}
             />
            
            <HomeCard 
               img="/icons/join-meeting.svg"
               title="Join Meeting"
               description="via invitation Link"
               className="bg-yellow-1"
               handleClick={() => setmeetingState('isJoiningMeeting')}
                     
            
            />

            <MeetingModal 
              isOpen={meetingState === 'isInstantMeeting'}
              onClose={() => setmeetingState(undefined)}
              title="Start an Instant Meeting"
              className="text-center"
              buttonText="Start Meeting"
              handleClick={createMeeting}
            />
        </section>
  )
}

export default MeetingTypeList