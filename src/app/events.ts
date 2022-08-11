import axios, { AxiosRequestConfig } from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from './store';

export type Data = {
    events: Event[],
    intervalDates: IntervalDates,
    status?: 'pending' | 'fulfilied' | 'rejected' | undefined,
};

interface IntervalDates {
    dateStart: string // дата начала периода
    dateEnd: string // дата оĸончания периода
};

interface Event {
    dateStart: string // дата начала события
    dateEnd: string // дата оĸончания события
    type?: EventTypes
}

export enum EventTypes {
    NORMAL, // зеленый
    DANGEROUS, // желтый
    CRITICAL, // ĸрасный
}

const baseURL = 'https://pokeapi.co/api/v2/';
export const instance = axios.create({
    baseURL,
    timeout: 9000,
});
export const get = async <T>(url: string, options?: AxiosRequestConfig): Promise<T> => (await instance.get(baseURL + url, options)).data;

export const mockEvents:Data = {
    intervalDates:{
        dateStart: '2022-01-01T00:00:00',
        dateEnd: '2022-01-02T00:00:00',
    },
    events: [
        {
            dateStart: '2022-01-01T01:00:00',
            dateEnd: '2022-01-01T02:00:00',
            type: EventTypes.NORMAL
        },
        {
            dateStart: '2022-01-01T08:21:00',
            dateEnd: '2022-01-01T14:44:11',
            type: EventTypes.DANGEROUS
        },
        {
            dateStart: '2022-01-01T09:21:00',
            dateEnd: '2022-01-01T14:00:11',
            type: EventTypes.CRITICAL
        },
        {
            dateStart: '2022-01-01T22:11:00',
            dateEnd: '2022-01-01T23:50:00',
            type: EventTypes.CRITICAL
        },
    ],
    status:'fulfilied',
}

const initialState:Data = {
    intervalDates:{
        dateStart: '',
        dateEnd: '',
    },
    events: [
    ]
}

export const getEvents = createAsyncThunk('event', async () => get<Data>(`error/`));

export const events = createSlice({
    name:'events',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getEvents.pending,()=>({...mockEvents, status:'pending'}));
        builder.addCase(getEvents.rejected,()=>({...mockEvents, status:'rejected'}));
        builder.addCase(getEvents.fulfilled,()=>({...mockEvents, status: 'fulfilied'}));
    },
});

export const selectEvents = (state:RootState)=>state.events;