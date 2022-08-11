import { useMemo, useEffect } from 'react';
import { Data, EventTypes, getEvents, selectEvents } from '../app/events';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import styles from './Timeline.module.css';

const getDate = (date: string) => (new Date(date) as unknown as number)

const getNormalizedEvents = (data:Data)=>{
    const scale = getDate(data.intervalDates.dateEnd) - getDate(data.intervalDates.dateStart);
    return data.events.map((event)=>{
        return {
            start: (getDate(event.dateStart) - getDate(data.intervalDates.dateStart)) / scale * 100,
            length: (getDate(event.dateEnd) - getDate(event.dateStart)) / scale  * 100,
            type: event.type
        }
    })
}

const eventTypeStyles = [styles.normal, styles.dangerous, styles.critical];

const Event = ({start,length,type = 0}:{start:number,length:number, type?:EventTypes}) => 
    <div className={`${styles.event} ${eventTypeStyles[type]}`} style={{left:`${start}%`,width:`${length}%`,zIndex:type}}></div>
;

export const Timeline = () => {
    const dispatch = useAppDispatch();
    const events = useAppSelector(selectEvents);
  
    useEffect( () => {dispatch && dispatch(getEvents())},[dispatch]);
  
    const styledEvents = useMemo(()=>getNormalizedEvents(events),[events]);

    return (
        <div className={styles.timeline}>
            <div className={styles.scale}>
                {styledEvents.map((event, idx) => <Event key={idx} start={event.start} length={event.length} type={event.type}/> )}
            </div>
        </div>
    )
};