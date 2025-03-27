import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    return response.json();
});

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        tasks: [],
        status: "idle",
        error: null,
    },
    reducers: {
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export const { addTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;