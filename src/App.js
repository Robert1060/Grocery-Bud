import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  const items = localStorage.getItem('list')
  if(items){
    return (JSON.parse(items))
  } 
  return []
}

function App() {
  const [name, setName] = useState('')
  const [list,setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({show:false,msg:'',type:''})

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name){
      showAlert(true, 'danger', 'Please enter value')
    } else if(name && isEditing){
      // edit func
      setList(list.map((item)=>{
        if(item.id === editID){
          return {...item, title:name}
        }
        return item
      }))
      setName('')
      setIsEditing(false)
      setEditID(null)
      setAlert(true, 'success', 'item edited successfully')
    } else {
      showAlert(true, 'success', 'item added successfully')
      const newItem = {id:new Date().getTime().toString(),title:name}
      setList([...list,newItem])
      setName('')
    }
  }

  const showAlert = (show=false, type='', msg='') => {
    setAlert({show,type,msg})
  }

  const clearList = () => {
    setList([])
    showAlert(true,'danger', 'empty list')
  }

  const removeItem = (id) => {
    const newList = list.filter((item)=>item.id === id)
    setList(newList)
    showAlert(true,'danger', 'item deleted')
  }

  const editItem = (id) => {
    const specificItem = list.find((item)=>item.id===id)
    setIsEditing(true)
    setEditID(id)
    setName(specificItem.title)
  }

  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list))
  },[list])

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} list={list} removeAlert={showAlert}/>}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='grocery'
          placeholder='e.g. milk'
          />
          <button className='submit-btn'>{isEditing ? 'edit' : 'add'}</button>
        </div>
      </form>
      <div className="grocery-container">
        <List items={list} removeItem={removeItem} editItem={editItem}/>
        <button className='clear-btn' onClick={()=>clearList()}>clear items</button>
      </div>
    </section>
  )
}

export default App
