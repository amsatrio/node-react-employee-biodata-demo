import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchHealthStatus = createAsyncThunk(
    'health/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/v1/health/status');
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const healthSlice = createSlice({
    name: 'health',
    initialState: {
        data: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHealthStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHealthStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchHealthStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default healthSlice.reducer;