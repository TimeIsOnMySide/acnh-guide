import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const url = 'https://acnhapi.com/v1/fish/'

const initialState = {
    allFish: [],
    isLoading: true,
}

export const getAllFish = createAsyncThunk(
    'fish/getAllFish',
    async (name, thunkAPI) => {
        try {
            const resp = await axios(url)
            return resp.data
        } catch (error) {
            return thunkAPI.rejectWithValue('something went wrong')
        }
    }
)

const fishSlice = createSlice({
    name: 'fish',
    initialState,
    extraReducers: {
        [getAllFish.pending]: (state) => {
            state.isLoading = true
        },
        [getAllFish.fulfilled]: (state, action) => {
            // console.log(action)
            state.isLoading = false
            state.allFish = action.payload
        },
        [getAllFish.rejected]: (state) => {
            state.isLoading = false
        },
    },
})

export default fishSlice.reducer
