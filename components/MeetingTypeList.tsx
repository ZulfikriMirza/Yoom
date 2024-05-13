'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from "./HomeCard"
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { toast } from './ui/use-toast';
import { Textarea } from './ui/textarea';

import ReactDatePicker from 'react-datepicker';


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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`

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
            {!callDetail ? (
              <MeetingModal 
              isOpen={meetingState === 'isScheduleMeeting'}
              onClose={() => setmeetingState(undefined)}
              title="Create Meeting"
              handleClick={createMeeting}
              >
                <div className='flex flex-col gap-2.5'>
                  <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                  <Textarea className='border-non bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                  onChange={(e) => {
                    setvalues({...values, description: e.target.value})
                  }}
                  />
                </div>
                <div className='flex w-full flex-col gap-2.5'>
                  <label className='text-base text-normal leading-[22px] text-sky-2'>
                    Select Date and Time</label>
                    <ReactDatePicker 
                    selected={values.dateTime}
                    onChange={(date) => setvalues ({...values, dateTime: date! })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption='time'
                    dateFormat="MMM d, yyyy h:mm aa"
                    className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                    />
                </div>
              </MeetingModal>
            ) : (
              <MeetingModal isOpen={meetingState === 'isScheduleMeeting'}
              onClose={() => setmeetingState(undefined)}
              title="Meeting Created"
              className="text-center"
              handleClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({ title: 'Link copied'})
              }}
              image="icons/checked.svg"
              buttonIcon='/icons/copy.svg'
              buttonText="Copy meeting link"
            />
            )}
        </section>
  )
}

export default MeetingTypeList