import ExploreBtn from './components/ExploreBtn'
import EventCard from './components/EventCard'
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const Home = async () => {
  "use cache";
  cacheLife('minutes'); // Cache this page for 10 minutes
  const response = await fetch(`${BASE_URL}/api/events`);
  const {events} = await response.json();
  console.log(events);

  if(!response.ok){
    throw new Error('Failed to fetch events');
  }
  return (
    <section>
      {/* eslint-disable-next-line react/no-unescaped-entities*/}
      <h1 className='text-center'>The Hub for Every Dev <br/> Event You Can't Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn/>

      <div className='mt-20 space-y-7'> 
        <h3>Feature Events</h3>
        <ul className='events list-none'>
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className='event'>
              <EventCard {...event}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
    
  )
}

export default Home