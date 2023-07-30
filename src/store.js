import { configureStore } from '@reduxjs/toolkit'
import fishReducer from './features/fish/fishSlice'

export const store = configureStore({
    reducer: {
        fish: fishReducer,
    },
})
