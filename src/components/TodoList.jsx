import React from 'react'
import { motion } from 'framer-motion'

const todos = [
  { id: 1, task: "Update product prices", day: "Today" },
  { id: 2, task: "Respond to customer queries", day: "Today" },
  { id: 3, task: "Schedule next week's promotions", day: "Tomorrow" },
];

export default function TodoList() {
  return (
    <motion.div 
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg text-agri-green-dark">To Do List</h2>
        <span className="text-xs font-medium text-agri-green bg-agri-green/10 px-2 py-1 rounded-full">{todos.length} tasks</span>
      </div>
      <ul className="space-y-3">
        {todos.map(todo => (
          <motion.li 
            key={todo.id} 
            className="flex items-center justify-between p-2 rounded-lg hover:bg-agri-gray transition-colors duration-200"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                id={`todo-${todo.id}`} 
                className="form-checkbox h-4 w-4 text-agri-green rounded border-gray-300 focus:ring-agri-green" 
              />
              <label htmlFor={`todo-${todo.id}`} className="text-gray-700 text-sm font-medium">{todo.task}</label>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 bg-agri-gray-dark rounded-full">{todo.day}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
