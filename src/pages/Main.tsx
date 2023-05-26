import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../login/LoginContext';
import { FormEvent, useContext, useEffect, useState } from 'react'

import '../styles/Main.scss'

import noTasksSvg from '../images/noTasks.svg'

//RADIX UI
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Toast from '@radix-ui/react-toast';
//RADIX UI

import { useApi } from '../hooks/useApi';

import { CheckIcon } from '@radix-ui/react-icons';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO } from 'date-fns';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons';

interface tasksProps {
  id: string,
  title: string,
  description: string,
  isComplete: boolean,
  taskDate: string,
  deadline: string
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 10));

export function Main() {
  const [tasks, setTasks] = useState<tasksProps[]>([])

  //DATA CALENDARIO
  const [calendarDate, setCalendarDate] = useState(new Date());
  //DATA CALENDARIO

  //SISTEMA FILTRO
  const [filterOn, setFilterOn] = useState(false)
  //SISTEMA FILTRO

  //INFO USUARIO
  const auth = useContext(LoginContext)
  //INFO USUARIO

  //RADIX UI
  const [openAlertNewTask, setOpenAlertNewTask] = useState(false)
  const [openAlertDeleteTask, setOpenAlertDeleteTask] = useState(false)
  const [openToast, setOpenToast] = useState(false);
  //RADIX UI

  //SISTEMA PORCENTAGENS
  const [percentage, setPercentage] = useState(0)
  const percentageComplete = percentage / tasks.length * 100;
  const formatedPercentageComplete = String(percentageComplete).split('.')[0]
  //SISTEMA PORCENTAGENS

  //FILTRO POR STATUS
  const [status, setStatus] = useState('noOrder')
  //FILTRO POR STATUS

  const navigate = useNavigate();

  const api = useApi()

  const [checkboxIdValue, setCheckboxIdValue] = useState('')

  //ALTERAR STATUS
  function alterStatus() {
    if(!filterOn){
      if(status === 'noOrder'){
        setStatus('orderIncomplete')
      } else if(status === 'orderIncomplete'){
        setStatus('orderComplete')
      } else if(status === 'orderComplete'){
        setStatus('noOrder')
      }
    }
  }
  //ALTERAR STATUS

  //PEGAR DATA DO CALENDARIO
  function alterDateCalendar(date: any){
    setCalendarDate(date)
  }
  //PEGAR DATA DO CALENDARIO

  //LOGOUT
  const handleLogout = async () => {
    await auth.signout();
    navigate('/')
  }
  //LOGOUT

  useEffect(() => {
    if(!filterOn){
      if(status === 'noOrder') {
        //FUNÇÃO LISTAGEM TAREFAS
        async function alterStatusList() {
          const storageData = localStorage.getItem('authToken')
          const data = await api.listTasks(String(storageData))
  
          if(data.tasks){
            setTasks(data.tasks)
            setPercentage(data.completedTasksLength)
          }
        }
        alterStatusList()
        //FUNÇÃO LISTAGEM TAREFAS

      } else if(status === 'orderIncomplete'){

        //FUNÇÃO LISTAGEM TAREFAS ORDENADO PELO STATUS INCOMPLETO
        async function alterStatusList() {
          const storageData = localStorage.getItem('authToken')
          const data = await api.listTasksByStatus(String(storageData))
  
          if(data.tasks){
            setTasks(data.tasks)
            setPercentage(data.completedTasksLength)
          }
        }
        alterStatusList()
        //FUNÇÃO LISTAGEM TAREFAS ORDENADO PELO STATUS INCOMPLETO

      } else if(status === 'orderComplete') {

        //FUNÇÃO LISTAGEM TAREFAS ORDENADO PELO STATUS COMPLETO
        async function alterStatusList() {
          const storageData = localStorage.getItem('authToken')
          const data = await api.listTasksByStatusComplete(String(storageData))
    
          if(data.tasks){
            setTasks(data.tasks)
            setPercentage(data.completedTasksLength)
          }
        }
        alterStatusList()
        //FUNÇÃO LISTAGEM TAREFAS ORDENADO PELO STATUS COMPLETO

      }
    } else {

      //FUNÇÃO LISTAGEM TAREFAS PELA DATA
      async function filterTasksByDate(){
        const formatedDate = format(calendarDate, 'MMM dd, yyyy')

        const storageData = localStorage.getItem('authToken')
        const data = await api.listTasksByDate(String(storageData), String(formatedDate))

        if(data.tasks){
          setTasks(data.tasks)
          setPercentage(data.completedTasksLength)
          setFilterOn(true)
        }
      }
      filterTasksByDate()
      //FUNÇÃO LISTAGEM TAREFAS PELA DATA

    }
  }, [checkboxIdValue, openAlertNewTask, status, openAlertDeleteTask])

  //CANCELAR FILTRO DE DATA
  async function getTasksToCleanFilter() {
    const storageData = localStorage.getItem('authToken')
    const data = await api.listTasks(String(storageData))

    if(data.tasks){
      setTasks(data.tasks)
      setPercentage(data.completedTasksLength)
      setFilterOn(false)
    }
  }
  //CANCELAR FILTRO DE DATA

  //CHECK NAS TAREFAS
  async function updateIsChecked(checkboxIdValue: string, updateCompletedTask: string){
    if(checkboxIdValue){
      const storageData = localStorage.getItem('authToken')
      await api.updateTasks(String(storageData), checkboxIdValue, updateCompletedTask)

      setCheckboxIdValue('')
    }
  }
  //CHECK NAS TAREFAS

  //FUNÇÃO LISTAGEM TAREFAS PELA DATA
  async function filterTasksByDate(){
    const formatedDate = format(calendarDate, 'MMM dd, yyyy')

    const storageData = localStorage.getItem('authToken')
    const data = await api.listTasksByDate(String(storageData), String(formatedDate))

    if(data.tasks){
      setTasks(data.tasks)
      setPercentage(data.completedTasksLength)
      setFilterOn(true)
    }
  }
  //FUNÇÃO LISTAGEM TAREFAS PELA DATA

  //CRIAR NOVAS TAREFAS
  async function createNewTask(e: FormEvent) {
    wait().then(() => setOpenAlertNewTask(false));
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    try {
      const date = data.deadline
      const todayDate = new Date()
      const parsedDate = parseISO(date as string)
      const storageData = localStorage.getItem('authToken')

      await axios.post(`http://localhost:3333/createNewTask`, 
      {
        title: data.title,
        description: data.description,
        deadline: format(parsedDate, 'MMM dd, yyyy'),
        taskDate: format(todayDate, 'MMM dd, yyyy'),
      },
      {
        headers: {
          'Authorization': `Bearer ${storageData}`
        }
      })

      setOpenToast(true)
    } catch(error: any) {
      alert(error)
    }
  }
  //CRIAR NOVAS TAREFAS

  //DELETA TAREFAS
  async function deleteTask(taskId: string){
    try {
      await api.deleteTasks(taskId)
      wait().then(() => setOpenAlertDeleteTask(false));
    } catch(error) {
      alert(error)
    }
  }
  //DELETA TAREFAS
  
  return (
    <div className='main'>
      <div className='sideBar'>
        
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button className='exitButton'>
                <FontAwesomeIcon  icon={faArrowRightFromBracket}></FontAwesomeIcon>
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="AlertDialogOverlay"/>
              <AlertDialog.Content className="AlertDialogContent">
                <AlertDialog.Title className="AlertDialogTitle">
                  Are you sure you want to quit?
                </AlertDialog.Title>
                <AlertDialog.Description className='AlertDialogDescription' >Check back often ;)</AlertDialog.Description>
                <div className='buttonsAlert'>
                  <AlertDialog.Cancel asChild>
                    <button className='cancelAlert'>Cancel</button>
                  </AlertDialog.Cancel>
                  <button className='exitAlert' onClick={handleLogout}>Exit</button>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>

      <div className='contentMain'>
        <div className='pageName'>
          <h2>Tasks</h2>
          <AlertDialog.Root open={openAlertNewTask} onOpenChange={setOpenAlertNewTask}>
            <AlertDialog.Trigger asChild>
              <button className='buttonNewTask'>New task</button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="AlertDialogOverlay"/>
              <AlertDialog.Content className="AlertDialogContent">
                <AlertDialog.Title className="AlertDialogTitle">
                  New Task
                </AlertDialog.Title>
                <form onSubmit={createNewTask} className='formNewTask'>
                  <p>Title</p>
                  <input type="text" name='title'/>
                  <p>Description</p>
                  <input type="text" name='description'/>
                  <p>Deadline</p>
                  <input type="date" name='deadline'/>
                
                <div className='buttonsAlert'>
                  <AlertDialog.Cancel asChild>
                    <button className='cancelAlert'>Cancel</button>
                  </AlertDialog.Cancel>
                  <button className='createAlert'>Create</button>
                </div>
                </form>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>

        </div>
        <div className='tasks'>
          {tasks.length > 0
          ?<table className='tableTasks'>
          <tbody>
            <tr>
              <th><p>Task name</p></th>
              <th><p>Deadline</p></th>
              <th className='thStatus'><p onClick={alterStatus}>Status</p><FontAwesomeIcon className={status} icon={faCaretUp} /></th>
              <th><p>Task date</p></th>
            </tr>
            {tasks.map(task => {
              return(
                <tr key={task.id}>
                  <td className='tdNameTask'>
                    <div>
                      <Checkbox.Root className="CheckboxRoot" defaultChecked={task.isComplete} id="c1"
                        onCheckedChange={(checked)=> {
                          if(checked){
                            
                            setCheckboxIdValue(task.id)
                            updateIsChecked(task.id, '+1')
                          } else {
                        
                            setCheckboxIdValue(task.id)
                            updateIsChecked(task.id, '-1')
                          }
                        }}
                      >
                        <Checkbox.Indicator className="CheckboxIndicator">
                          <CheckIcon />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      
                      <p title={task.title}>{task.title}</p>
                    </div>
                  </td>
                  <td className='tdDeadlineTask'>  
                    <p>{task.deadline}</p>
                  </td>
                  <td className='tdStatusTask'>  
                    <div className={task.isComplete? 'completeDiv' : 'incompleteDiv'}>{task.isComplete? 'Complete' : 'incomplete'}</div>
                  </td>
                  <td className='tdTaskDate'>  
                    {task.taskDate}
                  </td>
                  <td className='tdDeleteTask'>  
                  <AlertDialog.Root onOpenChange={setOpenAlertDeleteTask}>
                    <AlertDialog.Trigger asChild>
                      <button className='buttonDeleteTask'>Delete</button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="AlertDialogOverlay"/>
                      <AlertDialog.Content className="AlertDialogContent">
                        <AlertDialog.Title className="AlertDialogTitle">
                          Are you sure you want to delete this task?
                        </AlertDialog.Title>
                        <AlertDialog.Description className='AlertDialogDescription' >;-;</AlertDialog.Description>
                        <div className='buttonsAlert'>
                          <AlertDialog.Cancel asChild>
                            <button className='cancelAlert'>Cancel</button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button className='exitAlert' onClick={() => {deleteTask(task.id)}}>Delete</button>

                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        : <div className='noTasks'>
            <img src={noTasksSvg} alt="" />
          </div>
        }
        </div>
      </div>

      <div className='rightMain'>
        <div className='calendarDiv'>
          <Calendar className='calendar' onChange={alterDateCalendar} value={calendarDate}/>
          <div className='buttonsFilter'>
            <button className='filterDate' onClick={filterTasksByDate}>Filter</button>
            <button className='cancelDate' onClick={getTasksToCleanFilter}>X</button>
          </div>
        </div>
        
        <div className='rightContentProgressBar'>
          
          <div className='divContentProgressBar'>
            {!filterOn
            ? <h3>Progress on all tasks</h3>
            : <h3>Progress on this day</h3>
          }
            
            <div className='progressBarDiv'>
              <CircularProgressbar className='progressBar' value={Number(formatedPercentageComplete)} text={
                Number(formatedPercentageComplete) == Number(formatedPercentageComplete)?`${formatedPercentageComplete}%`
                :';)'
              } />

            </div>
          </div>
        </div>
      </div>
      <Toast.Provider swipeDirection="right">
        <Toast.Root className="ToastRoot" open={openToast} onOpenChange={setOpenToast}>
        <Toast.Title className="ToastTitle">Task created successfully</Toast.Title>
        <Toast.Description asChild>
            <p className='description'>time to work!</p>
        </Toast.Description>
        <Toast.Action className="ToastAction" asChild altText="Account created successfully ;)">
          <button></button>
        </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
      
    </div>
  )
}