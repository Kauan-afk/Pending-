import axios from "axios";

export const useApi = () => ({
    //VALIDAÇÃO DE TOKEN
    validateToken: async(token: string) => {
        const response = await axios.get('http://localhost:3333/validateLogin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return {
            user: response.data
        }
    },

    //SIGN IN
    signin: async(username: string, password: string) => {
        const response = await axios.post('http://localhost:3333/auth', {username, password});

        return {
            token: response.data.token,
            user: response.data.userExists
        }
    },

    //SIGN OUT
    signout: async() => {
        //const response = await api.post('/signout');
        return {
            status: true
        }
    },

    //LISTAGENS DE TASKS
    listTasks: async(token: string) => {
        const response = await axios.get('http://localhost:3333/listTasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return {
            tasks: response.data.tasks,
            completedTasksLength: response.data.completedTasksLength
        }
    },

    //COMPLETE TASKS
    updateTasks: async(token: string, taskId: string, updateCompletedTaskSignal: string) => {

        await axios.put('http://localhost:3333/updateTasks', {taskId, updateCompletedTaskSignal},
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return {
            status: true
        }
    },

    //LISTAGEM DE TASKS POR DATA
    listTasksByDate: async(token: string, date: string) => {
        const response = await axios.get(`http://localhost:3333/listTasksBydate/${date}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return {
            tasks: response.data.tasks,
            completedTasksLength: response.data.completedTasksLength
        }
    },

    //LISTAGEM DE TASKS PELO STATUS INCOMPLETO
    listTasksByStatus: async(token: string) => {
        const response = await axios.get(`http://localhost:3333/listTasksByStatus`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return {
            tasks: response.data.tasks,
            completedTasksLength: response.data.completedTasksLength
        }
    },

    //LISTAGEM DE TASKS PELO STATUS COMPLETO
    listTasksByStatusComplete: async(token: string) => {
        const response = await axios.get(`http://localhost:3333/listTasksByStatusComplete`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return {
            tasks: response.data.tasks,
            completedTasksLength: response.data.completedTasksLength
        }
    },

    deleteTasks: async(taskId: string) => {
        await axios.delete(`http://localhost:3333/deleteTask/${taskId}`)

    }
})