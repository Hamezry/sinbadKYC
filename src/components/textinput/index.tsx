import React, { useState } from 'react';
import { useField } from 'formik';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

interface TextInputInterface {
  id: string;
  name: string;
  label?: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'search' | 'number';
  placeholder?: string;
  autocomplete?: string;
  autoFocus?: boolean;
  required?: boolean;
}
const TextInput = (props: TextInputInterface) => {
  const [field, meta] = useField(props);
  const [type, setType] = useState(props.type);

  const toggleVisibility = () => {
    if (type === 'password') {
      return setType('text');
    } else {
      return setType('password');
    }
  };
  return (
    <div className='relative'>
      {props.label && (
        <label
          htmlFor={props.name || props.id}
          className='block mb-5 text-base tracking-wide text-[#54565b] dark:text-wdark-50 capitalize'>
          {props.label}{' '}
          {props.required && <span className='text-red-400'>*</span>}
        </label>
      )}
      <input
        type={type}
        id={props.id}
        autoFocus={props.autoFocus}
        autoComplete={props.autocomplete}
        className='block w-full appearance-none outline-none tracking-wider rounded-lg ring-1 ring-[#DAD9DA] focus:ring-afexpurple-lighter focus:ring-2 h-16 transition duration-150 py-3 px-4 placeholder:text-[#8F8E91]'
        placeholder={props.placeholder}
        {...field}
      />
      {props.type === 'password' && type === 'password' && (
        <AiOutlineEyeInvisible
          className='cursor-pointer text-2xl text-gray-400 absolute right-3 top-2/3 -translate-y-1/3  active:drop-shadow-md'
          onClick={toggleVisibility}
        />
      )}
      {props.type === 'password' && type === 'text' && (
        <AiOutlineEye
          className='cursor-pointer text-2xl text-gray-400 absolute right-3 top-2/3 -translate-y-1/3 active:drop-shadow-md'
          onClick={toggleVisibility}
        />
      )}
      {meta.error && meta.touched && (
        <span className='block text-red-400 text-xs pt-2'>{meta.error} </span>
      )}
    </div>
  );
};

export default TextInput;
